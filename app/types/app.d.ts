import { Locales } from "~/libs/i18next";
import { I18nextFunction } from "./i18next";

declare global {
	namespace Express {
		interface Request {
			t: I18nextFunction<Locales>;
			errorMessage: string;
		}
	}
}
