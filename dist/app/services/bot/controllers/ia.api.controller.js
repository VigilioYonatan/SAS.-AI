"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IAApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const ai_1 = require("../libs/ai");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const cheerio = __importStar(require("cheerio"));
const permission_admin_guard_1 = require("@/auth/guards/permission-admin.guard");
const libs_1 = require("../libs");
let IAApiController = class IAApiController {
    images(name, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const whatsapp = yield (0, ai_1.isWhatsappTelegramIA)(empresa.slug);
                if (!whatsapp)
                    throw new express_core_1.NotFoundException("Hubo un problema al usar la IA, Recomiendo fijarse en los limites token");
                const esMalaPalabra = yield (0, libs_1.chatgpt)(whatsapp, `'${name}'  si es mala palabra dime solo '1' y si no solo dime '2'. No digas nada mas que '1' o '2',porfavor`);
                if (esMalaPalabra === null || esMalaPalabra === void 0 ? void 0 : esMalaPalabra.includes("1"))
                    throw new express_core_1.BadRequestException("No válido");
                const response = yield fetch(`https://www.bing.com/images/search?q=${`${name}`.replaceAll(" ", "+")}&form=HDRSC3&first=1&cw=1202&ch=935`);
                const result = yield response.text();
                const $ = cheerio.load(result);
                const fathers = $(".iusc");
                const images = fathers
                    .map((_, el) => {
                    const element = $(el);
                    const json = JSON.parse(element.attr("m"));
                    const preview = element.find("img").attr("src");
                    const image = json.murl;
                    return {
                        image,
                        preview: preview ? preview : image,
                    };
                })
                    .get();
                return {
                    success: true,
                    data: {
                        images,
                    },
                };
            }
            catch (error) {
                throw new express_core_1.InternalServerErrorException("Error server");
            }
        });
    }
    description(name, empresa, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { caracterisiticas: caracterisiticasClient = null, descripcion: descripcionClient = null, images: imagesClient = null, } = query;
            if (!caracterisiticasClient && !descripcionClient && !imagesClient)
                return {
                    success: true,
                    data: {
                        images: [],
                        description: "",
                        caracterisiticas: [],
                    },
                };
            try {
                const whatsapp = yield (0, ai_1.isWhatsappTelegramIA)(empresa.slug);
                if (!whatsapp)
                    throw new express_core_1.NotFoundException("Hubo un problema al usar la IA, Recomiendo fijarse en los limites token");
                const esMalaPalabra = yield (0, libs_1.chatgpt)(whatsapp, `'${name}'  si es mala palabra dime solo '1' y si no solo dime '2'. No digas nada mas que '1' o '2',porfavor`);
                if (esMalaPalabra === null || esMalaPalabra === void 0 ? void 0 : esMalaPalabra.includes("1"))
                    throw new express_core_1.BadRequestException("No válido");
                let images = [];
                if (imagesClient) {
                    const response = yield fetch(`https://www.bing.com/images/search?q=${name.replaceAll(" ", "+")}&form=HDRSC3&first=1&cw=1202&ch=935`);
                    const result = yield response.text();
                    const $ = cheerio.load(result);
                    const fathers = $(".iusc");
                    images = fathers
                        .map((_, el) => {
                        const element = $(el);
                        const json = JSON.parse(element.attr("m"));
                        const preview = element.find("img").attr("src");
                        const image = json.murl;
                        return {
                            image,
                            preview: preview ? preview : image,
                        };
                    })
                        .get()
                        .filter((a) => a)
                        .slice(0, 8);
                }
                const desc = `Dame solo la "Descripcion", "Características Principales Y "Recomendaciones de uso" y no otro en formato de tienda virtual sobre ${empresa.type_empresa_other || empresa.tipo_empresa.value} de producto de ${name} en español  y no traer fuentes y no menciones otra cosa que no sea la descripción, y sin comillas "" por favor y información más actualizada. Importante: en formato html usa h2,h3,b ol <li data-list="bullet"><span class="ql-ui">valor-de-la-lista</span></li>, SIEMPRE USA <ol></ol>, en formato quill.js . Presentable Y NO MARKDOWN`;
                const caract = `traeme las caracterisiticas del ${name}, valor y descripcion en un json [{key:"",value:""}] minimo 10 maximo 25,. solo traemw el json, no digas nada mas  y información más actualizada y no traigas precio`;
                const [description, caracterisiticas] = yield Promise.all([
                    descripcionClient ? (0, libs_1.chatgpt)(whatsapp, desc) : "",
                    caracterisiticasClient ? (0, libs_1.chatgpt)(whatsapp, caract) : "[]",
                ]);
                const cleanCharacterisitcas = caracterisiticasClient
                    ? caracterisiticas
                        .split("\n")
                        .slice(1)
                        .join("\n")
                        .replace(/\\n/g, "")
                        .replace(/^\s*json\s*\n/, "")
                        .slice(0, -4)
                    : "[]";
                return {
                    success: true,
                    data: {
                        images,
                        description,
                        caracterisiticas: JSON.parse(cleanCharacterisitcas),
                    },
                };
            }
            catch (error) {
                throw new express_core_1.InternalServerErrorException(error.message);
            }
        });
    }
    brand(name, empresa, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { images: imagesClient = null } = query;
            if (!imagesClient)
                return {
                    success: true,
                    data: {
                        images: [],
                        description: "",
                    },
                };
            try {
                const whatsapp = yield (0, ai_1.isWhatsappTelegramIA)(empresa.slug);
                const esMalaPalabra = yield (0, libs_1.chatgpt)(whatsapp, `'${name}'  si es mala palabra dime solo '1' y si no solo dime '2', recuerda solo 1 y 2 me dices`);
                if (esMalaPalabra === null || esMalaPalabra === void 0 ? void 0 : esMalaPalabra.includes("1"))
                    throw new express_core_1.BadRequestException("No válido");
                if (!whatsapp)
                    throw new express_core_1.NotFoundException("Hubo un problema al usar la ia, Recomiendo fijarse en los limites token");
                let images = [];
                if (imagesClient) {
                    const response = yield fetch(`https://www.bing.com/images/search?q=${`${name} logo png`.replaceAll(" ", "+")}&form=HDRSC3&first=1&cw=1202&ch=935`);
                    const result = yield response.text();
                    const $ = cheerio.load(result);
                    const fathers = $(".iusc");
                    images = fathers
                        .map((_, el) => {
                        const element = $(el);
                        const json = JSON.parse(element.attr("m"));
                        const preview = element.find("img").attr("src");
                        const image = json.murl;
                        return {
                            image,
                            preview: preview ? preview : image,
                        };
                    })
                        .get()
                        .filter((a) => a)
                        .slice(0, 4);
                }
                return {
                    success: true,
                    data: {
                        images,
                    },
                };
            }
            catch (error) {
                throw new express_core_1.InternalServerErrorException(error.message);
            }
        });
    }
    category(name, empresa, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { images: imagesClient = null } = query;
                const whatsapp = yield (0, ai_1.isWhatsappTelegramIA)(empresa.slug);
                if (!whatsapp)
                    throw new express_core_1.NotFoundException("Hubo un problema al usar la IA, Recomiendo fijarse en los limites token");
                const esMalaPalabra = yield (0, libs_1.chatgpt)(whatsapp, `'${name}'  si es mala palabra dime solo '1' y si no solo dime '2'`);
                if (esMalaPalabra === null || esMalaPalabra === void 0 ? void 0 : esMalaPalabra.includes("1"))
                    throw new express_core_1.BadRequestException("No válido");
                let images = [];
                if (imagesClient) {
                    const response = yield fetch(`https://www.bing.com/images/search?q=${`${name} category`.replaceAll(" ", "+")}&form=HDRSC3&first=1&cw=1202&ch=935`);
                    const result = yield response.text();
                    const $ = cheerio.load(result);
                    const fathers = $(".iusc");
                    images = fathers
                        .map((_, el) => {
                        const element = $(el);
                        const json = JSON.parse(element.attr("m"));
                        const preview = element.find("img").attr("src");
                        const image = json.murl;
                        return {
                            image,
                            preview: preview ? preview : image,
                        };
                    })
                        .get()
                        .filter((a) => a)
                        .slice(0, 8);
                }
                const prompt = `conoces fontawesome? tienes un icon en html <i class='fa' de ${name}? solo traime el html y en string y no en formato y no digas nada. solo traime el ico sin '' al principio ni al final y ${empresa.setting.type_icons_bars === "light"
                    ? "y que sea light y no solid los iconos,"
                    : ""}`;
                const ico = yield (0, libs_1.chatgpt)(whatsapp, prompt);
                return {
                    success: true,
                    data: {
                        images,
                        ico,
                    },
                };
            }
            catch (error) {
                throw new express_core_1.InternalServerErrorException("Error server");
            }
        });
    }
};
exports.IAApiController = IAApiController;
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_1.Get)("/images/:name"),
    __param(0, (0, express_core_1.Params)("name")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], IAApiController.prototype, "images", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({ name: (0, valibot_2.string)() })),
    (0, express_core_1.Get)("/product/:name"),
    __param(0, (0, express_core_1.Params)("name")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __param(2, (0, express_core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, empresas_entity_1.Empresas, Object]),
    __metadata("design:returntype", Promise)
], IAApiController.prototype, "description", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({ name: (0, valibot_2.string)() })),
    (0, express_core_1.Get)("/brand/:name"),
    __param(0, (0, express_core_1.Params)("name")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __param(2, (0, express_core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, empresas_entity_1.Empresas, Object]),
    __metadata("design:returntype", Promise)
], IAApiController.prototype, "brand", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({ name: (0, valibot_2.string)() })),
    (0, express_core_1.Get)("/category/:name"),
    __param(0, (0, express_core_1.Params)("name")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __param(2, (0, express_core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, empresas_entity_1.Empresas, Object]),
    __metadata("design:returntype", Promise)
], IAApiController.prototype, "category", null);
exports.IAApiController = IAApiController = __decorate([
    (0, express_core_1.Controller)("/ia")
], IAApiController);
