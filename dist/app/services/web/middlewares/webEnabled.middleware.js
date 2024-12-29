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
exports.webEnabledMiddleware = webEnabledMiddleware;
const helpers_1 = require("@/uploads/libs/helpers");
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
function webEnabledMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const emp = req.empresa;
            if (!emp.enabled_catalogo) {
                const html = `<div style="width:100%;height:100vh;display:flex;justify-content:center;align-items:center;flex-direction:column;">
                                    <h1>En este momento no estamos no estamos disponible </h1>
									${req.empresa.logo
                    ? `<img src="${(0, helpers_1.printFileWithDimension)(req
                        .empresa)(req
                        .empresa.logo, 100)}" width="100" height="100" style=""/>`
                    : ""}
                                   
                                    <a href="https://wa.me/${req.empresa
                    .dial_code}${(_a = req.empresa) === null || _a === void 0 ? void 0 : _a.telephoneFirst}" _target="blank">Comunicate con nosotros ${(_b = req.empresa) === null || _b === void 0 ? void 0 : _b.telephoneFirst}</a>
                                </div>
								 - MAXIMO ${emp.isFreeVPS
                    ? `MAXIMO ${enviroments_config_1.default.MAX_USERS || 30} personas en línea, Vuelva en unos minutos`
                    : ""}
								`;
                return res.send(html);
            }
        }
        catch (error) {
            return res.send("error");
        }
        next();
    });
}
