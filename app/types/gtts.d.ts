declare module "gtts" {
	export default class gtts {
		constructor(text: string, lang?: string);
		save(filePath: string, callback?: (err: Error | null) => void): void;
	}
}
