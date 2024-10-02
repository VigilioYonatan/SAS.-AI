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

@Injectable()
export class WebApiService {
    constructor(
        private readonly productsApiService: ProductsApiService,
        private readonly categoriesApiService: CategoriesApiService,
        private readonly backgroundApiService: BackgroundApiService,
        private readonly brandsApiService: BrandsApiService
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
                users,
                brands,
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
                    limit: 6,
                }),
                Products.findAll({
                    // productos recien subidos
                    order: [["createdAt", "DESC"]],
                    limit: 6,
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
                    },
                }),
                New.findOne({
                    order: [["id", "DESC"]],
                    where: {
                        empresa_id: empresa.id,
                    },
                }),
                Product(empresa).count({
                    where: { empresa_id: empresa.id, enabled: true },
                }),
                Users.findAll({
                    where: { empresa_id: empresa.id, enabled: true },
                    attributes: [
                        "id",
                        "name",
                        "speciality",
                        "photo",
                        "birthday",
                    ],
                }),
                Brands.findAll({
                    where: {
                        empresa_id: empresa.id,
                    },
                    attributes: ["id", "image"],
                }),
            ]);

            const getProductsByCategories = await Promise.all(
                categories.map(async (category) => {
                    let products = await Products.findAll({
                        limit: 4,
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
                            return await getProductAll(empresa, product);
                        })
                    );
                    return {
                        ...category.toJSON(),
                        products,
                    };
                })
            );
            // productos
            const [productsOffert6Mapped, productsLatest6Mapped] =
                await this.fetchProductArrays(empresa, [
                    productsOffert6,
                    productsLatest6,
                ]);

            // Mapear el producto con mayor descuento y el último producto creado
            const [productMostDiscountMapped, productLatestMapped] =
                await Promise.all([
                    productMostDiscount
                        ? getProductAll(empresa, productMostDiscount)
                        : null,
                    productLatest
                        ? getProductAll(empresa, productLatest)
                        : null,
                ]);
            cacheHome = {
                title: "Inicio",
                backgrounds, //backgrounds
                description: `Bienvenidos a ${empresa.name_empresa} - ${
                    empresa.setting.about
                        ? empresa.setting.about.slice(0, 100)
                        : ""
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
            };
            const hora = 60 * 60 * 1000;
            cache.set(`home-${empresa.slug}`, JSON.stringify(cacheHome), hora);
        }
        return cacheHome;
    }
    async about(empresa: Empresas) {
        const [posts, categories, noticia, productsQuantity, users] =
            await Promise.all([
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
                Product(empresa).count({
                    where: { empresa_id: empresa.id, enabled: true },
                }),
                Users.findAll({
                    where: { empresa_id: empresa.id, enabled: true },
                    attributes: [
                        "id",
                        "name",
                        "speciality",
                        "photo",
                        "birthday",
                    ],
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
        };
    }
    async shop(empresa: Empresas) {
        const [
            productsLatest,
            productsOfferts,
            { data },
            productMostDiscount,
            productLatest,
            noticia,
        ] = await Promise.all([
            Product(empresa).findAll({
                // traer 10 los ultimos products
                limit: 10,
                where: { enabled: true },
                order: [["createdAt", "DESC"]],
            }),
            Product(empresa).findAll({
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
            this.categoriesApiService.index(empresa),
            Product(empresa).findOne({
                order: [["discount", "DESC"]],
                where: {
                    enabled: true,
                },
            }), // producto con mas oferta
            Product(empresa).findOne({
                order: [["createdAt", "DESC"]],
                where: {
                    enabled: true,
                },
            }), // ultimo producto creado
            New.findOne({ order: [["id", "DESC"]] }),
        ]);

        // productos
        const [productsLatestMapped, productsOffertsMapped] =
            await this.fetchProductArrays(empresa, [
                productsLatest,
                productsOfferts,
            ]);
        const [productMostDiscountMapped, productLatestMapped] =
            await Promise.all([
                productMostDiscount
                    ? getProductAll(empresa, productMostDiscount)
                    : null,
                productLatest ? getProductAll(empresa, productLatest) : null,
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

    async product(slug: string, empresa: Empresas) {
        const { product } = await this.productsApiService.show(
            empresa,
            slug,
            true,
            true
        );

        // obtener productos con el mismo subcategoria random
        const categoriesProductsRandom = await Product(empresa).findAll({
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
                    product:
                        | ProductsNormal
                        | ProductsServicio
                        | ProductsRestaurant
                ) => {
                    const prod = await getProductAll(empresa, product);
                    return prod;
                }
            )
        );
        let productByBrands = null;
        if (
            empresa.tipo_empresa.tipo_servicio_id === 1 &&
            (product as ProductsNormal)?.brand_id
        ) {
            productByBrands = await Product(empresa).findAll({
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
                    const prod = await getProductAll(empresa, product);
                    return prod;
                })
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

    async categories(category_slug: string, empresa: Empresas) {
        const { category } = await this.categoriesApiService.show(
            empresa,
            category_slug.toLowerCase()
        );
        // solo para obtener  precio y descuentos de los productos con la familia
        const products = await Product(empresa)
            .unscoped()
            .findAll({
                attributes: ["id", "price", "discount"],
                where: { category_id: category.id, enabled: true },
            });
        const mappedProducts = products.map(
            (prod: ProductsNormal | ProductsServicio | ProductsRestaurant) =>
                subtotalIgv(empresa, prod)
        );

        const max = Math.max(...mappedProducts);
        const min = Math.min(...mappedProducts);
        let brands = null;
        let optionsFeatures = null;
        if (empresa.tipo_empresa.tipo_servicio_id === 1) {
            const brandsID = products.map(
                (product: ProductsNormal) => product.brand_id!
            ); // obtener marcas id
            const uniqueIdsBrands = [...new Set(brandsID)]; // que no se repita los id
            const brandsId = await Brands.findAll({
                where: {
                    id: uniqueIdsBrands,
                },
            });
            brands = await Promise.all(
                brandsId.map(async (brand) => {
                    const quantity = await Product(empresa)
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
                })
            );
            optionsFeatures = await getFeatures(products, category.id);
        }

        const discounts = await Promise.all(
            createIncrementArray(
                products.map(
                    (
                        product:
                            | ProductsNormal
                            | ProductsServicio
                            | ProductsRestaurant
                    ) => product.discount
                )
            ).map(async (disc) => {
                const quantity = await Product(empresa)
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
            })
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
    async marcas(brands: string, empresa: Empresas) {
        const { brand } = await this.brandsApiService.show(empresa, brands); // solo para obtener  precio y descuentos de los productos con la familia
        const products = await Product(empresa)
            .unscoped()
            .findAll({
                attributes: ["id", "price", "discount"],
                where: { brand_id: brand.id, enabled: true },
            });
        const mappedProducts = products.map(
            (prod: ProductsNormal | ProductsServicio | ProductsRestaurant) =>
                subtotalIgv(empresa, prod)
        );

        const max = Math.max(...mappedProducts);
        const min = Math.min(...mappedProducts);
        let optionsFeatures = null;
        if (empresa.tipo_empresa.tipo_servicio_id === 1) {
            optionsFeatures = await getFeatures(products, undefined, brand.id);
        }

        const discounts = await Promise.all(
            createIncrementArray(
                products.map(
                    (
                        product:
                            | ProductsNormal
                            | ProductsServicio
                            | ProductsRestaurant
                    ) => product.discount
                )
            ).map(async (disc) => {
                const quantity = await Product(empresa)
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
            })
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
        products: (ProductsNormal | ProductsServicio | ProductsRestaurant)[][]
    ) {
        const arraysLengths = products.map((arr) => arr.length);
        const allProducts = products.flat();

        const allProductsMapped = await fetchProducts(empresa, allProducts);

        function splitResults(
            allResults: (
                | ProductsNormal
                | ProductsServicio
                | ProductsRestaurant
            )[],
            arraysLengths: number[]
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
            products: (ProductsNormal | ProductsServicio | ProductsRestaurant)[]
        ) {
            return await Promise.all(
                products.map((product) => getProductAll(empresa, product))
            );
        }
        return splitResults(allProductsMapped, arraysLengths);
    }
}
