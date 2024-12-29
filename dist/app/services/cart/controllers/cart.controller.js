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
exports.CartController = void 0;
const express_core_1 = require("@vigilio/express-core");
const cart_service_1 = require("../services/cart.service");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const urls_payment_entity_1 = require("@/urls/entities/urls.payment.entity");
const dayjs_1 = require("~/libs/dayjs");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    index(res, items) {
        return __awaiter(this, void 0, void 0, function* () {
            let itemsResult = null;
            if (items) {
                try {
                    itemsResult = JSON.parse(items);
                }
                catch (error) {
                    return res.redirect("/");
                }
            }
            const result = yield this.cartService.index(itemsResult);
            return res.render("web/cart", result);
        });
    }
    servicio(res, empresa, slug, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.cartService.servicio(empresa, slug, user);
            return res.render("web/cart/servicio", result);
        });
    }
    url(hash, res, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const urls = yield urls_payment_entity_1.UrlsPayment.findOne({
                where: {
                    hash,
                    empresa_id: empresa.id,
                },
            });
            if (!urls || (0, dayjs_1.restarDays)(empresa, (0, dayjs_1.NOW)(empresa).format(), urls.time) <= 0)
                return res.redirect("/");
            return res.redirect(urls.url);
        });
    }
};
exports.CartController = CartController;
__decorate([
    (0, express_core_1.Get)("/"),
    __param(0, (0, express_core_1.Res)()),
    __param(1, (0, express_core_1.Query)("items")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "index", null);
__decorate([
    (0, express_core_1.Get)("/servicio/:slug"),
    __param(0, (0, express_core_1.Res)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __param(2, (0, express_core_1.Params)("slug")),
    __param(3, (0, express_core_1.Req)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function, String, Function]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "servicio", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({ hash: (0, valibot_2.string)() })),
    (0, express_core_1.Get)("/:hash"),
    __param(0, (0, express_core_1.Params)("hash")),
    __param(1, (0, express_core_1.Res)()),
    __param(2, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Function]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "url", null);
exports.CartController = CartController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_1.Controller)("/cart"),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
