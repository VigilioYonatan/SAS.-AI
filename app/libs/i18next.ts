import i18next, { t as tra } from "i18next";
import i18nextHttpBackend from "i18next-http-backend";
import i18nextHttpMiddleware from "i18next-http-middleware";
import enviroments from "~/config/enviroments.config";
import home from "../../public/locales/es/home.json";
import translation from "../../public/locales/es/translation.json";
import validation from "../../public/locales/es/validation.json";
import type { I18nextFunction, Paths } from "~/types/i18next";
import type { NextFunction, Request, Response } from "express";

i18next
    .use(i18nextHttpBackend)
    .use(i18nextHttpMiddleware.LanguageDetector)
    .init({
        debug: false,
        backend: {
            loadPath: `${enviroments.VITE_URL}/locales/{{lng}}/{{ns}}.json`,
        },
        lng: "es",
        fallbackLng: "es",
        interpolation: { escapeValue: false },
        ns: ["home", "translation", "validation"],
    });
export interface Locales {
    home: Paths<typeof home>;
    translation: Paths<typeof translation>;
    validation: Paths<typeof validation>;
}
export const t: I18nextFunction<Locales> = (key, options) => {
    return tra(key as unknown as string, options as unknown as string);
};
export const tvalibot: I18nextFunction<Locales> = (key, options) => {
    return JSON.stringify([key, options]);
};
export function cookiei18next(language: string) {
    const closeSession = 24 * 60 * 60 * 1000 * 30; // 30 dias
    return (res: Response) => {
        res.cookie("i18next", language, {
            httpOnly: false,
            maxAge: closeSession,
        });
    };
}
// verify that language use the client by default
export function i18nextMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const country = req.headers["accept-language"]?.split(",")[0];
    let detectedLanguage = req.language;
    if (req.cookies.i18next === undefined) {
        if (country === "en" || country === "en-US") {
            detectedLanguage = "en";
        } else if (country === "es" || country === "es-ES") {
            detectedLanguage = "es";
        } else if (country === "zh" || country === "zh-CN") {
            detectedLanguage = "zh";
        } else if (country === "pt" || country === "pt-BR") {
            detectedLanguage = "pt";
        } else {
            detectedLanguage = "en";
        }
        cookiei18next(detectedLanguage)(res);
    }
    next();
}
export default i18next;
