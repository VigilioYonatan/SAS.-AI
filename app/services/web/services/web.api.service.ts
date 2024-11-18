import { Injectable } from "@vigilio/express-core";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { getProductAll, Product } from "@/products/libs";
import { ProductsApiService } from "@/products/services/products.api.service";
import { CategoriesApiService } from "@/products/services/categories.api.service";
import { BackgroundApiService } from "@/empresas/services/background.api.service";
import cache from "@vigilio/express-core/cache";
import { Op } from "sequelize";
import { Posts } from "@/posts/entities/posts.entity";
import { Categories } from "@/products/entities/categories.entity";
import { New } from "@/empresas/entities/new.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import type { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { createIncrementArray, removeTextHTML } from "~/libs/helpers";
import { sequelize } from "~/config/db.config";
import { subtotalIgv } from "@/cart/libs/helpers";
import { Brands } from "@/products/entities/brands.entitiy";
import { getFeatures } from "../libs";
import { Users } from "@/users/entities/users.entity";
import { BrandsApiService } from "@/products/services/brands.api.service";
import { Sequelize } from "sequelize-typescript";
import { Favorites } from "@/favorites/entities/favorites.entity";
import { Ratings } from "@/polymorphism/entities/ratings.entity";
import { Comments } from "@/polymorphism/entities/comments.entity";
import { SubCategoriesApiService } from "@/products/services/subcategories.api.service";
import { GridBanner } from "@/empresas/entities/grid_banner.entity";
import { Banner } from "@/empresas/entities/banner.entity";

@Injectable()
export class WebApiService {
	constructor(
		private readonly productsApiService: ProductsApiService,
		private readonly categoriesApiService: CategoriesApiService,
		private readonly backgroundApiService: BackgroundApiService,
		private readonly brandsApiService: BrandsApiService,
		private readonly subCategoriesApiService: SubCategoriesApiService,
	) {}

	async home(empresa: Empresas, user: Users) {
		let cacheHome = null;
		if (empresa.enabled_booster && !user) {
			cacheHome = JSON.parse(cache.get(`home-${empresa.slug}`) ?? "null");
		}
		if (!cacheHome) {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const Products: any =
				empresa.tipo_empresa.tipo_servicio_id === 2
					? ProductsRestaurant
					: ProductsNormal;
			const key = [1, 3].includes(empresa.tipo_empresa.tipo_servicio_id)
				? "product_normal_id"
				: "product_restaurant_id";
			const keys = [1, 3].includes(empresa.tipo_empresa.tipo_servicio_id)
				? "ProductsNormals"
				: "ProductsRestaurants";
			const [
				{ data: backgrounds },
				productsOffert6,
				productsLatest6,
				posts,
				productMostDiscount,
				productLatest,
				categories,
				noticia,
				productsQuantity,
				productsMostReaction,
				productsMostRating,
				productsMostComments,
				users,
				brands,
				productServicesQuantity,
				gridBanners,
			] = await Promise.all([
				this.backgroundApiService.index(empresa),
				Products.findAll({
					// productos con ofertas
					where: {
						discount: {
							[Op.gt]: 0,
						},
						empresa_id: empresa.id,
						enabled: true,
					},
					order: [["createdAt", "DESC"]],
					limit: empresa?.setting.type_card === "eccomerce" ? 8 : 6,
				}),
				Products.findAll({
					// productos recien subidos
					order: [["createdAt", "DESC"]],
					limit: empresa?.setting.type_card === "eccomerce" ? 8 : 6,
					where: {
						enabled: true,
						empresa_id: empresa.id,
					},
				}),
				Posts.findAll({
					limit: 6, // maximo 8 . si deseas lo podes poner en un slider
					order: [["createdAt", "DESC"]],
					where: {
						empresa_id: empresa.id,
					},
				}),
				Products.findOne({
					order: [["discount", "DESC"]],
					where: {
						empresa_id: empresa.id,
						enabled: true,
					},
				}), // producto con mas oferta
				Products.findOne({
					order: [["createdAt", "ASC"]],
					where: {
						empresa_id: empresa.id,
						enabled: true,
					},
				}), // ultimo producto creado
				Categories.findAll({
					where: {
						empresa_id: empresa.id,
						isService: false,
					},
				}),
				New.findOne({
					order: [["id", "DESC"]],
					where: {
						empresa_id: empresa.id,
					},
				}),
				// aca ira productos normal
				Product(empresa, false).count({
					where: { empresa_id: empresa.id, enabled: true },
				}),

				// // aca ira productos normal
				Favorites.findAll({
					attributes: [
						key,
						[Sequelize.fn("COUNT", Sequelize.col(key)), "favoritescount"],
					],
					where: { empresa_id: empresa.id },
					group: [key],
					order: [[Sequelize.literal("favoritescount"), "DESC"]],
					limit: 6,
					raw: true,
				}),
				Ratings.findAll({
					attributes: [
						"ratingsable_id",
						[Sequelize.fn("AVG", Sequelize.col("rating")), "stars"], // Calcula el promedio de las estrellas y lo nombra 'stars'
					],
					group: ["ratingsable_id"],
					order: [[Sequelize.literal("stars"), "DESC"]], // Ordena por el promedio en orden descendente
					limit: 6, // Limita a los 5 productos con mejor promedio de rating
					where: {
						empresa_id: empresa.id,
						ratingsable_type: keys,
					},
					raw: true,
				}),
				Comments.unscoped().findAll({
					attributes: [
						"commentsable_id",
						[
							Sequelize.fn("COUNT", Sequelize.col("Comments.id")),
							"commentscount",
						],
					],
					where: {
						empresa_id: empresa.id,
						commentsable_type: keys,
					},
					group: ["commentsable_id"],
					order: [[Sequelize.literal("commentscount"), "DESC"]],
					limit: 6,
					raw: true,
				}),
				Users.findAll({
					where: { empresa_id: empresa.id, enabled: true },
					attributes: ["id", "name", "speciality", "photo", "birthday"],
				}),
				Brands.findAll({
					where: {
						empresa_id: empresa.id,
					},
					attributes: ["id", "image"],
				}),

				// aca ira servicios normal
				Product(empresa, true).count({
					where: { empresa_id: empresa.id, enabled: true },
				}),
				GridBanner.findAll({
					include: [Banner],
					where: { empresa_id: empresa.id },
				}),
			]);

			const getProductsByCategories = await Promise.all(
				categories.map(async (category) => {
					let products = await Products.findAll({
						limit: empresa?.setting.type_card === "eccomerce" ? 5 : 4,
						where: {
							enabled: true,
							category_id: category.id,
							empresa_id: empresa.id,
						},
						order: [["createdAt", "DESC"]],
					});
					products = await Promise.all(
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						products.map(async (product: any) => {
							return await getProductAll(empresa, product, user);
						}),
					);
					return {
						...category.toJSON(),
						products,
					};
				}),
			);

			const productsMostReactionMapped = await Promise.all(
				productsMostReaction.map(async (product) => {
					let producto = await Product(empresa, false).findByPk(
						product[
							empresa.tipo_empresa.tipo_servicio_id !== 2
								? "product_normal_id"
								: "product_servicio_id"
						],
					);
					producto = await getProductAll(empresa, producto, user);
					return {
						...producto.toJSON(),
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						favoritescount: (product as any).stars,
					};
				}),
			);

			const productsMostRatingMapped = await Promise.all(
				productsMostRating.map(async (product) => {
					let producto = await Product(empresa, false).findByPk(
						product.ratingsable_id,
					);
					producto = await getProductAll(empresa, producto, user);
					return producto;
				}),
			);
			const productsMostCommentsMapped = await Promise.all(
				productsMostComments.map(async (product) => {
					let producto = await Product(empresa, false).findByPk(
						product.commentsable_id,
					);
					producto = await getProductAll(empresa, producto, user);
					return {
						...producto.toJSON(),
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						quantity: (product as any).commentscount,
					};
				}),
			);

			// productos
			const [productsOffert6Mapped, productsLatest6Mapped] =
				await this.fetchProductArrays(
					empresa,
					[productsOffert6, productsLatest6],
					user,
				);

			// Mapear el producto con mayor descuento y el último producto creado
			const [productMostDiscountMapped, productLatestMapped] =
				await Promise.all([
					productMostDiscount
						? getProductAll(empresa, productMostDiscount, user)
						: null,
					productLatest ? getProductAll(empresa, productLatest, user) : null,
				]);

			cacheHome = {
				title: "Inicio",
				backgrounds, //backgrounds
				description: `Bienvenidos a ${empresa.name_empresa} - ${
					empresa.about ? empresa.about.slice(0, 100) : ""
				}`,
				posts, // posts
				productsOffert6Mapped,
				productsLatest6Mapped,
				productMostDiscountMapped,
				productLatestMapped,
				getProductsByCategories,
				noticia,
				productsQuantity,
				users,
				brands,
				productServicesQuantity,
				productsMostReactionMapped,
				productsMostRatingMapped,
				productsMostCommentsMapped,
				gridBanners,
			};

			const hora = 60 * 60 * 1000;
			cache.set(`home-${empresa.slug}`, JSON.stringify(cacheHome), hora);
		}
		return cacheHome;
	}
	async about(empresa: Empresas) {
		const [
			posts,
			categories,
			noticia,
			productsQuantity,
			users,
			productServicesQuantity,
		] = await Promise.all([
			Posts.findAll({
				limit: 6, // maximo 8 . si deseas lo podes poner en un slider
				order: [["createdAt", "DESC"]],
				where: {
					empresa_id: empresa.id,
				},
			}),

			Categories.findAll({
				where: {
					empresa_id: empresa.id,
				},
			}),
			New.findOne({
				order: [["id", "DESC"]],
				where: {
					empresa_id: empresa.id,
				},
			}),
			// aca ira productos normal
			Product(empresa, false).count({
				where: { empresa_id: empresa.id, enabled: true },
			}),
			Users.findAll({
				where: { empresa_id: empresa.id, enabled: true },
				attributes: ["id", "name", "speciality", "photo", "birthday"],
			}),
			// aca ira productos normal
			Product(empresa, true).count({
				where: { empresa_id: empresa.id, enabled: true },
			}),
		]);
		return {
			title: "Inicio",
			description: `Bienvenidos a ${empresa.name_empresa}`,
			posts,
			categories,
			noticia,
			productsQuantity,
			users,
			productServicesQuantity,
		};
	}
	async shop(empresa: Empresas, user: Users) {
		const [
			productsLatest,
			productsOfferts,
			{ data },
			productMostDiscount,
			productLatest,
			noticia,
		] = await Promise.all([
			Product(empresa, false).findAll({
				// traer 10 los ultimos products
				limit: 10,
				where: { enabled: true },
				order: [["createdAt", "DESC"]],
			}),
			Product(empresa, false).findAll({
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
			this.categoriesApiService.index(empresa, false),
			Product(empresa, false).findOne({
				order: [["discount", "DESC"]],
				where: {
					enabled: true,
				},
			}), // producto con mas oferta
			Product(empresa, false).findOne({
				order: [["createdAt", "DESC"]],
				where: {
					enabled: true,
				},
			}), // ultimo producto creado
			New.findOne({ order: [["id", "DESC"]] }),
		]);

		// productos
		const [productsLatestMapped, productsOffertsMapped] =
			await this.fetchProductArrays(
				empresa,
				[productsLatest, productsOfferts],
				user,
			);
		const [productMostDiscountMapped, productLatestMapped] = await Promise.all([
			productMostDiscount
				? getProductAll(empresa, productMostDiscount, user)
				: null,
			productLatest ? getProductAll(empresa, productLatest, user) : null,
		]);

		return {
			title: "Shop",
			categories: data,
			productsLatestMapped,
			productsOffertsMapped,
			productMostDiscountMapped,
			productLatestMapped,
			noticia,
			description: `En ${empresa.name_empresa}, ofrecemos una amplia variedad de productos de alta calidad a precios inmejorables, encontrarás todo lo que necesitas en un solo lugar. Disfruta de envíos rápidos, devoluciones fáciles y un servicio al cliente excepcional. ¡Explora nuestras ofertas diarias y descubre la diferencia de comprar en Tienda XYZ!`,
		};
	}

	async product(slug: string, empresa: Empresas, user: Users) {
		const { product } = await this.productsApiService.show(
			empresa,
			slug,
			false,
			true,
			user,
			true,
		);

		// obtener productos con el mismo subcategoria random
		const categoriesProductsRandom = await Product(empresa, false).findAll({
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
					const prod = await getProductAll(empresa, product, user);
					return prod;
				},
			),
		);
		let productByBrands = null;
		if (
			[1, 3].includes(empresa.tipo_empresa.tipo_servicio_id) &&
			(product as ProductsNormal)?.brand_id
		) {
			productByBrands = await Product(empresa, false).findAll({
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
					const prod = await getProductAll(empresa, product, user);
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
	async servicio(slug: string, empresa: Empresas, user: Users) {
		const { product } = await this.productsApiService.show(
			empresa,
			slug,
			true,
			true,
			user,
			true,
		);

		// obtener productos con el mismo subcategoria random
		const categoriesProductsRandom = await Product(empresa, true).findAll({
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
					const prod = await getProductAll(empresa, product, user);
					return prod;
				},
			),
		);

		return {
			title: product.name,
			description: `${product.name} - ${
				product.description
					? removeTextHTML(product.description).slice(0, 100)
					: ""
			}...`,
			product,
			categoriesProductsRandom: mappedProduct,
			category_name: (product.category as Categories).name,
		};
	}

	async categories(category_slug: string, empresa: Empresas) {
		const { category } = await this.categoriesApiService.show(
			empresa,
			category_slug.toLowerCase(),
		);
		// solo para obtener  precio y descuentos de los productos con la familia
		const products = await Product(empresa, false)
			.unscoped()
			.findAll({
				attributes: ["id", "price", "discount"],
				where: { category_id: category.id, enabled: true },
			});
		const mappedProducts = products.map(
			(prod: ProductsNormal | ProductsServicio | ProductsRestaurant) =>
				subtotalIgv(empresa, prod),
		);

		const max = Math.max(...mappedProducts);
		const min = Math.min(...mappedProducts);
		let brands = null;
		let optionsFeatures = null;
		if ([1, 3].includes(empresa.tipo_empresa.tipo_servicio_id)) {
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
					const quantity = await Product(empresa, false)
						.unscoped()
						.count({
							where: {
								brand_id: brand.id,
								category_id: category.id,
								enabled: true,
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
				const quantity = await Product(empresa, false)
					.unscoped()
					.count({
						where: {
							discount: { [Op.gte]: disc ?? 0 },
							category_id: category.id,
							enabled: true,
						},
					});
				return {
					value: disc,
					quantity,
				};
			}),
		);
		const subcategories = await category.$get("subcategories");
		return {
			title: category.name,
			description: category.name,
			priceMinMax: { max: max ?? 0, min: min ?? 0 },
			category,
			discounts,
			brands,
			optionsFeatures,
			subcategories,
		};
	}
	async subcategories(
		category_slug: string,
		subcategory_slug: string,
		empresa: Empresas,
		isView = false,
	) {
		const [{ category }, { subcategory }] = await Promise.all([
			this.categoriesApiService.show(
				empresa,
				category_slug.toLowerCase(),
				isView,
			),
			this.subCategoriesApiService.show(
				empresa,
				subcategory_slug.toLowerCase(),
				isView,
			),
		]);
		// solo para obtener  precio y descuentos de los productos con la familia
		const products = await Product(empresa, false)
			.unscoped()
			.findAll({
				attributes: ["id", "price", "discount"],
				where: {
					category_id: category.id,
					subcategory_id: subcategory.id,
					enabled: true,
				},
			});
		const mappedProducts = products.map(
			(prod: ProductsNormal | ProductsServicio | ProductsRestaurant) =>
				subtotalIgv(empresa, prod),
		);

		const max = Math.max(...mappedProducts);
		const min = Math.min(...mappedProducts);
		let brands = null;
		let optionsFeatures = null;
		if ([1, 3].includes(empresa.tipo_empresa.tipo_servicio_id)) {
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
					const quantity = await Product(empresa, false)
						.unscoped()
						.count({
							where: {
								brand_id: brand.id,
								category_id: category.id,
								subcategory_id: subcategory.id,
								enabled: true,
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
				const quantity = await Product(empresa, false)
					.unscoped()
					.count({
						where: {
							discount: { [Op.gte]: disc ?? 0 },
							category_id: category.id,
							subcategory_id: subcategory.id,
							enabled: true,
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
			subcategory,
			discounts,
			brands,
			optionsFeatures,
		};
	}
	async marcas(brands: string, empresa: Empresas) {
		const { brand } = await this.brandsApiService.show(empresa, brands); // solo para obtener  precio y descuentos de los productos con la familia
		const products = await Product(empresa, false)
			.unscoped()
			.findAll({
				attributes: ["id", "price", "discount"],
				where: { brand_id: brand.id, enabled: true },
			});
		const mappedProducts = products.map(
			(prod: ProductsNormal | ProductsServicio | ProductsRestaurant) =>
				subtotalIgv(empresa, prod),
		);

		const max = Math.max(...mappedProducts);
		const min = Math.min(...mappedProducts);
		let optionsFeatures = null;
		if ([1, 3].includes(empresa.tipo_empresa.tipo_servicio_id)) {
			optionsFeatures = await getFeatures(products, undefined, brand.id);
		}

		const discounts = await Promise.all(
			createIncrementArray(
				products.map(
					(product: ProductsNormal | ProductsServicio | ProductsRestaurant) =>
						product.discount,
				),
			).map(async (disc) => {
				const quantity = await Product(empresa, false)
					.unscoped()
					.count({
						where: {
							discount: { [Op.gte]: disc ?? 0 },
							brand_id: brand.id,
							enabled: true,
						},
					});
				return {
					value: disc,
					quantity,
				};
			}),
		);

		return {
			title: brand.name,
			description: brand.name,
			brand,
			priceMinMax: { max: max ?? 0, min: min ?? 0 },
			discounts,
			optionsFeatures,
		};
	}

	async admin() {
		return {
			success: true,
		};
	}
	async fetchProductArrays(
		empresa: Empresas,
		products: (ProductsNormal | ProductsServicio | ProductsRestaurant)[][],
		user: Users,
	) {
		const arraysLengths = products.map((arr) => arr.length);
		const allProducts = products.flat();

		const allProductsMapped = await fetchProducts(empresa, allProducts);

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
			empresa: Empresas,
			products: (ProductsNormal | ProductsServicio | ProductsRestaurant)[],
		) {
			return await Promise.all(
				products.map((product) => getProductAll(empresa, product, user)),
			);
		}
		return splitResults(allProductsMapped, arraysLengths);
	}
}
