import i18next from "i18next";
import i18nextHttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import enviroments from "~/config";
import Cookie from "js-cookie";

i18next
	.use(i18nextHttpBackend)
	.use(initReactI18next)
	.init({
		debug: false,
		backend: {
			loadPath: `${enviroments.VITE_URL}/locales/{{lng}}/{{ns}}.json`,
		},
		fallbackLng: Cookie.get("i18next") ?? "es",
		lng: Cookie.get("i18next") ?? "es",
		interpolation: { escapeValue: false },
		ns: ["home", "translation", "validation"],
	});

export default i18next;
