import { Injectable } from "@vigilio/express-core";
import { InformationEntity } from "@/information/entities/information.entity";
import { getProductAll, Product } from "@/products/libs";
import { ProductsApiService } from "@/products/services/products.api.service";
import { CategoriesApiService } from "@/products/services/categories.api.service";
import { BackgroundApiService } from "@/information/services/background.api.service";
import cache from "@vigilio/express-core/cache";
import { Op } from "sequelize";
import { Posts } from "@/posts/entities/posts.entity";
import { Categories } from "@/products/entities/categories.entity";
import { New } from "@/information/entities/new.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import type { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { createIncrementArray, removeTextHTML } from "~/libs/helpers";
import { sequelize } from "~/config/db.config";
import { subtotalIgv } from "@/cart/libs/helpers";
import { Brands } from "@/products/entities/brands.entitiy";
import { getFeatures } from "../libs";

@Injectable()
export class WebService {
	constructor(
		private readonly productsApiService: ProductsApiService,
		private readonly categoriesApiService: CategoriesApiService,
		private readonly backgroundApiService: BackgroundApiService,
	) {}
	async home(information: InformationEntity) {
		let cacheHome = null;
		if (information.enabled_booster) {
			cacheHome = JSON.parse(cache.get(`home-${information.slug}`) ?? "null");
		}
		if (!cacheHome) {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const Products: any =
				information.tipo_empresa.tipo_servicio_id === 2
					? ProductsRestaurant
					: ProductsNormal;
			const [
				{ data: backgrounds },
				productsOffert6,
				productsLatest6,
				posts,
				productMostDiscount,
				productLatest,
				categories,
				noticia,
			] = await Promise.all([
				this.backgroundApiService.index(information),
				Products.findAll({
					// productos con ofertas
					where: {
						discount: {
							[Op.gt]: 0,
						},
						information_id: information.id,
						enabled: true,
					},
					order: [["createdAt", "DESC"]],
					limit: 6,
				}),
				Products.findAll({
					// productos recien subidos
					order: [["createdAt", "DESC"]],
					limit: 6,
					where: {
						enabled: true,
						information_id: information.id,
					},
				}),
				Posts.findAll({
					limit: 6, // maximo 8 . si deseas lo podes poner en un slider
					order: [["createdAt", "DESC"]],
					where: {
						information_id: information.id,
					},
				}),
				Products.findOne({
					order: [["discount", "DESC"]],
					where: {
						information_id: information.id,
					},
				}), // producto con mas oferta
				Products.findOne({
					order: [["createdAt", "DESC"]],
					where: {
						information_id: information.id,
					},
				}), // ultimo producto creado
				Categories.findAll({
					where: {
						information_id: information.id,
					},
				}),
				New.findOne({
					order: [["id", "DESC"]],
					where: {
						information_id: information.id,
					},
				}),
			]);

			const getProductsByCategories = await Promise.all(
				categories.map(async (category) => {
					let products = await Products.findAll({
						limit: 6,
						where: {
							enabled: true,
							category_id: category.id,
							information_id: information.id,
						},
						order: [["createdAt", "DESC"]],
					});
					products = await Promise.all(
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						products.map(async (product: any) => {
							return await getProductAll(information, product);
						}),
					);
					return {
						...category.toJSON(),
						products,
					};
				}),
			);
			// productos
			const [productsOffert6Mapped, productsLatest6Mapped] =
				await this.fetchProductArrays(information, [
					productsOffert6,
					productsLatest6,
				]);

			// Mapear el producto con mayor descuento y el último producto creado
			const [productMostDiscountMapped, productLatestMapped] =
				await Promise.all([
					productMostDiscount
						? getProductAll(information, productMostDiscount)
						: null,
					productLatest ? getProductAll(information, productLatest) : null,
				]);
			cacheHome = {
				title: "Inicio",
				backgrounds, //backgrounds
				description: `Bienvenidos a ${information.name_empresa} - Tu Tienda de Tecnología de Confianza`,
				posts, // posts
				productsOffert6Mapped,
				productsLatest6Mapped,
				productMostDiscountMapped,
				productLatestMapped,
				getProductsByCategories,
				noticia,
			};
			const hora = 60 * 60 * 1000;
			cache.set(`home-${information.slug}`, JSON.stringify(cacheHome), hora);
		}
		return cacheHome;
	}
	async shop(information: InformationEntity) {
		const [
			productsLatest,
			productsOfferts,
			{ data },
			productMostDiscount,
			productLatest,
			noticia,
		] = await Promise.all([
			Product(information).findAll({
				// traer 10 los ultimos products
				limit: 10,
				where: { enabled: true },
				order: [["createdAt", "DESC"]],
			}),
			Product(information).findAll({
				// traer 10 los ultimos products con descuentos
				where: {
					discount: {
						[Op.gt]: 0,
					},
					enabled: true,
				},
				limit: 9,
				order: [["createdAt", "DESC"]],
			}),
			this.categoriesApiService.index(information),
			Product(information).findOne({
				order: [["discount", "DESC"]],
				where: {
					enabled: true,
				},
			}), // producto con mas oferta
			Product(information).findOne({
				order: [["createdAt", "DESC"]],
				where: {
					enabled: true,
				},
			}), // ultimo producto creado
			New.findOne({ order: [["id", "DESC"]] }),
		]);

		// productos
		const [productsLatestMapped, productsOffertsMapped] =
			await this.fetchProductArrays(information, [
				productsLatest,
				productsOfferts,
			]);
		const [productMostDiscountMapped, productLatestMapped] = await Promise.all([
			productMostDiscount
				? getProductAll(information, productMostDiscount)
				: null,
			productLatest ? getProductAll(information, productLatest) : null,
		]);

		return {
			title: "Shop",
			categories: data,
			productsLatestMapped,
			productsOffertsMapped,
			productMostDiscountMapped,
			productLatestMapped,
			noticia,
			description: `En ${information.name_empresa}, ofrecemos una amplia variedad de productos de alta calidad a precios inmejorables, encontrarás todo lo que necesitas en un solo lugar. Disfruta de envíos rápidos, devoluciones fáciles y un servicio al cliente excepcional. ¡Explora nuestras ofertas diarias y descubre la diferencia de comprar en Tienda XYZ!`,
		};
	}

	async product(slug: string, information: InformationEntity) {
		const { product } = await this.productsApiService.show(
			information,
			slug,
			true,
		);

		// obtener productos con el mismo subcategoria random
		const categoriesProductsRandom = await Product(information).findAll({
			where: {
				category_id: product.category_id,
				id: { [Op.ne]: product.id },
				enabled: true,
			},
			limit: 6,
			order: sequelize.random(), // obtener productos random
		});
		const mappedProduct = await Promise.all(
			categoriesProductsRandom.map(
				async (
					product: ProductsNormal | ProductsServicio | ProductsRestaurant,
				) => {
					const prod = await getProductAll(information, product);
					return prod;
				},
			),
		);
		let productByBrands = null;
		if (
			information.tipo_empresa.tipo_servicio_id === 1 &&
			(product as ProductsNormal)?.brand_id
		) {
			productByBrands = await Product(information).findAll({
				where: {
					category_id: product.category_id,
					brand_id: (product as ProductsNormal).brand_id,
					enabled: true,
					id: { [Op.ne]: product.id },
				},
				limit: 8,
			});
			productByBrands = await Promise.all(
				productByBrands.map(async (product: ProductsNormal) => {
					const prod = await getProductAll(information, product);
					return prod;
				}),
			);
		}

		return {
			title: product.name,
			description: `${product.name} - ${
				product.description
					? removeTextHTML(product.description).slice(0, 100)
					: ""
			}...`,
			product,
			categoriesProductsRandom: mappedProduct,
			productByBrands,
			category_name: (product.category as Categories).name,
		};
	}

	async categories(category_slug: string, information: InformationEntity) {
		const { category } = await this.categoriesApiService.show(
			information,
			category_slug.toLowerCase(),
		);
		// solo para obtener  precio y descuentos de los productos con la familia
		const products = await Product(information)
			.unscoped()
			.findAll({
				attributes: ["id", "price", "discount"],
				where: { category_id: category.id },
			});
		const mappedProducts = products.map(
			(prod: ProductsNormal | ProductsServicio | ProductsRestaurant) =>
				subtotalIgv(information, prod),
		);

		const max = Math.max(...mappedProducts);
		const min = Math.min(...mappedProducts);
		let brands = null;
		let optionsFeatures = null;
		if (information.tipo_empresa.tipo_servicio_id === 1) {
			const brandsID = products.map(
				(product: ProductsNormal) => product.brand_id!,
			); // obtener marcas id
			const uniqueIdsBrands = [...new Set(brandsID)]; // que no se repita los id
			const brandsId = await Brands.findAll({
				where: {
					id: uniqueIdsBrands,
				},
			});
			brands = await Promise.all(
				brandsId.map(async (brand) => {
					const quantity = await Product(information)
						.unscoped()
						.count({
							where: {
								brand_id: brand.id,
								category_id: category.id,
							},
						});

					return {
						...brand.toJSON(),
						quantity,
					};
				}),
			);
			optionsFeatures = await getFeatures(products, category.id);
		}

		const discounts = await Promise.all(
			createIncrementArray(
				products.map(
					(product: ProductsNormal | ProductsServicio | ProductsRestaurant) =>
						product.discount,
				),
			).map(async (disc) => {
				const quantity = await Product(information)
					.unscoped()
					.count({
						where: {
							discount: { [Op.gte]: disc ?? 0 },
							category_id: category.id,
						},
					});
				return {
					value: disc,
					quantity,
				};
			}),
		);
		return {
			title: category.name,
			description: category.name,
			priceMinMax: { max: max ?? 0, min: min ?? 0 },
			category,
			discounts,
			brands,
			optionsFeatures,
		};
	}

	async admin() {
		return {
			success: true,
		};
	}
	async orders() {
		return {
			title: "Pedidos",
			description: "Nuestras pedidos.",
		};
	}

	async politica(information: InformationEntity) {
		return {
			title: "Politica y privacidad",
			description: `En ${information.name_empresa}, nos comprometemos a proteger tu privacidad. Recopilamos información personal, de pago y de uso para procesar pedidos, mejorar nuestro servicio y comunicarnos contigo. Protegemos tus datos mediante medidas de seguridad avanzadas. Para más detalles, visita nuestra Política de Privacidad.`,
		};
	}

	async terminos(information: InformationEntity) {
		return {
			title: "Terminos y condiciones",
			description: `Lee los Términos y Condiciones de ${information.name_empresa} para conocer los términos de uso de nuestro sitio web y servicios. Descubre nuestras políticas de compra, envío, devoluciones, y responsabilidades del usuario. Al usar nuestro sitio, aceptas cumplir con estos términos.`,
		};
	}

	async reclamaciones(information: InformationEntity) {
		return {
			title: "Libro de reclamaciones",
			description: `En ${information.name_empresa}, valoramos a nuestros clientes y nos comprometemos a resolver cualquier problema. Consulta nuestra página de Reclamaciones para conocer el proceso de presentación de quejas y cómo gestionamos las reclamaciones. Tu satisfacción es nuestra prioridad.`,
		};
	}
	async fetchProductArrays(
		information: InformationEntity,
		products: (ProductsNormal | ProductsServicio | ProductsRestaurant)[][],
	) {
		const arraysLengths = products.map((arr) => arr.length);
		const allProducts = products.flat();

		const allProductsMapped = await fetchProducts(information, allProducts);

		function splitResults(
			allResults: (ProductsNormal | ProductsServicio | ProductsRestaurant)[],
			arraysLengths: number[],
		) {
			let index = 0;
			return arraysLengths.map((length) => {
				const result = allResults.slice(index, index + length);
				index += length;
				return result;
			});
		}
		async function fetchProducts(
			information: InformationEntity,
			products: (ProductsNormal | ProductsServicio | ProductsRestaurant)[],
		) {
			return await Promise.all(
				products.map((product) => getProductAll(information, product)),
			);
		}
		return splitResults(allProductsMapped, arraysLengths);
	}
}
