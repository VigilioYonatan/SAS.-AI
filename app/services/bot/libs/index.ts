import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import cache from "@vigilio/express-core/cache";
import { InformationEntity } from "@/information/entities/information.entity";
import { printFileWithDimension } from "@/uploads/libs/helpers";
import { formatMoney, subtotalIgv } from "@/cart/libs/helpers";
import { distanciaDeLevenshtein } from "~/libs/helpers";
import { Orders } from "@/orders/entities/orders.entity";
import { Categories } from "@/products/entities/categories.entity";
import { prompt } from "./prompt";
import type { PayMethods } from "@/orders/entities/pay_methods.entity";
import type { StatusOrders } from "@/orders/entities/status_orders.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import type { Users } from "@/users/entities/users.entity";
import { openAis } from "@/information/services/information.api.service";
import { Brands } from "@/products/entities/brands.entitiy";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import type { Variants } from "@/products/entities/options/variants.entity";
import { getProductAll, printVariantFeatures } from "@/products/libs";
import type { VariantsSchema } from "@/products/schemas/options/variants.schema";

export async function transcribeAudio(empresa: string, fileBuffer: Buffer) {
	const dirTemp = path.resolve(__dirname, "tmp");
	if (!fs.existsSync(dirTemp)) {
		fs.mkdirSync(dirTemp);
	}
	const filePath = `${dirTemp}/${crypto.randomUUID()}.wav`;

	fs.writeFileSync(filePath, fileBuffer);
	const file = fs.createReadStream(filePath);
	// Send the audio file for transcription using the specified model.
	const transcription = await openAis[empresa].audio.transcriptions.create({
		file,
		model: "whisper-1",
	});
	if (fs.existsSync(filePath)) {
		fs.unlinkSync(filePath);
	}
	// Return the transcription result.
	return transcription;
}

export async function onDb(information: InformationEntity) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const Products: any =
		information.tipo_empresa.tipo_servicio_id === 2
			? ProductsRestaurant
			: ProductsNormal;
	const [categorias, brands] = await Promise.all([
		Categories.unscoped().findAll({
			attributes: ["id", "name"],
			raw: true,
			where: {
				information_id: information.id,
			},
		}),
		Brands.unscoped().findAll({
			attributes: ["id", "name"],
			raw: true,
			where: {
				information_id: information.id,
			},
		}),
	]);

	let products = null;
	let servicios = null;
	if (information.tipo_empresa.tipo_servicio_id === 1) {
		const pr = await ProductsNormal.findAll({
			where: {
				information_id: information.id,
			},
		});
		products = await Promise.all(
			(pr as ProductsNormal[]).map(async (product) => {
				const producto = await getProductAll(information, product);
				const variantes = await Promise.all(
					(producto.dataValues.variants as Variants[]).map(async (variant) => {
						const {
							createdAt,
							updatedAt,
							id,
							stock,
							ilimit,
							images,
							product_normal_id,
							...rest
						} = variant as Variants;
						return {
							...rest,
							features: printVariantFeatures(
								product,
								variant as VariantsSchema & {
									features: {
										option_id: number;
										feature_id: number;
									}[];
								},
							),
							cantidad: ilimit ? "en stock" : `${stock} UND`,
						};
					}),
				);
				return {
					id: product.id,
					name: product.name.toLowerCase(),
					imagen: product.images
						? printFileWithDimension(information)(product.images, 500)[0]
						: "",
					price: subtotalIgv(information!, product),
					disponible: product.enabled,
					category_id: product.category_id ?? null,
					variantes,
					url: product.url ?? null,
				};
			}),
		);
	}
	if (information.tipo_empresa.tipo_servicio_id === 2) {
		const pr = await ProductsRestaurant.findAll({
			where: {
				information_id: information.id,
			},
		});
		products = await Promise.all(
			(pr as ProductsRestaurant[]).map(async (product) => {
				return {
					id: product.id,
					name: product.name.toLowerCase(),
					imagen: product.images
						? printFileWithDimension(information)(product.images, 500)[0]
						: "",
					characteristics: JSON.stringify(product.characteristics),
					price: subtotalIgv(information!, product),
					disponible: product.enabled,
					category_id: product.category_id ?? null,
					url: product.url ?? null,
				};
			}),
		);
	}
	if (information.tipo_empresa.tipo_servicio_id === 3) {
		const ser = await ProductsServicio.findAll({
			where: {
				information_id: information.id,
			},
		});
		servicios = await Promise.all(
			(ser as ProductsServicio[]).map(async (product) => {
				return {
					id: product.id,
					name: product.name.toLowerCase(),
					imagen: product.images
						? printFileWithDimension(information)(product.images, 500)[0]
						: "",
					days: product.days,
					description: product.description,
					characteristics: JSON.stringify(product.characteristics),
					price: subtotalIgv(information!, product),
					disponible: product.enabled,
					category_id: product.category_id ?? null,
					url: product.url ?? null,
				};
			}),
		);
	}

	return {
		categorias,
		brands,
		products,
		servicios,
	};
}

function encontrarPalabrasSimilares(texto: string, array: string[]) {
	const palabrasEncontradas = [];
	const palabrasTexto = texto.toLowerCase().trim().split(/\s+/);

	for (const palabra of array) {
		const palabraMin = palabra.toLowerCase().trim();
		for (const palabraTexto of palabrasTexto) {
			const umbral = Math.floor(palabraTexto.length * 0.2);
			if (
				palabraMin.includes(palabraTexto) ||
				distanciaDeLevenshtein(palabraMin, palabraTexto) <= umbral
			) {
				// Agregamos solo si hay una coincidencia exacta o muy cercana con alguna palabra en el texto
				if (palabraMin.includes(palabraTexto)) {
					palabrasEncontradas.push(palabra);
					break; // Rompemos el bucle interno si encontramos una coincidencia para evitar duplicados
				}
			}
		}
	}

	return palabrasEncontradas;
}

export async function promptReplace(
	message: string,
	information: InformationEntity,
) {
	let data: { products: { name: string }[] } = JSON.parse(
		cache.get(`db-${information.slug}`) ?? "null",
	);

	if (!data) {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		data = (await onDb(information)) as any;
		cache.set(
			`db-${information.slug}`,
			JSON.stringify(data),
			information.inteligenceArtificial.hour_update * 3600,
		);
	}
	let productsData = data.products;
	// si no es inteligente que busque
	if (!information.inteligenceArtificial.enabledBotInteligence) {
		const palabrasEncontradas2 = encontrarPalabrasSimilares(
			message,
			data.products.map((prod) => prod.name),
		);
		productsData = data.products.filter((prod) =>
			palabrasEncontradas2.includes(prod.name),
		);
	}
	const regex = /ord-[A-Za-z0-9]+/g;
	const coincidencias = message.toLowerCase().match(regex);
	let ordenes = "";
	if (information.inteligenceArtificial.settings.enabled_order) {
		ordenes =
			"ó Si te pido informacion de pedido: decime que los codigo empiezan en ORD- \n Ordenes:\n";
		if (coincidencias?.length) {
			const orden = await Promise.all(
				coincidencias?.map(async (code) => {
					const order = await Orders.findOne({
						where: { order_code: code.toUpperCase() },
						attributes: [
							"order_code",
							"address",
							"telephone",
							"total",
							"pay_method_id",
							"status_order_id",
						],
					});
					if (!order) return `${code.toUpperCase()} - no se encontró.\n`;

					return `Codigo: ${code.toUpperCase()}, Total:  ${formatMoney(
						information,
						order.total,
						information.money.money,
					)}, vendedor:${
						order.user ? (order.user as Users)?.username : "-"
					},Metododepago:${
						order.pay_method_id ? (order.pay_method as PayMethods).name : null
					}, direccion:${order.address}, estado: *${
						(order.status_order as StatusOrders).name
					}* \n`;
				}),
			);
			ordenes += `${orden.join(".")}\n`;
			productsData = [];
		} else {
			ordenes += "no hay pedidos aun";
		}
	}

	return `${prompt(
		information,
		productsData,
	)}. ${ordenes}. ERES UNA IA POR OPEN AI, pero fuiste entrenado por https://vigilio-services.com`;
}
