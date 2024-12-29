"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.BackupApiService = void 0;
exports.vpsShowApi = vpsShowApi;
const express_core_1 = require("@vigilio/express-core");
const helpers_1 = require("@/uploads/libs/helpers");
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
const node_fs_1 = __importDefault(require("node:fs"));
const dayjs_1 = __importDefault(require("~/libs/dayjs"));
const empresas_entity_1 = require("../entities/empresas.entity");
const users_entity_1 = require("@/users/entities/users.entity");
const xlsx_style_1 = __importDefault(require("xlsx-style"));
const xlsx_1 = __importDefault(require("xlsx"));
const helpers_2 = require("~/libs/helpers");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
const products_servicio_entity_1 = require("@/products/entities/products_servicio.entity");
const products_restaurant_entity_1 = require("@/products/entities/products_restaurant.entity");
const sequelize_1 = require("sequelize");
const libs_1 = require("@/users/libs");
const subdominio_1 = require("../libs/subdominio");
function vpsShowApi() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${enviroments_config_1.default.VITE_VIGILIO_WEB}/api/vps/${enviroments_config_1.default.CLIENT}`);
        if (!response.ok)
            throw new express_core_1.BadRequestException("Error: VPS SHOW ");
        const result = yield response.json();
        return result;
    });
}
let BackupApiService = class BackupApiService {
    backup() {
        return __awaiter(this, void 0, void 0, function* () {
            const containerName = enviroments_config_1.default.DB_CONTAINER;
            const username = enviroments_config_1.default.DB_USER;
            const dbname = enviroments_config_1.default.DB_NAME;
            const nameFile = `backup-${(0, dayjs_1.default)().format("DD-MM-YYYY.HH.mm.ss")}.sql`;
            const containerBackupPath = nameFile;
            const hostBackupPath = `${(0, helpers_1.pathUploads)()}/backup`;
            if (!node_fs_1.default.existsSync(hostBackupPath)) {
                node_fs_1.default.mkdirSync(hostBackupPath);
            }
            const filesql = `${hostBackupPath}/${nameFile}`;
            const dumpCommand = `docker exec ${containerName} pg_dump -U ${username} -d ${dbname} -F c -f ${containerBackupPath}`;
            yield (0, helpers_2.terminal)(dumpCommand);
            const copyCommand = `docker cp ${containerName}:${containerBackupPath} ${filesql}`;
            yield (0, helpers_2.terminal)(copyCommand);
            const removeCommand = `docker exec ${containerName} rm ${containerBackupPath}`;
            yield (0, helpers_2.terminal)(removeCommand);
            return {
                success: true,
                message: "backup finalizado correctamente",
                file: `backup/${nameFile}`,
            };
        });
    }
    restartWhatsappVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const emp = yield empresas_entity_1.Empresas.findAll({
                    attributes: ["slug", "port", "whatsapp_mode"],
                });
                const slugs = emp
                    .filter((container) => container.whatsapp_mode.type === "FREE")
                    .map((container) => container.slug);
                const command1 = `docker rm -f ${slugs.join(" ")} || true`;
                const command2 = slugs
                    .map((slug) => `docker volume rm ${slug} || true`)
                    .join(" && ");
                yield (0, helpers_2.terminal)(command1);
                yield (0, helpers_2.terminal)(command2);
                const result = yield vpsShowApi();
                yield (0, helpers_2.terminal)(`docker rmi ${enviroments_config_1.default.DOCKER_IMAGE_WHATSAPP} || true`);
                yield Promise.all(emp.map((emp) => __awaiter(this, void 0, void 0, function* () {
                    yield (0, helpers_2.terminal)(`docker volume create ${emp.slug} && docker run -d --name ${emp.slug} -e PORT=5000 -e NODE_ENV=${enviroments_config_1.default.NODE_ENV} -e SESSION_NAME=${emp.slug} -e VITE_TOKEN_VIGILIO_SERVICES=${enviroments_config_1.default.VITE_TOKEN_VIGILIO_SERVICES} --restart always --memory="${result.vps.whatsapp_ram || "1000"}m" --memory-swap="${result.vps.whatsapp_ram || "1000"}m" --cpus="${result.vps.whatsapp_cpu_max || "1"}" -p ${emp.port}:5000 -v ${emp.slug}:/app/data ${enviroments_config_1.default.DOCKER_IMAGE_WHATSAPP}`);
                })));
                return {
                    success: true,
                    message: "OK",
                };
            }
            catch (error) {
                throw new express_core_1.BadRequestException(error.message);
            }
        });
    }
    restart() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dumpCommand = "pm2 restart 0";
                yield (0, helpers_2.terminal)(dumpCommand);
            }
            catch (error) {
                throw new express_core_1.BadRequestException("error pm2 - comunicarse con empresa.");
            }
        });
    }
    downloadProducts(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [products, restaurant, servicios, usuarios, clients] = yield Promise.all([
                    products_normal_entity_1.ProductsNormal.findAll({
                        where: {
                            empresa_id: empresa.id,
                        },
                    }),
                    products_restaurant_entity_1.ProductsRestaurant.findAll({
                        where: {
                            empresa_id: empresa.id,
                        },
                    }),
                    products_servicio_entity_1.ProductsServicio.findAll({
                        where: {
                            empresa_id: empresa.id,
                        },
                    }),
                    users_entity_1.Users.findAll({
                        where: {
                            empresa_id: empresa.id,
                            [sequelize_1.Op.not]: {
                                role_id: libs_1.ROLES.user,
                            },
                        },
                        attributes: [
                            "user_code",
                            "username",
                            "name",
                            "lastname",
                            "email",
                            "address",
                            "telephone",
                            "speciality",
                            "enabled",
                            "birthday",
                            "empresa_id",
                            "createdAt",
                        ],
                    }),
                    users_entity_1.Users.findAll({
                        where: { empresa_id: empresa.id, role_id: libs_1.ROLES.user },
                        attributes: [
                            "name",
                            "address",
                            "telephone",
                            "enabled",
                            "empresa_id",
                        ],
                    }),
                ]);
                const wb = xlsx_1.default.utils.book_new();
                function dynamicStyle(key, headers, values) {
                    const ws_data = [
                        [
                            `${key}  (${values.length} UND)`,
                            Array.from({ length: headers.length - 1 }).map(() => ""),
                        ],
                        [],
                        headers,
                        ...values,
                    ];
                    const ws = xlsx_1.default.utils.aoa_to_sheet(ws_data);
                    const abecedarios = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
                    ws.A1.s = {
                        font: { bold: true, sz: 14, color: { rgb: "000000" } },
                        alignment: { horizontal: "center" },
                        fill: {
                            fgColor: { rgb: "FFFFFF" },
                        },
                    };
                    ws["!merges"] = [
                        { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
                    ];
                    headers.forEach((_, i) => {
                        ws[`${abecedarios[i]}3`].s = {
                            font: { bold: true, color: { rgb: "FFFFFF" } },
                            fill: {
                                fgColor: {
                                    rgb: empresa.setting.bg_color.startsWith("#")
                                        ? empresa.setting.bg_color
                                            .replace("#", "")
                                            .toUpperCase()
                                        : empresa.setting.bg_color.toUpperCase(),
                                },
                            },
                        };
                    });
                    xlsx_1.default.utils.book_append_sheet(wb, ws, key);
                }
                if (products.length) {
                    dynamicStyle("Productos", [
                        "id",
                        "CODIGO",
                        "NOMBRE",
                        "PRECIO",
                        "DESCUENTO",
                        "URL",
                        "DISPONIBLE",
                        "CATEGORIA",
                        "MARCA",
                        "REGISTRADO",
                    ], products.map((prod, i) => [
                        `${i + 1}`,
                        prod.product_code,
                        prod.name,
                        prod.price.toFixed(2),
                        prod.discount.toString(),
                        prod.url,
                        prod.enabled ? "✔" : "❌",
                        prod.category_id.toString(),
                        prod.brand_id ? prod.brand_id.toString() : "❌",
                        (0, dayjs_1.default)(prod.createdAt).format("DD-MM-YYYY") || "",
                    ]));
                }
                if (servicios.length) {
                    dynamicStyle("Servicios", [
                        "id",
                        "CODIGO",
                        "NOMBRE",
                        "PRECIO",
                        "DESCUENTO",
                        "URL",
                        "DISPONIBLE",
                        "CATEGORIA",
                        "REGISTRADO",
                    ], servicios.map((prod, i) => [
                        `${i + 1}`,
                        prod.product_code,
                        prod.name,
                        prod.price.toFixed(2),
                        prod.discount.toString(),
                        prod.url,
                        prod.enabled ? "✔" : "❌",
                        prod.category_id.toString(),
                        (0, dayjs_1.default)(prod.createdAt).format("DD-MM-YYYY") || "",
                    ]));
                }
                if (restaurant.length) {
                    dynamicStyle("Productos", [
                        "id",
                        "CODIGO",
                        "NOMBRE",
                        "PRECIO",
                        "DESCUENTO",
                        "URL",
                        "DISPONIBLE",
                        "CATEGORIA",
                        "REGISTRADO",
                    ], restaurant.map((prod, i) => [
                        `${i + 1}`,
                        prod.product_code,
                        prod.name,
                        prod.price.toFixed(2),
                        prod.discount ? prod.discount.toString() : "0",
                        prod.url ? prod.url : "",
                        prod.enabled ? "✔" : "❌",
                        prod.category_id ? prod.category_id.toString() : "",
                        (0, dayjs_1.default)(prod.createdAt).format("DD-MM-YYYY") || "",
                    ]));
                }
                dynamicStyle("Usuarios", [
                    "ID",
                    "CODIGO",
                    "USUARIO",
                    "NOMBRE",
                    "APELLIDOS",
                    "CORREO",
                    "DIRECCION",
                    "TELEFONO",
                    "ESPECIALIDAD",
                    "DISPONIBLE",
                    "NACIMIENTO",
                    "REGISTRADO",
                ], usuarios.map((usuario, i) => [
                    `${i + 1}`,
                    usuario.user_code,
                    usuario.username || "",
                    usuario.name || "",
                    usuario.lastname || "",
                    usuario.email || "",
                    usuario.address || "",
                    `+${empresa.dial_code} ${usuario.telephone}` || "",
                    usuario.speciality || "",
                    usuario.enabled ? "✔" : "❌",
                    (0, dayjs_1.default)(usuario.birthday).format("DD-MM-YYYY") || "",
                    (0, dayjs_1.default)(usuario.createdAt).format("DD-MM-YYYY") || "",
                ]));
                dynamicStyle("Clientes", [
                    "ID",
                    "NOMBRE COMPLETO",
                    "TELEFONO",
                    "DIRECCIÓN",
                    "HABILITADO",
                ], clients.map((client, i) => [
                    `${i + 1}`,
                    client.name,
                    client.telephone,
                    client.address || "",
                    client.enabled ? "✔" : "❌",
                ]));
                const excelBuffer = xlsx_style_1.default.write(wb, {
                    bookType: "xlsx",
                    type: "buffer",
                });
                return excelBuffer;
            }
            catch (error) {
                throw new express_core_1.BadRequestException("ERROR MESSAGE");
            }
        });
    }
    newVersion(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${enviroments_config_1.default.VITE_VIGILIO_WEB}/api/version/by_latest/${empresa.slug}/${empresa.versionamiento}`);
            const result = yield response.json();
            if (!result.success) {
                throw new express_core_1.BadRequestException(result.message);
            }
            yield empresas_entity_1.Empresas.update({ versionamiento: result.latest_version.versionamiento }, {
                where: {
                    slug: empresa.slug,
                },
            });
            yield (0, subdominio_1.newVersionVPS)({
                commando: result.commando,
                ip: result.vps.ip,
                password: result.vps.password,
                GIT_TOKEN: result.GIT_TOKEN,
                version: result.latest_version.versionamiento,
            });
            return {
                success: true,
                message: "new version executed",
            };
        });
    }
};
exports.BackupApiService = BackupApiService;
exports.BackupApiService = BackupApiService = __decorate([
    (0, express_core_1.Injectable)()
], BackupApiService);
