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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = getAccessToken;
exports.emailSendApi = emailSendApi;
exports.emailsAccountsAPI = emailsAccountsAPI;
exports.emailsAccountAPI = emailsAccountAPI;
const express_core_1 = require("@vigilio/express-core");
let accessToken = null;
let tokenExpiryTime = null;
function getAccessToken(empresa) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://accounts.zoho.com/oauth/v2/token?refresh_token=${empresa.zoho.refresh_token}&client_id=${empresa.zoho.client_id}&client_secret=${empresa.zoho.client_secret}&grant_type=refresh_token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = yield response.json();
            accessToken = result.access_token;
            tokenExpiryTime = Date.now() + result.expires_in * 1000;
            return result;
        }
        catch (error) {
            throw new express_core_1.InternalServerErrorException(`Error de servidor ${error.message}`);
        }
    });
}
function generateToken(empresa) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!accessToken ||
            !tokenExpiryTime ||
            Date.now() >= tokenExpiryTime - 300000) {
            yield getAccessToken(empresa);
        }
    });
}
function emailSendApi(empresa, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = {
            fromAddress: body.fromAddress,
            toAddress: body.toAddress,
            subject: body.subject,
            content: body.content,
        };
        if (body.ccAddress) {
            payload.ccAddress = body.ccAddress;
        }
        if (body.bccAddress) {
            payload.bccAddress = body.bccAddress;
        }
        if (body.attachments) {
            payload.attachments = body.attachments;
        }
        yield generateToken(empresa);
        const response = yield fetch(`https://mail.zoho.com/api/accounts/${empresa.zoho.account_id}/messages`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Zoho-oauthtoken ${accessToken}`,
            },
        });
        const result = yield response.json();
        if (!response.ok)
            throw new express_core_1.InternalServerErrorException(JSON.stringify(result));
        return result;
    });
}
function emailsAccountsAPI(empresa) {
    return __awaiter(this, void 0, void 0, function* () {
        yield generateToken(empresa);
        const response = yield fetch("https://mail.zoho.com/api/accounts", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Zoho-oauthtoken ${accessToken}`,
            },
        });
        const result = yield response.json();
        if (!response.ok)
            throw new express_core_1.InternalServerErrorException(JSON.stringify(result));
        return result;
    });
}
function emailsAccountAPI(empresa, accountId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield generateToken(empresa);
        const response = yield fetch(`https://mail.zoho.com/api/accounts/${accountId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Zoho-oauthtoken ${accessToken}`,
            },
        });
        const result = yield response.json();
        if (!response.ok)
            throw new express_core_1.InternalServerErrorException(JSON.stringify(result));
        return result;
    });
}
