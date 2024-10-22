import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import cache from "@vigilio/express-core/cache";
import { Empresas } from "@/empresas/entities/empresas.entity";
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
import { openAis } from "@/empresas/services/empresas.api.service";
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

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	fs.writeFileSync(filePath, fileBuffer as any);
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

export async function onDb(empresa: Empresas) {
	const [categorias, brands] = await Promise.all([
		Categories.unscoped().findAll({
			attributes: ["id", "name"],
			raw: true,
			where: {
				empresa_id: empresa.id,
			},
		}),
		Brands.unscoped().findAll({
			attributes: ["id", "name"],
			raw: true,
			where: {
				empresa_id: empresa.id,
			},
		}),
	]);

	let products = null;
	let servicios = null;
	if (empresa.tipo_empresa.tipo_servicio_id === 1) {
		const pr = await ProductsNormal.findAll({
			where: {
				empresa_id: empresa.id,
			},
		});
		products = await Promise.all(
			(pr as ProductsNormal[]).map(async (product) => {
				const producto = await getProductAll(empresa, product);
				const variantes = await Promise.all(
					(producto.dataValues.variants as Variants[]).map(async (variant) => {
						const { stock, ilimit, id } = variant as Variants;
						return {
							id,
							features: printVariantFeatures(
								product,
								variant as VariantsSchema & {
									features: {
										option_id: number;
										id: number;
									}[];
								},
							),
							cantidad: ilimit ? "en stock" : `${stock} unidades`,
						};
					}),
				);
				return {
					id: product.id,
					name: product.name.toLowerCase(),
					imagen: product.images
						? printFileWithDimension(empresa)(product.images, 500)[0]
						: "",
					price: subtotalIgv(empresa!, product),
					disponible: product.enabled,
					category_id: product.category_id ?? null,
					variantes,
					url: product.url ?? null,
					slug: product.slug,
					caracterisiticas: empresa.inteligenceArtificial
						.showAllProductsInformation
						? product.characteristics
						: [],
				};
			}),
		);
	}
	if (empresa.tipo_empresa.tipo_servicio_id === 2) {
		const pr = await ProductsRestaurant.findAll({
			where: {
				empresa_id: empresa.id,
			},
		});
		products = await Promise.all(
			(pr as ProductsRestaurant[]).map(async (product) => {
				return {
					id: product.id,
					name: product.name.toLowerCase(),
					imagen: product.images
						? printFileWithDimension(empresa)(product.images, 500)[0]
						: "",
					price: subtotalIgv(empresa!, product),
					cantidad: product.ilimit ? "en stock" : `${product.stock} unidades`,
					disponible: product.enabled,
					category_id: product.category_id ?? null,
					url: product.url ?? null,
					slug: product.slug,
					caracterisiticas: empresa.inteligenceArtificial
						.showAllProductsInformation
						? product.characteristics
						: [],
				};
			}),
		);
	}
	if (empresa.tipo_empresa.tipo_servicio_id === 3) {
		const ser = await ProductsServicio.findAll({
			where: {
				empresa_id: empresa.id,
			},
		});
		servicios = await Promise.all(
			(ser as ProductsServicio[]).map(async (product) => {
				return {
					id: product.id,
					name: product.name.toLowerCase(),
					imagen: product.images
						? printFileWithDimension(empresa)(product.images, 500)[0]
						: "",
					days: product.days,
					description: product.description,
					characteristics: JSON.stringify(product.characteristics),
					price: subtotalIgv(empresa!, product),
					disponible: product.enabled,
					category_id: product.category_id ?? null,
					slug: product.slug,
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

export async function promptReplace(message: string, empresa: Empresas) {
	let data: { products: { name: string }[] } = JSON.parse(
		cache.get(`db-${empresa.slug}`) ?? "null",
	);
	// verifica si el mensaje es un texto o pregunta de base de datos
	// const verifyMessage = await searchProducts(empresa, message);
	if (!data) {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		data = (await onDb(empresa)) as any;
		if (data.products.length > 20) {
			cache.set(
				`db-${empresa.slug}`,
				JSON.stringify(data),
				empresa.inteligenceArtificial.hour_update * 3600,
			);
		}
	}
	let productsData = data.products;
	// si no es inteligente que busque
	if (!empresa.inteligenceArtificial.enabledBotInteligence) {
		const palabrasEncontradas2 = encontrarPalabrasSimilares(
			message,
			data.products.map((prod) => prod.name),
		);
		productsData = data.products.filter((prod) =>
			palabrasEncontradas2.includes(prod.name),
		);
	}
	const regex = /ord-[0-9]+/g;
	const coincidencias = message.toLowerCase().match(regex);
	let ordenes = "";
	if (empresa.inteligenceArtificial.settings.enabled_order) {
		ordenes =
			"ó Si te pido informacion de pedido: decime que los codigo empiezan en ORD- \n Ordenes:\n";
		if (coincidencias?.length) {
			const orden = await Promise.all(
				coincidencias?.map(async (code) => {
					const order = await Orders.findOne({
						where: {
							order_code: code.toUpperCase(),
							empresa_id: empresa.id,
						},
						attributes: [
							"order_code",
							"address",
							"telephone",
							"total",
							"pay_method_id",
							"status_order_id",
							"description",
						],
					});
					if (!order) return `${code.toUpperCase()} - no se encontró.\n`;

					return `*Codigo: ${code.toUpperCase()}*\n*Total*:  ${formatMoney(
						empresa,
						order.total,
						empresa.money.money,
					)}\n*vendedor*:${
						order.user ? (order.user as Users)?.username : "-"
					}\n*Metodo de Pago*:${
						order.pay_method_id ? (order.pay_method as PayMethods).name : null
					}\n*Direccion*:${order.address}, estado: *${
						(order.status_order as StatusOrders).name
					}*\n*Descripcion*:${order.description}\n`;
				}),
			);
			ordenes += `${orden.join(".")}\n`;
			productsData = [];
		} else {
			ordenes += "no hay pedidos aun";
		}
	}

	return `${prompt(
		empresa,
		productsData,
	)}. ${ordenes}. ERES UNA IA POR OPEN AI, pero fuiste entrenado por https://vigilio-services.com`;
}
