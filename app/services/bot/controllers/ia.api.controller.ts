import {
	Controller,
	Get,
	Params,
	Req,
	NotFoundException,
	InternalServerErrorException,
	BadRequestException,
	Query,
} from "@vigilio/express-core";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { isWhatsappTelegramIA } from "../libs/ai";
import { Empresas } from "@/empresas/entities/empresas.entity";
import * as cheerio from "cheerio";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import { chatgpt } from "../libs";

@Controller("/ia")
export class IAApiController {
	@PermissionAdmin()
	@Get("/images/:name")
	async images(
		@Params("name") name: string,
		@Req("empresa") empresa: Empresas,
	) {
		try {
			const whatsapp = await isWhatsappTelegramIA(empresa.slug);
			if (!whatsapp)
				throw new NotFoundException(
					"Hubo un problema al usar la IA, Recomiendo fijarse en los limites token",
				);
			const esMalaPalabra = await chatgpt(
				whatsapp,
				`'${name}'  si es mala palabra dime solo '1' y si no solo dime '2'. No digas nada mas que '1' o '2',porfavor`,
			);

			if (esMalaPalabra?.includes("1"))
				throw new BadRequestException("No válido");

			const response = await fetch(
				`https://www.bing.com/images/search?q=${`${name}`.replaceAll(
					" ",
					"+",
				)}&form=HDRSC3&first=1&cw=1202&ch=935`,
			);
			const result = await response.text();
			const $ = cheerio.load(result);

			const fathers = $(".iusc");
			const images = fathers
				.map((_, el) => {
					const element = $(el);
					const json = JSON.parse(element.attr("m")!);
					const preview = element.find("img").attr("src");
					const image = json.murl;
					return {
						image,
						preview: preview ? preview : image,
					};
				})
				.get();

			return {
				success: true,
				data: {
					images,
				},
			};
		} catch (error) {
			throw new InternalServerErrorException("Error server");
		}
	}
	@PermissionAdmin()
	@Pipe(objectAsync({ name: string() }))
	@Get("/product/:name")
	async description(
		@Params("name") name: string,
		@Req("empresa") empresa: Empresas,
		@Query()
		query: { caracterisiticas: string; images: string; descripcion: string },
	) {
		const {
			caracterisiticas: caracterisiticasClient = null,
			descripcion: descripcionClient = null,
			images: imagesClient = null,
		} = query;
		if (!caracterisiticasClient && !descripcionClient && !imagesClient)
			return {
				success: true,
				data: {
					images: [],
					description: "",
					caracterisiticas: [],
				},
			};
		try {
			const whatsapp = await isWhatsappTelegramIA(empresa.slug);
			if (!whatsapp)
				throw new NotFoundException(
					"Hubo un problema al usar la IA, Recomiendo fijarse en los limites token",
				);
			const esMalaPalabra = await chatgpt(
				whatsapp,
				`'${name}'  si es mala palabra dime solo '1' y si no solo dime '2'. No digas nada mas que '1' o '2',porfavor`,
			);

			if (esMalaPalabra?.includes("1"))
				throw new BadRequestException("No válido");
			let images: { image: string; preview: string }[] = [];
			if (imagesClient) {
				const response = await fetch(
					`https://www.bing.com/images/search?q=${`${name} fondo blanco`.replaceAll(
						" ",
						"+",
					)}&form=HDRSC3&first=1&cw=1202&ch=935`,
				);
				const result = await response.text();

				const $ = cheerio.load(result);

				const fathers = $(".iusc");
				images = fathers
					.map((_, el) => {
						const element = $(el);
						const json = JSON.parse(element.attr("m")!);
						const preview = element.find("img").attr("src");
						const image = json.murl;
						return {
							image,
							preview: preview ? preview : image,
						};
					})
					.get()
					.filter((a) => a)
					.slice(0, 8);
			}

			const desc = `Dame solo la "descripcion" y no otro en formato de tienda virtual de producto de ${name} en español  y no traer fuentes y no menciones otra cosa que no sea la descripción, y sin comillas "" por favor y información más actualizada`;
			const caract = `traeme las caracterisiticas del ${name}, valor y descripcion en un json [{key:"",value:""}] minimo 10 maximo 25,. solo traemw el json, no digas nada mas  y información más actualizada y no traigas precio`;
			//             const claveSat = `rame la clave catalog producto sat del "${name}", solo di la clave!! , no digas nada mas. ejemplo 292929292
			// `;

			const [description, caracterisiticas] = await Promise.all([
				descripcionClient ? chatgpt(whatsapp, desc) : "",
				caracterisiticasClient ? chatgpt(whatsapp, caract) : "[]",
			]);

			const cleanCharacterisitcas = caracterisiticasClient
				? caracterisiticas!
						.split("\n")
						.slice(1)
						.join("\n")
						.replace(/\\n/g, "")
						.replace(/^\s*json\s*\n/, "")
						.slice(0, -4)
				: "[]";

			return {
				success: true,
				data: {
					images,
					description,
					caracterisiticas: JSON.parse(cleanCharacterisitcas),
				},
			};
		} catch (error) {
			throw new InternalServerErrorException((error as Error).message);
		}
	}

	@PermissionAdmin()
	@Pipe(objectAsync({ name: string() }))
	@Get("/brand/:name")
	async brand(
		@Params("name") name: string,
		@Req("empresa") empresa: Empresas,
		@Query()
		query: { images: string },
	) {
		const { images: imagesClient = null } = query;
		if (!imagesClient)
			return {
				success: true,
				data: {
					images: [],
					description: "",
				},
			};
		try {
			const whatsapp = await isWhatsappTelegramIA(empresa.slug);
			const esMalaPalabra = await chatgpt(
				whatsapp,
				`'${name}'  si es mala palabra dime solo '1' y si no solo dime '2', recuerda solo 1 y 2 me dices`,
			);
			if (esMalaPalabra?.includes("1"))
				throw new BadRequestException("No válido");
			if (!whatsapp)
				throw new NotFoundException(
					"Hubo un problema al usar la ia, Recomiendo fijarse en los limites token",
				);
			let images: { image: string; preview: string }[] = [];
			if (imagesClient) {
				const response = await fetch(
					`https://www.bing.com/images/search?q=${`${name} logo png`.replaceAll(
						" ",
						"+",
					)}&form=HDRSC3&first=1&cw=1202&ch=935`,
				);
				const result: string | null = await response.text();

				const $ = cheerio.load(result);

				const fathers = $(".iusc");
				images = fathers
					.map((_, el) => {
						const element = $(el);
						const json = JSON.parse(element.attr("m")!);
						const preview = element.find("img").attr("src");
						const image = json.murl;
						return {
							image,
							preview: preview ? preview : image,
						};
					})
					.get()
					.filter((a) => a)
					.slice(0, 4);
			}

			return {
				success: true,
				data: {
					images,
				},
			};
		} catch (error) {
			throw new InternalServerErrorException((error as Error).message);
		}
	}
	@PermissionAdmin()
	@Pipe(objectAsync({ name: string() }))
	@Get("/category/:name")
	async category(
		@Params("name") name: string,
		@Req("empresa") empresa: Empresas,
		@Query()
		query: { images: string },
	) {
		try {
			const { images: imagesClient = null } = query;
			if (!imagesClient)
				return {
					success: true,
					data: {
						images: [],
						description: "",
					},
				};
			const whatsapp = await isWhatsappTelegramIA(empresa.slug);
			if (!whatsapp)
				throw new NotFoundException(
					"Hubo un problema al usar la IA, Recomiendo fijarse en los limites token",
				);
			const esMalaPalabra = await chatgpt(
				whatsapp,
				`'${name}'  si es mala palabra dime solo '1' y si no solo dime '2'`,
			);
			if (esMalaPalabra?.includes("1"))
				throw new BadRequestException("No válido");

			let images: { image: string; preview: string }[] = [];
			if (imagesClient) {
				const response = await fetch(
					`https://www.bing.com/images/search?q=${`${name} category`.replaceAll(
						" ",
						"+",
					)}&form=HDRSC3&first=1&cw=1202&ch=935`,
				);
				const result = await response.text();
				const $ = cheerio.load(result);

				const fathers = $(".iusc");
				images = fathers
					.map((_, el) => {
						const element = $(el);
						const json = JSON.parse(element.attr("m")!);
						const preview = element.find("img").attr("src");
						const image = json.murl;
						return {
							image,
							preview: preview ? preview : image,
						};
					})
					.get()
					.filter((a) => a)
					.slice(0, 8);
			}

			const prompt = `conoces fontawesome? tienes un icon en html <i class='fa' de ${name}? solo traime el html y en string y no en formato y no digas nada. solo traime el ico sin '' al principio ni al final`;
			const ico = await chatgpt(whatsapp, prompt);
			return {
				success: true,
				data: {
					images,
					ico,
				},
			};
		} catch (error) {
			throw new InternalServerErrorException("Error server");
		}
	}
}
