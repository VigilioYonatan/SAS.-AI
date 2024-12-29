"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalMiddleware = void 0;
class GlobalMiddleware {
    use(_io, _sock, next) {
        console.log("********************conectado sockets correctamente***************");
        next();
    }
}
exports.GlobalMiddleware = GlobalMiddleware;
