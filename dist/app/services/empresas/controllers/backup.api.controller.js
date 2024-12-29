"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.BackupApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("valibot");
const backup_api_service_1 = require("../services/backup.api.service");
const valibot_3 = require("@vigilio/valibot");
const archiver_1 = __importDefault(require("archiver"));
const helpers_1 = require("@/uploads/libs/helpers");
const node_fs_1 = __importDefault(require("node:fs"));
const vigilioservices_guard_1 = require("../guards/vigilioservices.guard");
const permission_admin_guard_1 = require("@/auth/guards/permission-admin.guard");
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
let BackupApiController = class BackupApiController {
    constructor(backupsApiService) {
        this.backupsApiService = backupsApiService;
    }
    vigilio(type, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            switch (type) {
                case "backup": {
                    const result = yield this.backupsApiService.backup();
                    if (node_fs_1.default.existsSync(`${(0, helpers_1.pathUploads)()}/${result.file}`)) {
                        res.download(`${(0, helpers_1.pathUploads)()}/${result.file}`, (_a = result.file.split("/").at(-1)) !== null && _a !== void 0 ? _a : "backup.sql", (err) => {
                            if (err) {
                                console.error("Error al enviar el archivo:", err);
                                res.status(500).send("Error al enviar el archivo");
                            }
                        });
                    }
                    else {
                        res.status(404).send("Archivo no encontrado");
                    }
                    break;
                }
                case "restart": {
                    const result = yield this.backupsApiService.restart();
                    return result;
                }
                case "files": {
                    res.setHeader("Content-Disposition", `attachment; filename=${enviroments_config_1.default.CLIENT}-archivos.zip`);
                    res.setHeader("Content-Type", "application/zip");
                    const archive = (0, archiver_1.default)("zip", {
                        zlib: { level: 9 },
                    });
                    archive.on("error", (err) => {
                        throw new express_core_1.InternalServerErrorException(err.message);
                    });
                    archive.pipe(res);
                    archive.directory((0, helpers_1.pathUploads)(), false);
                    archive.finalize();
                    break;
                }
                default:
                    break;
            }
        });
    }
    restartWhatsappVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.backupsApiService.restartWhatsappVersion();
            return result;
        });
    }
    download(empresa, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.backupsApiService.downloadProducts(empresa);
                res.setHeader("Content-Disposition", `attachment; filename="backup_empresa_${empresa.slug}.xlsx"`);
                res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                res.send(result);
            }
            catch (error) {
                throw new express_core_1.InternalServerErrorException("Error al descargar, comunicarse con empresa, o conexion de internet");
            }
        });
    }
    downloadFiles(empresa, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.setHeader("Content-Disposition", `attachment; filename=${empresa.name_empresa}-archivos.zip`);
                res.setHeader("Content-Type", "application/zip");
                const archive = (0, archiver_1.default)("zip", {
                    zlib: { level: 9 },
                });
                archive.on("error", (err) => {
                    throw new express_core_1.InternalServerErrorException(err.message);
                });
                archive.pipe(res);
                archive.directory(`${(0, helpers_1.pathUploads)()}/${empresa.slug}`, false);
                archive.finalize();
            }
            catch (error) {
                throw new express_core_1.InternalServerErrorException("Error al descargar, comunicarse con empresa, o conexion de internet");
            }
        });
    }
    newVersion(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.backupsApiService.newVersion(empresa);
            return result;
        });
    }
};
exports.BackupApiController = BackupApiController;
__decorate([
    (0, vigilioservices_guard_1.VigilioServicesGuard)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        type: (0, valibot_3.string)([
            (0, valibot_3.custom)((val) => ["backup", "files", "restart"].includes(val), "type error: backup,files,restart "),
        ]),
    })),
    (0, express_core_1.Post)("/vigilio/:type"),
    __param(0, (0, express_core_1.Params)("type")),
    __param(1, (0, express_core_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BackupApiController.prototype, "vigilio", null);
__decorate([
    (0, vigilioservices_guard_1.VigilioServicesGuard)(),
    (0, express_core_1.Post)("/restart-whatsapp"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupApiController.prototype, "restartWhatsappVersion", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_1.Get)("/"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], BackupApiController.prototype, "download", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_1.Get)("/files"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], BackupApiController.prototype, "downloadFiles", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_1.Post)("/new-version"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], BackupApiController.prototype, "newVersion", null);
exports.BackupApiController = BackupApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_1.Controller)("/backup"),
    __metadata("design:paramtypes", [backup_api_service_1.BackupApiService])
], BackupApiController);
