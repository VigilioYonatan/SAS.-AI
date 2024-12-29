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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const notifications_entity_1 = require("../entities/notifications.entity");
const express_core_2 = require("@vigilio/express-core");
const notifications_user_entity_1 = require("../entities/notifications_user.entity");
let NotificationsApiService = class NotificationsApiService {
    count(empresa, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield notifications_user_entity_1.NotificationsUser.count({
                where: {
                    user_id: user.id,
                    isRead: false,
                    empresa_id: empresa.id,
                },
            });
            return {
                success: true,
                data,
            };
        });
    }
    clean(empresa, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield notifications_user_entity_1.NotificationsUser.findAll({
                where: {
                    user_id: user.id,
                    isRead: false,
                    empresa_id: empresa.id,
                },
            });
            for (const notification of notifications) {
                yield notification.update({ isRead: true });
            }
            return {
                success: true,
                message: "Se limpiaron todas tus notificaiones",
            };
        });
    }
    show(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let notification = null;
            if (!Number.isNaN(Number(id))) {
                notification = yield notifications_entity_1.Notifications.findOne({
                    where: { empresa_id: empresa.id, id },
                });
            }
            if (!notification) {
                throw new express_core_2.NotFoundException(`No se encontró una notificación con ${id}`);
            }
            return {
                success: true,
                notification,
            };
        });
    }
    register(user, subscription) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user.update({ subscription });
            return {
                success: true,
                id: user.id,
            };
        });
    }
    store(notificationsStoreDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = new notifications_entity_1.Notifications(notificationsStoreDto);
            yield notification.save();
            const use = yield notification.$get("use");
            return {
                success: true,
                notification: Object.assign(Object.assign({}, notification.toJSON()), { use }),
            };
        });
    }
    update(empresa, user, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield notifications_user_entity_1.NotificationsUser.findOne({
                where: {
                    notification_id: body.notification_id,
                    user_id: user.id,
                    empresa_id: empresa.id,
                },
            });
            if (!notification)
                throw new express_core_2.BadRequestException("No se encontró notificación");
            yield notification.update({ isRead: body.isRead });
            return {
                success: true,
                notification,
            };
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { notification } = yield this.show(empresa, id);
            yield notification.destroy();
            return {
                success: true,
                message: `La notificación con el id: ${id} fue eliminado`,
            };
        });
    }
};
exports.NotificationsApiService = NotificationsApiService;
exports.NotificationsApiService = NotificationsApiService = __decorate([
    (0, express_core_1.Injectable)()
], NotificationsApiService);
