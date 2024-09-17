import path from "node:path";
import enviroments from "./enviroments.config";

export const dirMode =
	enviroments.NODE_ENV === "production"
		? path.resolve(__dirname, "..", "..")
		: path.resolve(__dirname, "..", "..");
