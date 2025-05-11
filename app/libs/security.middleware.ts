import {
    attachMiddleware,
    InternalServerErrorException,
    UnauthorizedException,
} from "@vigilio/express-core";
import * as crypto from "node:crypto";
import type { NextFunction, Response, Request } from "express";
import enviroments from "~/config/enviroments.config";
export function hmacAuthMiddleware(
    req: Request,
    secretKey: string,
    isQuerySecret = false
) {
    const receivedSignature = isQuerySecret
        ? req.query["x-signature"]
        : req.headers["x-signature"];
    const timestamp = isQuerySecret
        ? req.query["x-timestamp"]
        : req.headers["x-timestamp"];
    if (!receivedSignature || !timestamp) {
        throw new UnauthorizedException("authorizacion requeridos");
    }
    if (Math.abs(Date.now() - Number.parseInt(timestamp as string)) > 300000) {
        throw new UnauthorizedException("Firma y timestamp is required");
    }
    if (!secretKey) {
        throw new InternalServerErrorException(
            "Error de configuración del servidor"
        );
    }

    const dataToSign = `${timestamp}:${req.method}:${req.originalUrl.replace(
        /[&?]x-(signature|timestamp)=[^&]+/g,
        ""
    )}`;

    const expectedSignature = crypto
        .createHmac("sha256", secretKey)
        .update(dataToSign)
        .digest("hex");

    if (receivedSignature !== expectedSignature) {
        throw new UnauthorizedException("Firma inválida");
    }
    return true;
}

export function HmacAuth(secretKey = enviroments.VITE_HMAC_SIGN) {
    return (
        target: unknown,
        propertyKey: string,
        _descriptor: PropertyDescriptor
    ) => {
        attachMiddleware(
            target,
            propertyKey,
            (req: Request, _: Response, next: NextFunction) => {
                const isAccepted = hmacAuthMiddleware(req, secretKey);

                if (isAccepted) {
                    return next();
                }
                throw new InternalServerErrorException("Error server");
            }
        );
    };
}
