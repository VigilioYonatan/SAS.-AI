import { Injectable } from "@vigilio/express-core";
import { ProductsNormal } from "../entities/products_normal.entity";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import { Op } from "sequelize";
import { generateCodeEntity, NoImage } from "~/libs/helpers";
import { removeFile } from "@/uploads/libs/helpers";
import { NOW, TimePeru, restarDays } from "~/libs/dayjs";
import { InformationEntity } from "@/information/entities/information.entity";
import {
	areArraysEqual,
	combinacionesVariants,
	getProductAll,
	Product,
} from "../libs";
import { Coupons } from "../entities/coupons.entity";
import { ProductsRestaurant } from "../entities/products_restaurant.entity";
import { ProductsServicio } from "../entities/products_servicio.entity";
import type {
	ProductsNormalStoreDto,
	ProductsNormalUpdateDto,
} from "../dtos/products_normal.dto";
import type {
	ProductsRestaurantStoreDto,
	ProductsRestaurantUpdateDto,
} from "../dtos/products_restaurant.dto";
import type {
	ProductsServicioStoreDto,
	ProductsServicioUpdateDto,
} from "../dtos/products_servicio.dto";
import { ProductsOptions } from "../entities/options/products_options.entity";
import { VariantsFeatures } from "../entities/options/variants_features.entity";
import WooCommerceRestApi, {
	type WooCommerceRestApiOptions,
} from "@woocommerce/woocommerce-rest-api";
import type { ProductsNormalSchema } from "../schemas/products_normal.schema";
import { removeTextHTML } from "../../../libs/helpers";
import { Categories } from "../entities/categories.entity";
import type { CategoriesSchema } from "../schemas/categories.schema";
import Shopify from "shopify-api-node";
import { parseStringPromise } from "xml2js";
import { slug } from "@vigilio/express-core/helpers";
import type { VariantsUpdateDto } from "../dtos/options/variants.update.dto";
import { Variants } from "../entities/options/variants.entity";
import type { Features } from "../entities/options/features.entity";
import type { Options } from "../entities/options/options.entity";

@Injectable()
export class ProductsApiService {
	async index() {
		const data = await ProductsNormal.findAll();
		return {
			success: true,
			data,
		};
	}
	async show(information: InformationEntity, slug: string, allProduct = false) {
		let product = null;
		if (!Number.isNaN(Number(slug))) {
			product = (await Product(information).findOne({
				where: {
					id: slug,
					information_id: information.id,
				},
			})) as ProductsNormal | ProductsRestaurant | ProductsServicio;
		} else {
			product = (await Product(information).findOne({
				where: {
					slug,
					information_id: information.id,
				},
			})) as ProductsNormal | ProductsRestaurant | ProductsServicio;
		}
		if (!product) {
			const message = `No se encontró un producto con ${slug}`;

			throw new NotFoundException(message);
		}
		if (allProduct) {
			product = await getProductAll(information, product);
		}

		return {
			success: true,
			product,
		};
	}
	async woocommerce(information: InformationEntity) {
		if (!information.credentials_web?.woocommerce)
			throw new BadRequestException("No está permitido");
		async function getAll(key: string) {
			let page = 1;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			let allProducts: any[] = [];
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			let products: any;

			try {
				while (true) {
					products = await api.get(key, {
						per_page: 100,
						page,
					});
					if (products.length === 0) {
						break;
					}
					allProducts = allProducts.concat(products.data);

					page++;
				}
			} catch (error) {
				console.error("Error al obtener productos:", error);
			}

			return allProducts;
		}
		const opt: WooCommerceRestApiOptions = {
			url: information.web,
			consumerKey: information.credentials_web?.woocommerce.consumerKey,
			consumerSecret: information.credentials_web?.woocommerce.consumerSecret,
			version: "wc/v3",
		};
		const api = new WooCommerceRestApi(opt);
		const products = await getAll("products");
		await Categories.destroy({
			where: {
				information_id: information.id,
			},
		});
		const category = await Categories.create({
			name: "test",
			category_code: "CAT-000001",
			image: [{ file: NoImage(), dimension: 500 }],
			information_id: information.id,
			slug: "test",
		} as Omit<CategoriesSchema, "id">);

		if (information.tipo_empresa.tipo_servicio === 1) {
			await ProductsNormal.destroy({
				where: { information_id: information.id },
			});

			const productsMapped: Omit<ProductsNormalSchema, "id">[] = products.map(
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				(product: any, i: number) => {
					return {
						product_code: `PROD-000${i + 1}`,
						name: product.name,
						description: `${removeTextHTML(product.description).slice(
							0,
							1000,
						)}...`,
						characteristics: [], // Aquí puedes definir cómo mapear características
						enabled: product.status === "publish",
						price: product.regular_price,
						discount:
							((product.regular_price - product.sale_price) /
								product.regular_price) *
								100 ?? 0, // Aquí puedes calcular el descuento si lo manejas
						slug: product.slug,
						images: product.images
							? product.images.map((img: { src: string }) => ({
									dimension: 500,
									file: img.src ?? NoImage(),
								}))
							: [{ dimension: 500, file: NoImage() }],
						category_id: category.id,
						brand_id: null, // Puedes definir una lógica para esto si es necesario
						url: product.permalink,
						information_id: information.id, // Puedes definir cómo establecer esto
					};
				},
			);
			await ProductsNormal.bulkCreate(productsMapped);
		}

		return { success: true, message: "Ejecutado woocomerce" };
	}

	async shopify(information: InformationEntity) {
		if (!information.credentials_web?.shopify)
			throw new BadRequestException("No está permitido");
		const shopify = new Shopify({
			shopName: information.credentials_web?.shopify.dominioweb, // El nombre de tu tienda Shopify sin 'myshopify.com'
			apiKey: information.credentials_web?.shopify.apiKey, // Tu API Key
			password: information.credentials_web?.shopify.password, // Tu API Password
			autoLimit: true, // Opcional: Gestiona automáticamente los límites de tasa});
		});

		async function getAll(key: string) {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			let products: any[] = [];
			let page = 1;
			try {
				while (true) {
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					const response = await (shopify as any)[key].list({
						limit: 250, // Máximo de productos por página (Shopify permite hasta 250)
						page: page,
					});

					if (response.length === 0) {
						break;
					}

					products = products.concat(response);
					page++;
				}
			} catch (error) {
				console.error("Error obteniendo los productos:", error);
			}
			return products;
		}
		const products = await getAll("product");

		await Categories.destroy({
			where: {
				information_id: information.id,
			},
		});
		const category = await Categories.create({
			name: "test",
			category_code: "CAT-000001",
			image: [{ file: NoImage(), dimension: 500 }],
			information_id: information.id,
			slug: "test",
		} as Omit<CategoriesSchema, "id">);
		if (information.tipo_empresa.tipo_servicio === 1) {
			await ProductsNormal.destroy({
				where: { information_id: information.id },
			});

			const productsMapped: Omit<ProductsNormalSchema, "id">[] = products.map(
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				(product: any, i: number) => {
					return {
						product_code: `PROD-000${i + 1}`,
						name: product.title,
						description: `${removeTextHTML(product.body_html).slice(
							0,
							1000,
						)}...`,
						characteristics: [], // Aquí puedes definir cómo mapear características
						enabled: product.status === "active",
						price: product.variants[0].compare_at_price ?? 0,
						discount:
							((product.variants[0].compare_at_price -
								product.variants[0].price) /
								product.variants[0].compare_at_price) *
								100 ?? 0, // Aquí puedes calcular el descuento si lo manejas
						slug: product.handle,
						images: product.images
							? product.images.map((img: { src: string }) => ({
									dimension: 500,
									file: img.src ?? NoImage(),
								}))
							: [{ dimension: 500, file: NoImage() }],
						category_id: category.id,
						brand_id: null, // Puedes definir una lógica para esto si es necesario
						url: null,
						information_id: information.id, // Puedes definir cómo establecer esto
					};
				},
			);
			await ProductsNormal.bulkCreate(productsMapped);
			return { success: true, message: "Ejecutado shopify" };
		}
	}

	async prestaShop(information: InformationEntity) {
		if (!information.credentials_web?.prestashop)
			throw new BadRequestException("No está permitido");
		try {
			const response = await fetch(`${information.web}/api/products`, {
				headers: {
					Authorization: `Basic ${Buffer.from(`${"API_KEY"}:`).toString(
						"base64",
					)}`,
					"Content-Type": "application/xml",
				},
			});
			if (!response.ok) {
				throw new BadRequestException(`Error: ${response.statusText}`);
			}
			const productsXml = await response.text();
			const result = await parseStringPromise(productsXml);
			const products = result.prestashop.products;

			await Categories.destroy({
				where: {
					information_id: information.id,
				},
			});
			const category = await Categories.create({
				name: "test",
				category_code: "CAT-000001",
				image: [{ file: NoImage(), dimension: 500 }],
				information_id: information.id,
				slug: "test",
			} as Omit<CategoriesSchema, "id">);
			if (information.tipo_empresa.tipo_servicio === 1) {
				await ProductsNormal.destroy({
					where: { information_id: information.id },
				});

				const productsMapped = products.map(
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					(product: any, i: number) => {
						const name = product.name[0].language.find(
							(lang: { $: { id: string } }) => lang.$.id === "1",
						)._;

						const description = product.description[0].language.find(
							(lang: { $: { id: string } }) => lang.$.id === "1",
						)._;

						return {
							product_code: `PROD-000${i + 1}`,
							name: name, // Tomando el primer valor del array
							description: `${removeTextHTML(description).slice(0, 1000)}...`,
							characteristics: [], // Aquí puedes definir cómo mapear características
							enabled: true, // Cambia según el estado del producto
							price: Number.parseFloat(product.price[0]), // Convertir el precio a número
							discount: 0, // Aquí puedes calcular el descuento si lo manejas
							slug: slug(name), // Generar slug a partir del nombre
							images: null,
							category_id: category.id, // Ajusta según tu categoría
							brand_id: null, // Ajusta según tu marca
							url: null, // Genera URL del producto
							information_id: information.id, // Puedes definir cómo establecer esto
						};
					},
				);
				await ProductsNormal.bulkCreate(productsMapped);
				return { success: true, message: "Ejecutado shopify" };
			}
		} catch (error) {
			console.error("Error al obtener productos:", error);
		}
	}
	async coupon(
		product_id: string,
		coupon_code: string,
		information: InformationEntity,
	) {
		const [{ product }, coupon] = await Promise.all([
			this.show(information, product_id),
			Coupons.findOne({
				where: {
					coupon: coupon_code,
					information_id: information.id,
				},
			}),
		]);
		if (!coupon) {
			throw new BadRequestException("No se encontró cupon.");
		}
		// verificar si cupon del producto existe en el cupon
		const existCoupon = coupon.categories.some(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			(tech: any) => tech === product.category_id,
		);

		if (!existCoupon) {
			throw new BadRequestException(
				"Este cupón de descuento no es válido para esta compra",
			);
		}

		if (restarDays(NOW().toDate(), TimePeru(coupon.date).toDate()) <= 0)
			throw new BadRequestException(
				"Lastimosamente, Este cupón de descuento ya se ha vencido",
			);

		if (coupon.max_use! < 1) {
			throw new BadRequestException(
				"Lastimosamente, Este cupón ya no está disponible por limite de uso.",
			);
		}

		return {
			success: true,
			discount: coupon.discount,
			limit: coupon.max_use,
			coupon,
		};
	}

	async store(
		information: InformationEntity,
		productsStoreDto:
			| ProductsNormalStoreDto
			| ProductsServicioStoreDto
			| ProductsRestaurantStoreDto,
	) {
		const Pr = Product(information);
		const product = new Pr({
			...productsStoreDto,
			information_id: information.id,
		});
		product!.product_code = await generateCodeEntity(
			Pr,
			"product_code",
			"PROD",
			information,
		);
		await product!.save();
		if (information.tipo_empresa.tipo_servicio_id === 1) {
			await Promise.all(
				(productsStoreDto as ProductsNormalStoreDto).options.map(
					async (option) => {
						await ProductsOptions.create({
							...option,
							product_normal_id: product.id,
							information_id: information.id,
						});
					},
				),
			);
			const combinaciones = combinacionesVariants(
				(productsStoreDto as ProductsNormalStoreDto).options.map(
					(opt) => opt.features,
				),
			);
			await Promise.all(
				combinaciones.map(async (combinacion) => {
					if (combinacion.length) {
						const variant = await product.$create("variant", {
							sku: null,
							stock: 0,
							ilimit: false,
							images: [],
							information_id: information.id,
						});
						await Promise.all(
							combinacion.map(async (comb) => {
								await VariantsFeatures.create({
									variant_id: variant.id,
									feature_id: comb,
									information_id: information.id,
								});
							}),
						);
					}
				}),
			);
		}
		return {
			success: true,
			product,
		};
	}

	async update(
		information: InformationEntity,
		id: string,
		productsUpdateDto:
			| ProductsNormalUpdateDto
			| ProductsServicioUpdateDto
			| ProductsRestaurantUpdateDto,
	) {
		const { product } = await this.show(information, id, true);

		const [byName, bySlug] = await Promise.all([
			Product(information).findOne({
				where: {
					name: productsUpdateDto.name,
					id: { [Op.not]: id },
					information_id: information.id,
				},
				raw: true,
			}),
			Product(information).findOne({
				where: {
					slug: productsUpdateDto.slug,
					id: { [Op.not]: id },
					information_id: information.id,
				},
				raw: true,
			}),
		]);
		if (byName) {
			throw new BadRequestException(
				`Ya existe el producto con el nombre: ${productsUpdateDto.name}`,
				{ body: "name" },
			);
		}

		if (bySlug) {
			throw new BadRequestException(
				`Ya existe el producto con el slug: ${productsUpdateDto.slug}`,
				{ body: "slug" },
			);
		}
		await product.update({
			...productsUpdateDto,
			information_id: information.id,
		});

		if (information.tipo_empresa.tipo_servicio_id === 1) {
			const mapped = (product.dataValues.options as Options[]).map((opt) => {
				return {
					option_id: opt.id,
					features: (opt.features as Features[]).map((feature) => feature.id),
				};
			});
			// // si hizo un cambio en las oppciones que se limines todas las variantes y se cree de nuevo
			if (
				!areArraysEqual(
					(productsUpdateDto as ProductsNormalUpdateDto).options,
					mapped,
				)
			) {
				await Promise.all([
					ProductsOptions.destroy({
						where: {
							product_normal_id: product.id,
							information_id: information.id,
						},
					}),
					Variants.destroy({
						where: {
							product_normal_id: product.id,
							information_id: information.id,
						},
					}),
				]);
				await Promise.all(
					(productsUpdateDto as ProductsNormalUpdateDto).options.map(
						async (option) => {
							await ProductsOptions.create({
								product_normal_id: product.id,
								information_id: information.id,
								...option,
							});
						},
					),
				);
				const combinaciones = combinacionesVariants(
					(productsUpdateDto as ProductsNormalUpdateDto).options.map(
						(opt) => opt.features,
					),
				);

				await Promise.all(
					combinaciones.map(async (combinacion) => {
						if (combinacion.length) {
							const variant = await product.$create("variant", {
								sku: null,
								stock: 0,
								ilimit: false,
								images: [],
								information_id: information.id,
							});
							await Promise.all(
								combinacion.map(async (comb) => {
									await VariantsFeatures.create({
										variant_id: variant.id,
										feature_id: comb,
										information_id: information.id,
									});
								}),
							);
						}
					}),
				);
			}
		}

		return {
			success: true,
			product,
		};
	}

	async destroy(information: InformationEntity, id: string) {
		const { product } = await this.show(information, id, true);
		await product.destroy();
		if (product.images) {
			removeFile(information.slug, product.images);
		}
		return {
			success: true,
			message: `El producto con el id: ${id} fue eliminado`,
		};
	}
	async variant(
		information: InformationEntity,
		product_id: string,
		variant_id: string,
	) {
		const { product } = await this.show(information, product_id, false);
		const variant = await (product as ProductsNormal).$get("variants", {
			where: {
				id: variant_id,
			},
		});
		return {
			success: true,
			variant: variant[0] as Variants,
		};
	}

	async variantUpdate(
		information: InformationEntity,
		product_id: string,
		variant_id: string,
		variantsUpdateDto: VariantsUpdateDto,
	) {
		const { variant } = await this.variant(information, product_id, variant_id);
		if (variantsUpdateDto.sku) {
			const existSku = await Variants.findOne({
				where: {
					product_normal_id: product_id,
					sku: variantsUpdateDto.sku,
					id: { [Op.not]: variant.id },
				},
			});
			if (existSku)
				throw new BadRequestException("Este sku ya existe", {
					body: "sku",
				});
		}

		await variant.update(variantsUpdateDto);
		return {
			success: true,
			message: "Variante editado correctamente.",
		};
	}

	async varianDelete(
		information: InformationEntity,
		product_id: string,
		variant_id: string,
	) {
		const { variant } = await this.variant(information, product_id, variant_id);
		await variant.destroy();
		return {
			success: true,
			message: "Variante Eliminado correctamente.",
		};
	}
}
