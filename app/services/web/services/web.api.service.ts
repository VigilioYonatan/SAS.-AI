import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Redirect,
} from "@vigilio/express-core";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { getProductAll, Product, ProductKeys } from "@/products/libs";
import { ProductsApiService } from "@/products/services/products.api.service";
import { CategoriesApiService } from "@/products/services/categories.api.service";
import { BackgroundApiService } from "@/empresas/services/background.api.service";
import cache from "@vigilio/express-core/cache";
import { Op, QueryTypes } from "sequelize";
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
import { ROLES } from "@/users/libs";
import { Page } from "@/empresas/entities/page.entity";
import type { GridBannerPage } from "@/empresas/entities/grid_banner_page.entity";
import { Crud } from "@/empresas/entities/crud.entity";
import { PaginatorApiServices } from "@/common/paginator/services/paginator.api.service";
import { RequestVigilio } from "~/config/types";
import {
    getQueries,
    joins,
    PaginatorModel,
    relation,
} from "@/common/paginator/libs";
import { capitalize } from "@vigilio/express-core/helpers";

@Injectable()
export class WebApiService {
    constructor(
        private readonly productsApiService: ProductsApiService,
        private readonly categoriesApiService: CategoriesApiService,
        private readonly backgroundApiService: BackgroundApiService,
        private readonly brandsApiService: BrandsApiService,
        private readonly subCategoriesApiService: SubCategoriesApiService,
        private readonly paginatorApiServices: PaginatorApiServices
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
                empresa.setting.isEccomerce
                    ? Products.findAll({
                          // productos con ofertas
                          where: {
                              discount: {
                                  [Op.gt]: 0,
                              },
                              empresa_id: empresa.id,
                              enabled: true,
                          },
                          order: [["createdAt", "DESC"]],
                          limit: empresa?.setting.products_limit_offer || 4,
                      })
                    : [],
                empresa.setting.isEccomerce
                    ? Products.findAll({
                          // productos recien subidos
                          order: [["createdAt", "DESC"]],
                          limit:
                              empresa?.setting.type_card === "eccomerce"
                                  ? 8
                                  : 6,
                          where: {
                              enabled: true,
                              empresa_id: empresa.id,
                          },
                      })
                    : [],
                Posts.findAll({
                    limit: 6, // maximo 8 . si deseas lo podes poner en un slider
                    order: [["createdAt", "DESC"]],
                    where: {
                        empresa_id: empresa.id,
                    },
                }),
                empresa.setting.isEccomerce
                    ? Products.findOne({
                          order: [["discount", "DESC"]],
                          where: {
                              empresa_id: empresa.id,
                              enabled: true,
                          },
                      })
                    : {}, // producto con mas oferta
                empresa.setting.isEccomerce
                    ? Products.findOne({
                          order: [["createdAt", "ASC"]],
                          where: {
                              empresa_id: empresa.id,
                              enabled: true,
                          },
                      })
                    : {}, // ultimo producto creado
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
                empresa.setting.isEccomerce
                    ? Product(empresa, false).count({
                          where: { empresa_id: empresa.id, enabled: true },
                      })
                    : {},

                // // aca ira productos normal
                empresa.setting.isEccomerce
                    ? Favorites.findAll({
                          attributes: [
                              key,
                              [
                                  Sequelize.fn("COUNT", Sequelize.col(key)),
                                  "favoritescount",
                              ],
                          ],
                          where: { empresa_id: empresa.id },
                          group: [key],
                          order: [
                              [Sequelize.literal("favoritescount"), "DESC"],
                          ],
                          limit: 4,
                          raw: true,
                      })
                    : [],
                empresa.setting.isEccomerce
                    ? Ratings.findAll({
                          attributes: [
                              "ratingsable_id",
                              [
                                  Sequelize.fn("AVG", Sequelize.col("rating")),
                                  "stars",
                              ], // Calcula el promedio de las estrellas y lo nombra 'stars'
                          ],
                          group: ["ratingsable_id"],
                          order: [[Sequelize.literal("stars"), "DESC"]], // Ordena por el promedio en orden descendente
                          limit: 4, // Limita a los 5 productos con mejor promedio de rating
                          where: {
                              empresa_id: empresa.id,
                              ratingsable_type: keys,
                          },
                          raw: true,
                      })
                    : [],
                empresa.setting.isEccomerce
                    ? Comments.unscoped().findAll({
                          attributes: [
                              "commentsable_id",
                              [
                                  Sequelize.fn(
                                      "COUNT",
                                      Sequelize.col("Comments.id")
                                  ),
                                  "commentscount",
                              ],
                          ],
                          where: {
                              empresa_id: empresa.id,
                              commentsable_type: keys,
                          },
                          group: ["commentsable_id"],
                          order: [[Sequelize.literal("commentscount"), "DESC"]],
                          limit: 4,
                          raw: true,
                      })
                    : [],
                Users.findAll({
                    where: {
                        empresa_id: empresa.id,
                        enabled: true,
                        role_id: ROLES.trabajador,
                    },
                    attributes: [
                        "id",
                        "name",
                        "speciality",
                        "photo",
                        "birthday",
                    ],
                    limit: empresa.isTemplate ? 5 : 20,
                    order: [["id", "ASC"]],
                }),
                empresa.setting.isEccomerce
                    ? Brands.findAll({
                          where: {
                              empresa_id: empresa.id,
                          },
                          attributes: ["id", "image", "name"],
                      })
                    : [],

                // aca ira servicios normal
                empresa.setting.isEccomerce
                    ? Product(empresa, true).count({
                          where: { empresa_id: empresa.id, enabled: true },
                      })
                    : 0,
                !JSON.parse(cache.get(`${empresa.slug}:home`) || "null")
                    ? GridBanner.findAll({
                          where: { empresa_id: empresa.id },
                          order: [["id", "ASC"]],
                      })
                    : [],
            ]);
            let getProductsByCategories = [];
            if (empresa.setting.isEccomerce) {
                getProductsByCategories = await Promise.all(
                    categories.map(async (category) => {
                        let products = await Products.findAll({
                            limit: empresa?.setting.products_limit || 5,
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
                                return await getProductAll(
                                    empresa,
                                    product,
                                    user,
                                    false
                                );
                            })
                        );
                        return {
                            ...category.toJSON(),
                            products,
                        };
                    })
                );
            }
            let productsMostReactionMapped = [];
            if (empresa.setting.isEccomerce) {
                productsMostReactionMapped = await Promise.all(
                    productsMostReaction.map(async (product) => {
                        let producto = await Product(empresa, false).findByPk(
                            product[
                                empresa.tipo_empresa.tipo_servicio_id !== 2
                                    ? "product_normal_id"
                                    : "product_restaurant_id"
                            ]
                        );
                        producto = await getProductAll(
                            empresa,
                            producto,
                            user,
                            false
                        );
                        return {
                            ...producto.toJSON(),
                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                            favoritescount: (product as any).stars ?? "0",
                        };
                    })
                );
            }
            let productsMostRatingMapped = [];
            let productsMostCommentsMapped = [];

            if (empresa.setting.isEccomerce) {
                productsMostRatingMapped = await Promise.all(
                    productsMostRating.map(async (product) => {
                        let producto = await Product(empresa, false).findByPk(
                            product.ratingsable_id
                        );
                        producto = await getProductAll(
                            empresa,
                            producto,
                            user,
                            false
                        );
                        return producto;
                    })
                );
                productsMostCommentsMapped = await Promise.all(
                    productsMostComments.map(async (product) => {
                        let producto = await Product(empresa, false).findByPk(
                            product.commentsable_id
                        );
                        producto = await getProductAll(
                            empresa,
                            producto,
                            user,
                            false
                        );
                        return {
                            ...producto.toJSON(),
                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                            quantity: (product as any).commentscount,
                        };
                    })
                );
            }

            // productos
            const [productsOffert6Mapped, productsLatest6Mapped] =
                await this.fetchProductArrays(
                    empresa,
                    [productsOffert6, productsLatest6],
                    user
                );

            // Mapear el producto con mayor descuento y el último producto creado
            const [productMostDiscountMapped, productLatestMapped] =
                await Promise.all([
                    productMostDiscount && empresa.setting.isEccomerce
                        ? getProductAll(
                              empresa,
                              productMostDiscount,
                              user,
                              false
                          )
                        : null,
                    productLatest && empresa.setting.isEccomerce
                        ? getProductAll(empresa, productLatest, user, false)
                        : null,
                ]);
            const data = await Page.findOne({
                where: {
                    [Op.or]: {
                        slug: ["home", "inicio"],
                    },
                    empresa_id: empresa.id,
                },
                attributes: ["id", "title", "slug", "queries", "description"],
            });
            if (!data) {
                throw new BadRequestException("Error : home - inicio");
            }
            const queries = await getQueries(empresa, data);
            cacheHome = {
                title: data.title,
                backgrounds, //backgrounds
                description: data?.description || "no description",
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
                queries,
            };
            const max = empresa.isTemplate ? 10000 : 1;
            const hora = 60 * 60 * 1000 * max;
            cache.set(`home-${empresa.slug}`, JSON.stringify(cacheHome), hora);
        }
        return cacheHome;
    }
    async servicios(empresa: Empresas) {
        if (!empresa.setting.is_service_page)
            throw new BadRequestException("No permission");
        const data = await Page.findOne({
            where: {
                [Op.or]: {
                    slug: ["servicios", "services"],
                },
                empresa_id: empresa.id,
            },
            attributes: ["id", "title", "slug", "queries", "description"],
        });
        if (!data) {
            throw new BadRequestException("Error page: servicios - services");
        }
        const queries = await getQueries(empresa, data);
        return { queries };
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
                where: {
                    empresa_id: empresa.id,
                    enabled: true,
                    [Op.not]: {
                        role_id: ROLES.user,
                    },
                },
                attributes: ["id", "name", "speciality", "photo", "birthday"],
                limit: empresa.isTemplate ? 5 : 20,
            }),
            // aca ira productos normal
            Product(empresa, true).count({
                where: { empresa_id: empresa.id, enabled: true },
            }),
        ]);
        const data = await Page.findOne({
            where: {
                [Op.or]: {
                    slug: ["about", "nosotros"],
                },
                empresa_id: empresa.id,
            },
            attributes: ["id", "title", "slug", "queries", "description"],
        });
        if (!data) {
            throw new BadRequestException("Error page , nosotros - about");
        }
        let queries = null;
        try {
            const q = await Promise.all(
                data.queries.map(async (query) => {
                    const result = await sequelize.query(query.query, {
                        replacements: { empresa_id: empresa.id },
                        type: QueryTypes.SELECT,
                    });
                    return { [query.key]: relation(result) || [] };
                })
            );
            queries = q;
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
        return {
            posts,
            categories,
            noticia,
            productsQuantity,
            users,
            productServicesQuantity,
            queries,
        };
    }
    async shop(empresa: Empresas, user: Users) {
        if (!empresa.setting.isEccomerce) {
            throw new Redirect("/");
        }
        const d = await Page.findOne({
            where: {
                [Op.or]: {
                    slug: ["shop", "tienda"],
                },
                empresa_id: empresa.id,
            },
            attributes: ["id", "title", "slug", "queries", "description"],
        });
        if (!d) {
            throw new BadRequestException("Error page, shop - tienda");
        }
        let queries = null;
        try {
            const q = await Promise.all(
                d.queries.map(async (query) => {
                    const result = await sequelize.query(query.query, {
                        replacements: { empresa_id: empresa.id },
                        type: QueryTypes.SELECT,
                    });
                    return { [query.key]: relation(result) || [] };
                })
            );
            queries = q;
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
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
                where: { enabled: true, empresa_id: empresa.id },
                order: [["createdAt", "DESC"]],
            }),
            Product(empresa, false).findAll({
                // traer 10 los ultimos products con descuentos
                where: {
                    discount: {
                        [Op.gt]: 0,
                    },
                    enabled: true,
                    empresa_id: empresa.id,
                },
                limit: empresa?.setting.products_limit_offer || 4,
                order: [["createdAt", "DESC"]],
            }),
            this.categoriesApiService.index(empresa, false),
            Product(empresa, false).findOne({
                order: [["discount", "DESC"]],
                where: {
                    enabled: true,
                    empresa_id: empresa.id,
                },
            }), // producto con mas oferta
            Product(empresa, false).findOne({
                order: [["createdAt", "DESC"]],
                where: {
                    enabled: true,
                    empresa_id: empresa.id,
                },
            }), // ultimo producto creado
            New.findOne({
                order: [["id", "DESC"]],
                where: {
                    empresa_id: empresa.id,
                },
            }),
        ]);

        // productos
        const [productsLatestMapped, productsOffertsMapped] =
            await this.fetchProductArrays(
                empresa,
                [productsLatest, productsOfferts],
                user
            );
        const [productMostDiscountMapped, productLatestMapped] =
            await Promise.all([
                productMostDiscount
                    ? getProductAll(empresa, productMostDiscount, user, false)
                    : null,
                productLatest
                    ? getProductAll(empresa, productLatest, user, false)
                    : null,
            ]);

        return {
            title: "Shop",
            categories: data,
            productsLatestMapped,
            productsOffertsMapped,
            productMostDiscountMapped,
            productLatestMapped,
            noticia,
            queries,
        };
    }

    async product(slug: string, req: RequestVigilio, user: Users) {
        const empresa = req.empresa;
        const page = await Page.findOne({
            where: {
                slug,
                empresa_id: empresa.id,
                isDinamic: false,
            },
        });
        if (page) {
            let grid_banner_pages = JSON.parse(
                cache.get(`${empresa.slug}:grid_banner_pages:${page.id}`) ||
                    "null"
            );
            if (!grid_banner_pages) {
                grid_banner_pages = (await page.$get("grid_banner_pages", {
                    order: [["id", "ASC"]],
                    include: [GridBanner],
                })) as GridBannerPage[];
            }

            const pagina: {
                title: string;
                description: string;
                grid_banner_pages: GridBannerPage[];
                type_page: string;
                paginator: unknown | null;
                queries: null | object;
                data: object[];
            } = {
                title: page.title,
                description: page.description,
                grid_banner_pages,
                type_page: "other_page",
                paginator: undefined,
                queries: [],
                data: [],
            };
            if (page.slug === "shop" || page.slug === "tienda") {
                const queries = await getQueries(empresa, page);
                const shop = await this.shop(empresa, user);
                // pagina = { ...pagina, ...shop, type_page: "shop_page" };
                return { ...pagina, ...shop, queries, type_page: "shop_page" };
            }
            if (page.slug === "about" || page.slug === "nosotros") {
                const queries = await getQueries(empresa, page);
                const nosotros = await this.about(empresa);
                return {
                    ...pagina,
                    ...nosotros,
                    queries,
                    type_page: "nosotros_page",
                };
            }
            if (page.slug === "services" || page.slug === "servicios") {
                const servicios = await this.servicios(empresa);
                const queries = await getQueries(empresa, page);
                return {
                    ...pagina,
                    ...servicios,
                    queries,
                    type_page: "servicios_page",
                };
            }
            if (page.slug === "contact" || page.slug === "contacto") {
                const queries = await getQueries(empresa, page);
                return { ...pagina, type_page: "contact_page", queries };
            }
            const crud = await Crud.findOne({
                where: { empresa_id: empresa.id, slug: slug.toLowerCase() },
            });
            let data = null;
            let paginator = null;
            const queryFind = page.queries.find((key) => key.key === "data");

            if (crud) {
                const [attributes, join] = await joins(crud, empresa);
                if (crud.paginator && crud.paginator > 0) {
                    const query = req.query;
                    const navigator = {
                        limit: crud.paginator || 14,
                        offset: Number(query.offset ?? "0"),
                        page:
                            Number(query.page ?? "1") < 1
                                ? 1
                                : Number(query.page ?? "1"),
                    };

                    const pagination = {
                        limit: navigator.limit,
                        offset:
                            (navigator.page - 1) * navigator.limit +
                            navigator.offset,
                        maxPagesShown: 3,
                    };
                    const { results, count } =
                        await this.paginatorApiServices.index(
                            {
                                model: crud.name as PaginatorModel,
                                query: {
                                    limit: String(pagination.limit),
                                    offset: String(pagination.offset),
                                    search: query.search as string, // tu puedes tambien cambiar por letra
                                    ...query,
                                },
                                req,
                            },
                            queryFind ? queryFind.query : undefined
                        );

                    const total = count as number;
                    let startPage: number;
                    let endPage: number;
                    const totalPages = Math.ceil(total / pagination.limit);
                    const currentPage =
                        Math.floor(pagination.offset / pagination.limit) + 1;

                    if (totalPages <= pagination.maxPagesShown) {
                        startPage = 1;
                        endPage = totalPages;
                    } else {
                        const maxPagesShownBeforeCurrentPage = Math.floor(
                            pagination.maxPagesShown / 2
                        );
                        const maxPagesShownAfterCurrentPage =
                            Math.ceil(pagination.maxPagesShown / 2) - 1;
                        if (currentPage <= maxPagesShownBeforeCurrentPage) {
                            startPage = 1;
                            endPage = pagination.maxPagesShown;
                        } else if (
                            currentPage + maxPagesShownAfterCurrentPage >=
                            totalPages
                        ) {
                            startPage =
                                totalPages - pagination.maxPagesShown + 1;
                            endPage = totalPages;
                        } else {
                            startPage =
                                currentPage - maxPagesShownBeforeCurrentPage;
                            endPage =
                                currentPage + maxPagesShownAfterCurrentPage;
                        }
                    }
                    const pages = Array.from(
                        Array(endPage + 1 - startPage).keys()
                    ).map((i) => startPage + i);
                    const startingBreakPointButtonIfCondition = pages[0] >= 3;
                    const endingBreakPointButtonIfCondition =
                        pages[pages.length - 1] < totalPages - 1;

                    paginator = {
                        totalItems: total,
                        currentPage,
                        totalPages,
                        startPage: startPage,
                        endPage: endPage,
                        pages,
                        startingBreakPointButtonIfCondition,
                        endingBreakPointButtonIfCondition,
                        onInitialPage: `/${slug}`,
                        onNextPage: `/${slug}?page=${
                            currentPage === endPage ? endPage : currentPage + 1
                        }`,
                        onBackPage: `/${slug}?page=${
                            currentPage < 1 ? 0 : currentPage - 1
                        }`,
                        onFinalPage: `/${slug}?page=${endPage}`,
                    };
                    data = results;
                } else {
                    data = await sequelize.query(
                        queryFind
                            ? queryFind.query
                            : `SELECT  "${capitalize(crud.name)}_${
                                  empresa.id
                              }".* ${
                                  attributes?.length ? `, ${attributes}` : ""
                              } FROM "${capitalize(crud.name)}_${
                                  empresa.id
                              }" ${join} WHERE "${capitalize(crud.name)}_${
                                  empresa.id
                              }"."empresa_id" = :empresa_id ORDER BY "${capitalize(
                                  crud.name
                              )}_${empresa.id}".id DESC`,
                        {
                            replacements: { empresa_id: empresa.id },
                            type: QueryTypes.SELECT,
                        }
                    );
                }
            }
            const queries = await getQueries(
                empresa,
                queryFind
                    ? ({
                          ...page.toJSON(),
                          queries: page.queries.filter((q) => q.key !== "data"),
                      } as Page)
                    : page
            );

            pagina.queries = queries;

            pagina.data = relation(data);
            pagina.paginator = paginator;
            return pagina;
        }
        if (!empresa.setting.isEccomerce) {
            throw new Redirect("/");
        }
        const { product } = await this.productsApiService.show(
            empresa,
            slug,
            false,
            true,
            user,
            true
        );

        // obtener productos con el mismo subcategoria random
        const categoriesProductsRandom = await Product(empresa, false).findAll({
            where: {
                category_id: product.category_id,
                id: { [Op.ne]: product.id },
                enabled: true,
                empresa_id: empresa.id,
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
                    const prod = await getProductAll(
                        empresa,
                        product,
                        user,
                        true
                    );
                    return prod;
                }
            )
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
                    empresa_id: empresa.id,
                },
                limit: 8,
            });
            productByBrands = await Promise.all(
                productByBrands.map(async (product: ProductsNormal) => {
                    const prod = await getProductAll(
                        empresa,
                        product,
                        user,
                        false
                    );
                    return prod;
                })
            );
        }
        const totalComments = await Comments.count({
            where: {
                commentsable_type: ProductKeys(empresa, false),
                commentsable_id: product.id,
                empresa_id: empresa.id,
            },
        });

        return {
            title: product.name,
            description: `${product.name} - ${
                product.description
                    ? removeTextHTML(product.description)?.slice(0, 100)
                    : ""
            }...`,
            product,
            categoriesProductsRandom: mappedProduct,
            productByBrands,
            category_name: (product.category as Categories).name,
            totalComments,
            type_page: null,
        };
    }
    async servicio(slug: string, empresa: Empresas, user: Users) {
        const { product } = await this.productsApiService.show(
            empresa,
            slug,
            true,
            true,
            user,
            true
        );

        // obtener productos con el mismo subcategoria random
        const categoriesProductsRandom = await Product(empresa, true).findAll({
            where: {
                category_id: product.category_id,
                id: { [Op.ne]: product.id },
                enabled: true,
                empresa_id: empresa.id,
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
                    const prod = await getProductAll(
                        empresa,
                        product,
                        user,
                        true
                    );
                    return prod;
                }
            )
        );
        const totalComments = await Comments.count({
            where: {
                commentsable_type: ProductKeys(empresa, true),
                commentsable_id: product.id,
                empresa_id: empresa.id,
            },
        });
        return {
            title: product.name,
            description: `${product.name} - ${
                product.description
                    ? removeTextHTML(product.description)?.slice(0, 100)
                    : ""
            }...`,
            product,
            categoriesProductsRandom: mappedProduct,
            category_name: (product.category as Categories).name,
            totalComments,
        };
    }

    async categories(category_slug: string, empresa: Empresas) {
        const { category } = await this.categoriesApiService.show(
            empresa,
            category_slug.toLowerCase()
        );
        // solo para obtener  precio y descuentos de los productos con la familia
        const products = await Product(empresa, false)
            .unscoped()
            .findAll({
                attributes: ["id", "price", "discount"],
                where: {
                    category_id: category.id,
                    enabled: true,
                    empresa_id: empresa.id,
                },
            });
        const mappedProducts = products.map(
            (prod: ProductsNormal | ProductsServicio | ProductsRestaurant) =>
                subtotalIgv(empresa, prod)
        );

        const max = Math.max(...mappedProducts);
        const min = Math.min(...mappedProducts);
        let brands = null;
        let optionsFeatures = null;
        if ([1, 3].includes(empresa.tipo_empresa.tipo_servicio_id)) {
            const brandsID = products.map(
                (product: ProductsNormal) => product.brand_id!
            ); // obtener marcas id
            const uniqueIdsBrands = [...new Set(brandsID)]; // que no se repita los id
            const brandsId = await Brands.findAll({
                where: {
                    id: uniqueIdsBrands,
                    empresa_id: empresa.id,
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
                                empresa_id: empresa.id,
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
                const quantity = await Product(empresa, false)
                    .unscoped()
                    .count({
                        where: {
                            discount: { [Op.gte]: disc ?? 0 },
                            category_id: category.id,
                            enabled: true,
                            empresa_id: empresa.id,
                        },
                    });
                return {
                    value: disc,
                    quantity,
                };
            })
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
        isView = false
    ) {
        const [{ category }, { subcategory }] = await Promise.all([
            this.categoriesApiService.show(
                empresa,
                category_slug.toLowerCase(),
                isView
            ),
            this.subCategoriesApiService.show(
                empresa,
                subcategory_slug.toLowerCase(),
                isView
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
                    empresa_id: empresa.id,
                    enabled: true,
                },
            });
        const mappedProducts = products.map(
            (prod: ProductsNormal | ProductsServicio | ProductsRestaurant) =>
                subtotalIgv(empresa, prod)
        );

        const max = Math.max(...mappedProducts);
        const min = Math.min(...mappedProducts);
        let brands = null;
        let optionsFeatures = null;
        if ([1, 3].includes(empresa.tipo_empresa.tipo_servicio_id)) {
            const brandsID = products.map(
                (product: ProductsNormal) => product.brand_id!
            ); // obtener marcas id
            const uniqueIdsBrands = [...new Set(brandsID)]; // que no se repita los id
            const brandsId = await Brands.findAll({
                where: {
                    id: uniqueIdsBrands,
                    empresa_id: empresa.id,
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
                                empresa_id: empresa.id,
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
                const quantity = await Product(empresa, false)
                    .unscoped()
                    .count({
                        where: {
                            discount: { [Op.gte]: disc ?? 0 },
                            category_id: category.id,
                            subcategory_id: subcategory.id,
                            enabled: true,
                            empresa_id: empresa.id,
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
                where: {
                    brand_id: brand.id,
                    enabled: true,
                    empresa_id: empresa.id,
                },
            });
        const mappedProducts = products.map(
            (prod: ProductsNormal | ProductsServicio | ProductsRestaurant) =>
                subtotalIgv(empresa, prod)
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
                    (
                        product:
                            | ProductsNormal
                            | ProductsServicio
                            | ProductsRestaurant
                    ) => product.discount
                )
            ).map(async (disc) => {
                const quantity = await Product(empresa, false)
                    .unscoped()
                    .count({
                        where: {
                            discount: { [Op.gte]: disc ?? 0 },
                            brand_id: brand.id,
                            enabled: true,
                            empresa_id: empresa.id,
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
        products: (ProductsNormal | ProductsServicio | ProductsRestaurant)[][],
        user: Users
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
                products.map((product) =>
                    getProductAll(empresa, product, user, false)
                )
            );
        }
        return splitResults(allProductsMapped, arraysLengths);
    }
}
