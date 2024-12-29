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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresasApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const permission_admin_guard_1 = require("@/auth/guards/permission-admin.guard");
const vigilioservices_guard_1 = require("../guards/vigilioservices.guard");
const metodosPago_update_dto_1 = require("../dtos/metodosPago.update.dto");
const empresas_api_service_1 = require("../services/empresas.api.service");
const empresas_schema_1 = require("../schemas/empresas.schema");
const empresas_store_dto_1 = require("../dtos/empresas.store.dto");
const empresas_update_dto_1 = require("../dtos/empresas.update.dto");
const empresas_address_update_dto_1 = require("../dtos/empresas.address.update.dto");
const empresas_facturacion_store_dto_1 = require("../dtos/empresas.facturacion.store.dto");
const empresas_ia_update_dto_1 = require("../dtos/empresas.ia.update.dto");
const settings_schema_1 = require("../schemas/settings.schema");
const settings_update_dto_1 = require("../dtos/settings.update.dto");
let EmpresasApiController = class EmpresasApiController {
    constructor(empresaApiService) {
        this.empresaApiService = empresaApiService;
    }
    payment(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.payment(slug);
            return result;
        });
    }
    settings(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.settings(slug);
            return result;
        });
    }
    settingsTemplate(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.settingsTemplate(slug);
            return result;
        });
    }
    updateSettings(body, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.updateSettings(slug, body);
            return result;
        });
    }
    paymentUpdate(slug, paymentDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.paymentUpdate(slug, paymentDto);
            return result;
        });
    }
    store(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.store(body);
            return result;
        });
    }
    whatsapp_mode_get(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                success: true,
                whatsapp_mode: empresa.whatsapp_mode,
            };
        });
    }
    whatsapp_mode(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.whatsapp_mode(empresa, body);
            return result;
        });
    }
    private(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.private(empresa.slug);
            return result;
        });
    }
    metodos_pago(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.metodos_pago(slug);
            return result;
        });
    }
    metodospago(slug, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.metodospago(slug, body);
            return result;
        });
    }
    whatsappGroupIndex(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.whatsappGroupIndex(empresa.slug);
            return result;
        });
    }
    whatsappGroupShow(name, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.whatsappGroupShow(empresa.slug, name);
            return result;
        });
    }
    whatsappGroupStore(body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.whatsappGroupStore(empresa.slug, body);
            return result;
        });
    }
    whatsappConfigUpdate(body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.whatsappConfigUpdate(empresa.slug, body);
            return result;
        });
    }
    dominio(body, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.dominio(slug, body);
            return result;
        });
    }
    name_servers(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.name_servers(slug);
            return result;
        });
    }
    deleteDominio(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.deleteDominio(slug);
            return result;
        });
    }
    whatsappGroupUpdate(body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.whatsappGroupUpdate(empresa.slug, body);
            return result;
        });
    }
    whatsappGroupDestroy(group, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.whatsappGroupDestroy(empresa.slug, group);
            return result;
        });
    }
    whatsappGroupTelephoneDestroy(group, empresa, telephone) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.whatsappGroupTelephoneDestroy(empresa.slug, group, telephone);
            return result;
        });
    }
    show(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.show(slug);
            return result;
        });
    }
    update(body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.update(empresa, body);
            return result;
        });
    }
    address(body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.address(empresa, body);
            return result;
        });
    }
    company(body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.company(empresa, body);
            return result;
        });
    }
    inteligenceArtificial(body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.inteligenceArtificial(empresa.slug, body);
            return result;
        });
    }
    all(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.all(empresa.slug);
            return result;
        });
    }
    contactstore(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.contactStore(empresa.slug, body);
            return result;
        });
    }
    favorites(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.favorites(empresa.slug);
            return result;
        });
    }
    contacts(empresa, telephone, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.contacts(empresa.slug, telephone, body);
            return result;
        });
    }
    searchContact(empresa, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.searchContact(empresa.slug, name);
            return result;
        });
    }
    deleteContact(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.deleteContact(empresa);
            return result;
        });
    }
    destroyContact(empresa, telephone) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.contactDestroy(empresa.slug, telephone);
            return result;
        });
    }
    scheduleUpdate(body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.scheduleUpdate(empresa, body);
            return result;
        });
    }
    destroy(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.empresaApiService.destroy(id);
            return result;
        });
    }
};
exports.EmpresasApiController = EmpresasApiController;
__decorate([
    (0, vigilioservices_guard_1.VigilioServicesGuard)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({ slug: (0, valibot_2.string)() })),
    (0, express_core_1.Get)("/:slug/payment"),
    __param(0, (0, express_core_1.Params)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "payment", null);
__decorate([
    (0, vigilioservices_guard_1.VigilioServicesGuard)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({ slug: (0, valibot_2.string)() })),
    (0, express_core_1.Get)("/:slug/settings"),
    __param(0, (0, express_core_1.Params)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "settings", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({ slug: (0, valibot_2.string)() })),
    (0, express_core_1.Get)("/:slug/settings_template"),
    __param(0, (0, express_core_1.Params)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "settingsTemplate", null);
__decorate([
    (0, valibot_1.Validator)(settings_update_dto_1.settingsUpdateDto),
    (0, vigilioservices_guard_1.VigilioServicesGuard)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({ slug: (0, valibot_2.string)() })),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Put)("/:slug/settings"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Params)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "updateSettings", null);
__decorate([
    (0, vigilioservices_guard_1.VigilioServicesGuard)(),
    (0, valibot_1.Validator)((0, valibot_2.mergeAsync)([
        empresas_schema_1.payments,
        (0, valibot_2.object)({
            token: (0, valibot_2.string)(),
            secure: (0, valibot_2.string)(),
            enabled_zoho_mail: (0, valibot_2.boolean)(),
        }),
    ])),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({ slug: (0, valibot_2.string)() })),
    (0, express_core_1.Put)("/:slug/payment"),
    __param(0, (0, express_core_1.Params)("slug")),
    __param(1, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "paymentUpdate", null);
__decorate([
    (0, vigilioservices_guard_1.VigilioServicesGuard)(),
    (0, valibot_1.Validator)(empresas_store_dto_1.empresasStoreDto),
    (0, express_core_1.Post)("/"),
    __param(0, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "store", null);
__decorate([
    (0, express_core_1.Get)("/whatsapp_mode"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "whatsapp_mode_get", null);
__decorate([
    (0, valibot_1.Validator)((0, valibot_2.pickAsync)(empresas_schema_1.empresasSchema, ["whatsapp_mode"])),
    (0, express_core_1.Post)("/whatsapp_mode"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "whatsapp_mode", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_1.Get)("/private"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "private", null);
__decorate([
    (0, vigilioservices_guard_1.VigilioServicesGuard)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({ slug: (0, valibot_2.string)() })),
    (0, express_core_1.Get)("/:slug/metodos_pago"),
    __param(0, (0, express_core_1.Params)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "metodos_pago", null);
__decorate([
    (0, valibot_1.Validator)(metodosPago_update_dto_1.metodosPagoUpdateDto),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({ slug: (0, valibot_2.string)() })),
    (0, express_core_1.Put)("/:slug/metodos_pago"),
    __param(0, (0, express_core_1.Params)("slug")),
    __param(1, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "metodospago", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_1.Get)("/group-whatsapp"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "whatsappGroupIndex", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        name: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Get)("/group-whatsapp/:name"),
    __param(0, (0, express_core_1.Params)("name")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "whatsappGroupShow", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(empresas_schema_1.groupWhatsapp),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Post)("/group-whatsapp"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "whatsappGroupStore", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(empresas_schema_1.whatsappconfig),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Put)("/whatsapp-config"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "whatsappConfigUpdate", null);
__decorate([
    (0, vigilioservices_guard_1.VigilioServicesGuard)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({ slug: (0, valibot_2.string)() })),
    (0, valibot_1.Validator)((0, valibot_2.pickAsync)(settings_schema_1.hostSchema, ["host"])),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Put)("/:slug/dominio"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Params)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "dominio", null);
__decorate([
    (0, vigilioservices_guard_1.VigilioServicesGuard)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({ slug: (0, valibot_2.string)() })),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Put)("/:slug/name_servers"),
    __param(0, (0, express_core_1.Params)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "name_servers", null);
__decorate([
    (0, vigilioservices_guard_1.VigilioServicesGuard)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({ slug: (0, valibot_2.string)() })),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Delete)("/:slug/dominio"),
    __param(0, (0, express_core_1.Params)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "deleteDominio", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(empresas_schema_1.groupWhatsapp),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Put)("/group-whatsapp"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "whatsappGroupUpdate", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        group: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Delete)("/group-whatsapp/:group"),
    __param(0, (0, express_core_1.Params)("group")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "whatsappGroupDestroy", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        telephone: (0, valibot_2.string)(),
        group: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Delete)("/group-whatsapp/:group/telephone/:telephone"),
    __param(0, (0, express_core_1.Params)("group")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __param(2, (0, express_core_1.Params)("telephone")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function, String]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "whatsappGroupTelephoneDestroy", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        slug: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Get)("/:slug"),
    __param(0, (0, express_core_1.Params)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "show", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(empresas_update_dto_1.empresasUpdateDto),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Put)("/"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "update", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(empresas_address_update_dto_1.empresasAddressUpdateDto),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Put)("/address"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "address", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(empresas_facturacion_store_dto_1.empresasFacturacionUpdateDto),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Put)("/company"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "company", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(empresas_ia_update_dto_1.empresasIAUpdateDto),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Put)("/ia"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "inteligenceArtificial", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_1.Status)(200),
    (0, express_core_1.Get)("/contacts"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "all", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(empresas_schema_1.contactsSchema),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Post)("/contacts"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "contactstore", null);
__decorate([
    (0, express_core_1.Status)(200),
    (0, express_core_1.Get)("/contacts/favorites"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "favorites", null);
__decorate([
    (0, valibot_1.Validator)((0, valibot_2.omitAsync)(empresas_schema_1.contactsSchema, ["telephone", "name"])),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        telephone: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Put)("/contacts/:telephone"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Params)("telephone")),
    __param(2, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String, Object]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "contacts", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        name: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Get)("/contacts/:name"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Params)("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "searchContact", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_1.Delete)("/contacts"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "deleteContact", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        telephone: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Delete)("/contacts/:telephone"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Params)("telephone")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "destroyContact", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_1.Status)(201),
    (0, valibot_1.Validator)((0, valibot_2.objectAsync)({ schedule: (0, valibot_2.arrayAsync)(empresas_schema_1.scheduleSchema) })),
    (0, express_core_1.Put)("/schedule"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "scheduleUpdate", null);
__decorate([
    (0, express_core_1.Status)(201),
    (0, vigilioservices_guard_1.VigilioServicesGuard)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Delete)("/:id"),
    __param(0, (0, express_core_1.Params)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresasApiController.prototype, "destroy", null);
exports.EmpresasApiController = EmpresasApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_1.Controller)("/empresas"),
    __metadata("design:paramtypes", [empresas_api_service_1.EmpresasApiService])
], EmpresasApiController);
