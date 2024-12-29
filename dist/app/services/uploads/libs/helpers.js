"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadsProperties = exports.uploadsEntities = void 0;
exports.uploadFiles = uploadFiles;
exports.pathUploads = pathUploads;
exports.printFileWithDimension = printFileWithDimension;
exports.removeFile = removeFile;
const helpers_1 = require("@vigilio/express-core/helpers");
const sharp_1 = __importDefault(require("sharp"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const libs_1 = require("@/empresas/libs");
const config_1 = require("~/config");
const express_core_1 = require("@vigilio/express-core");
exports.uploadsEntities = [
    "products",
    "users",
    "empresas",
    "orders",
    "metodos_pago",
    "posts",
    "background",
    "categories",
    "subcategories",
    "brands",
    "suppliers",
    "new",
    "settings",
    "files",
];
exports.uploadsProperties = [
    "images",
    "image",
    "photo",
    "logo",
    "wallpaper",
    "certificado",
    "transferencia_image",
    "icon",
    "qrYape",
    "qrPlin",
    "logo_pwa",
    "file",
    "background_auth",
];
function uploadFiles(_a) {
    return __awaiter(this, arguments, void 0, function* ({ empresa, files, entity, name, qualities, directory = "/images", isPwa, }) {
        var _b, _c, _d, _e;
        let filesNames = [];
        const dirEmpresa = `${pathUploads()}/${empresa.slug}`;
        const dir = `${dirEmpresa}/${directory}`;
        const dirEntity = `${dir}/${entity}`;
        if (!node_fs_1.default.existsSync(dirEmpresa)) {
            node_fs_1.default.mkdirSync(dirEmpresa);
            console.log("Creado directorio correctamente");
        }
        if (!node_fs_1.default.existsSync(dir)) {
            node_fs_1.default.mkdirSync(dir);
            console.log("Creado directorio correctamente");
        }
        if (!node_fs_1.default.existsSync(dirEntity)) {
            node_fs_1.default.mkdirSync(dirEntity);
            console.log("Creado directorio correctamente");
        }
        let logo = null;
        if (entity === "products" && empresa.setting.isLogoImage && empresa.logo) {
            const response = yield fetch(printFileWithDimension(empresa)(empresa.logo, 300)[0]);
            const result = yield response.arrayBuffer();
            const width = 80;
            const height = 80;
            const radius = 40;
            const logoSharp = (0, sharp_1.default)(result)
                .resize(width, height)
                .composite([
                {
                    input: redondearImagen({
                        height,
                        width,
                        radius,
                    }),
                    blend: "dest-in",
                },
            ]);
            logo = yield logoSharp.toBuffer();
        }
        for (const file of files) {
            let sharpFiles = [];
            if (qualities && ((_b = file.mimetype) === null || _b === void 0 ? void 0 : _b.startsWith("image"))) {
                for (const quality of qualities) {
                    const fileName = `${name ? (0, helpers_1.slug)(name) : node_crypto_1.default.randomUUID()}${Date.now().toString(32).substring(4)}x${quality}.webp`;
                    filesNames = [
                        ...filesNames,
                        {
                            file: `${directory.slice(1)}/${entity}/${fileName}`,
                            dimension: quality,
                        },
                    ];
                    if (logo && quality !== 100) {
                        sharpFiles = [
                            ...sharpFiles,
                            (0, sharp_1.default)(file.filepath)
                                .resize(quality)
                                .composite([
                                {
                                    input: logo,
                                    gravity: "southeast",
                                    blend: "over",
                                },
                            ])
                                .webp({ quality: 90 })
                                .toFile(node_path_1.default.resolve(dirEntity, fileName)),
                        ];
                    }
                    if (isPwa) {
                        try {
                            function validateImage(filePath) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    try {
                                        const image = (0, sharp_1.default)(filePath);
                                        const metadata = yield image.metadata();
                                        const width = metadata.width;
                                        const height = metadata.height;
                                        const tolerance = 0.1;
                                        const minHeight = width * (1 - tolerance);
                                        const maxHeight = width * (1 + tolerance);
                                        if (height < minHeight || height > maxHeight) {
                                            throw new express_core_1.BadRequestException("La imagen no debe ser rectangular", { body: "logo_pwa" });
                                        }
                                        return true;
                                    }
                                    catch (error) {
                                        throw new express_core_1.InternalServerErrorException("error image");
                                    }
                                });
                            }
                            yield validateImage(file.filepath);
                            const width = Math.round(quality * 0.34);
                            const height = Math.round(quality * 0.34);
                            const logoSharp = (0, sharp_1.default)(`${config_1.dirMode}/public/images/settings/others/vigilio-services-ico.png`)
                                .resize({ width, height, fit: "inside" })
                                .toBuffer();
                            logo = yield logoSharp;
                            sharpFiles = [
                                ...sharpFiles,
                                (0, sharp_1.default)(file.filepath)
                                    .resize(quality)
                                    .composite([
                                    {
                                        input: logo,
                                        gravity: "southeast",
                                        blend: "over",
                                    },
                                ])
                                    .webp({ quality: 90 })
                                    .toFile(node_path_1.default.resolve(dirEntity, fileName)),
                            ];
                        }
                        catch (error) {
                            throw new express_core_1.InternalServerErrorException("error image");
                        }
                    }
                    else {
                        sharpFiles = [
                            ...sharpFiles,
                            (0, sharp_1.default)(file.filepath)
                                .resize(quality)
                                .webp({ quality: 90 })
                                .toFile(node_path_1.default.resolve(dirEntity, fileName)),
                        ];
                    }
                }
            }
            else {
                const ext = (_c = file.originalFilename) === null || _c === void 0 ? void 0 : _c.split(".").at(-1);
                const fileName = `${name ? (0, helpers_1.slug)(name) : node_crypto_1.default.randomUUID()}.${!(ext === null || ext === void 0 ? void 0 : ext.length)
                    ? "txt"
                    : ((_d = file.mimetype) === null || _d === void 0 ? void 0 : _d.startsWith("image"))
                        ? "webp"
                        : ext}`;
                if (entity === "files" && ((_e = file.mimetype) === null || _e === void 0 ? void 0 : _e.startsWith("image"))) {
                    (0, sharp_1.default)(file.filepath)
                        .webp({ quality: 90 })
                        .toFile(node_path_1.default.resolve(dirEntity, fileName));
                }
                else {
                    const fileexist = node_path_1.default.resolve(dirEntity, fileName);
                    node_fs_1.default.renameSync(file.filepath, fileexist);
                }
                filesNames = [
                    ...filesNames,
                    { file: `${directory.slice(1)}/${entity}/${fileName}` },
                ];
            }
            yield Promise.all(sharpFiles);
        }
        return filesNames;
    });
}
function pathUploads() {
    return `${config_1.dirMode}/public/empresas`;
}
function redondearImagen({ height, width, radius, }) {
    const roundedCorners = Buffer.from(`<svg width="${width}" height="${height}">
      <rect x="0" y="0" width="${width}" height="${height}" 
        rx="${radius}" ry="${radius}" 
        style="fill:white;" />
      <rect x="${radius}" y="0" width="${width - radius}" height="${radius}" 
        style="fill:black;" />
      <rect x="0" y="${radius}" width="${width}" height="${height - radius}" 
        style="fill:black;" />
    </svg>`);
    return roundedCorners;
}
function printFileWithDimension(empresa) {
    return (files, dimension) => {
        const filterImages = dimension
            ? files.filter((img) => img.file.startsWith("https://") ||
                img.dimension === dimension)
            : files;
        return filterImages.map((file) => file.file.startsWith("https://")
            ? file.file
            : `${(0, libs_1.BASE_URL)(empresa)}/empresas/${empresa.slug}/${file.file}`);
    };
}
function removeFile(slug, files) {
    for (const file of files) {
        const image = `${pathUploads()}/${slug}/${file.file}`;
        if (node_fs_1.default.existsSync(image)) {
            node_fs_1.default.unlinkSync(image);
        }
    }
}
