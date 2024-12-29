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
exports.EmailsApiService = void 0;
const emails_entity_1 = require("../entities/emails.entity");
const express_core_1 = require("@vigilio/express-core");
const users_entity_1 = require("@/users/entities/users.entity");
const libs_1 = require("../libs");
const email_send_api_1 = require("../apis/email.send.api");
const emails_offers_entity_1 = require("../entities/emails_offers.entity");
const libs_2 = require("@/users/libs");
const mailer_1 = require("~/libs/mailer");
let EmailsApiService = class EmailsApiService {
    store(empresa, emailsStoreDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (empresa.enabled_zoho_mail) {
                    if (!empresa.email || !empresa.zoho.email) {
                        throw new express_core_1.BadRequestException("Necesitas un correo electrónico Zoho");
                    }
                    if (!empresa.zoho.password) {
                        throw new express_core_1.BadRequestException("No se encontró contraseña zoho");
                    }
                    yield (0, mailer_1.sendMail)({
                        email: empresa.zoho.email,
                        password: empresa.zoho.password,
                    }, {
                        from: emailsStoreDto.email,
                        to: empresa.zoho.email,
                        subject: emailsStoreDto.subject,
                        text: emailsStoreDto.content,
                    });
                }
                yield emails_entity_1.Emails.create(Object.assign(Object.assign({}, emailsStoreDto), { empresa_id: empresa.id }));
                return {
                    success: true,
                    message: "Se envió correo correctamente",
                };
            }
            catch (error) {
                throw new express_core_1.BadRequestException(error.message);
            }
        });
    }
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = yield emails_entity_1.Emails.findByPk(id);
            if (!email)
                throw new express_core_1.NotFoundException("No se encontró email");
            return { success: true, email };
        });
    }
    sendAllUsers(empresa, emailsSendAllDto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!empresa.zoho.email || !empresa.zoho.password || !empresa.logo) {
                throw new express_core_1.BadRequestException("No se encontró zoho mail o contraseña zoho mail o logo de tu web");
            }
            try {
                const users = yield users_entity_1.Users.unscoped().findAll({
                    attributes: ["email", "username", "name", "lastname"],
                    where: { role_id: libs_2.ROLES.user },
                });
                const emailsPromociones = yield emails_offers_entity_1.EmailsPromociones.findAll();
                yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                    if (user.enabledEmailsOffers) {
                        const html = (0, libs_1.customEmailHTML)({
                            empresa,
                            namecomplete: `${user.username} - ${user.name} ${user.lastname ? user.lastname : ""}`,
                            content: emailsSendAllDto.content,
                            title: emailsSendAllDto.title,
                        });
                        yield (0, mailer_1.sendMail)({
                            email: empresa.zoho.email,
                            password: empresa.zoho.password,
                        }, {
                            from: empresa.zoho.email,
                            to: user.email,
                            subject: emailsSendAllDto.subject,
                            html,
                        });
                    }
                })));
                yield Promise.all(emailsPromociones.map((email) => __awaiter(this, void 0, void 0, function* () {
                    const html = (0, libs_1.customEmailHTML)({
                        empresa,
                        namecomplete: email.email,
                        content: emailsSendAllDto.content,
                        title: emailsSendAllDto.title,
                    });
                    yield (0, mailer_1.sendMail)({
                        email: empresa.zoho.email,
                        password: empresa.zoho.password,
                    }, {
                        from: empresa.zoho.email,
                        to: email.email,
                        subject: emailsSendAllDto.subject,
                        html,
                    });
                })));
                return {
                    success: true,
                    message: "Se envio los correo electrónicos correctamente.",
                };
            }
            catch (error) {
                throw new express_core_1.BadRequestException(error.message);
            }
        });
    }
    accounts(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, email_send_api_1.emailsAccountsAPI)(empresa);
            return result;
        });
    }
    account(empresa, account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, email_send_api_1.emailsAccountAPI)(empresa, account_id);
            return result;
        });
    }
};
exports.EmailsApiService = EmailsApiService;
exports.EmailsApiService = EmailsApiService = __decorate([
    (0, express_core_1.Injectable)()
], EmailsApiService);
