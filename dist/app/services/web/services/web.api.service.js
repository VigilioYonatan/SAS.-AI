"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const libs_1 = require("@/products/libs");
const products_api_service_1 = require("@/products/services/products.api.service");
const categories_api_service_1 = require("@/products/services/categories.api.service");
const background_api_service_1 = require("@/empresas/services/background.api.service");
const cache_1 = __importDefault(require("@vigilio/express-core/cache"));
const sequelize_1 = require("sequelize");
const posts_entity_1 = require("@/posts/entities/posts.entity");
const categories_entity_1 = require("@/products/entities/categories.entity");
const new_entity_1 = require("@/empresas/entities/new.entity");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
const products_restaurant_entity_1 = require("@/products/entities/products_restaurant.entity");
const helpers_1 = require("~/libs/helpers");
const db_config_1 = require("~/config/db.config");
const helpers_2 = require("@/cart/libs/helpers");
const brands_entitiy_1 = require("@/products/entities/brands.entitiy");
const libs_2 = require("../libs");
const users_entity_1 = require("@/users/entities/users.entity");
const brands_api_service_1 = require("@/products/services/brands.api.service");
const sequelize_typescript_1 = require("sequelize-typescript");
const favorites_entity_1 = require("@/favorites/entities/favorites.entity");
const ratings_entity_1 = require("@/polymorphism/entities/ratings.entity");
const comments_entity_1 = require("@/polymorphism/entities/comments.entity");
const subcategories_api_service_1 = require("@/products/services/subcategories.api.service");
const grid_banner_entity_1 = require("@/empresas/entities/grid_banner.entity");
const libs_3 = require("@/users/libs");
const page_entity_1 = require("@/empresas/entities/page.entity");
let WebApiService = class WebApiService {
    constructor(productsApiService, categoriesApiService, backgroundApiService, brandsApiService, subCategoriesApiService) {
        this.productsApiService = productsApiService;
        this.categoriesApiService = categoriesApiService;
        this.backgroundApiService = backgroundApiService;
        this.brandsApiService = brandsApiService;
        this.subCategoriesApiService = subCategoriesApiService;
    }
    home(empresa, user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let cacheHome = null;
            if (empresa.enabled_booster && !user) {
                cacheHome = JSON.parse((_a = cache_1.default.get(`home-${empresa.slug}`)) !== null && _a !== void 0 ? _a : "null");
            }
            if (!cacheHome) {
                const Products = empresa.tipo_empresa.tipo_servicio_id === 2
                    ? products_restaurant_entity_1.ProductsRestaurant
                    : products_normal_entity_1.ProductsNormal;
                const key = [1, 3].includes(empresa.tipo_empresa.tipo_servicio_id)
                    ? "product_normal_id"
                    : "product_restaurant_id";
                const keys = [1, 3].includes(empresa.tipo_empresa.tipo_servicio_id)
                    ? "ProductsNormals"
                    : "ProductsRestaurants";
                const [{ data: backgrounds }, productsOffert6, productsLatest6, posts, productMostDiscount, productLatest, categories, noticia, productsQuantity, productsMostReaction, productsMostRating, productsMostComments, users, brands, productServicesQuantity, gridBanners,] = yield Promise.all([
                    this.backgroundApiService.index(empresa),
                    Products.findAll({
                        where: {
                            discount: {
                                [sequelize_1.Op.gt]: 0,
                            },
                            empresa_id: empresa.id,
                            enabled: true,
                        },
                        order: [["createdAt", "DESC"]],
                        limit: (empresa === null || empresa === void 0 ? void 0 : empresa.setting.products_limit_offer) || 4,
                    }),
                    Products.findAll({
                        order: [["createdAt", "DESC"]],
                        limit: (empresa === null || empresa === void 0 ? void 0 : empresa.setting.type_card) === "eccomerce" ? 8 : 6,
                        where: {
                            enabled: true,
                            empresa_id: empresa.id,
                        },
                    }),
                    posts_entity_1.Posts.findAll({
                        limit: 6,
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
                    }),
                    Products.findOne({
                        order: [["createdAt", "ASC"]],
                        where: {
                            empresa_id: empresa.id,
                            enabled: true,
                        },
                    }),
                    categories_entity_1.Categories.findAll({
                        where: {
                            empresa_id: empresa.id,
                            isService: false,
                        },
                    }),
                    new_entity_1.New.findOne({
                        order: [["id", "DESC"]],
                        where: {
                            empresa_id: empresa.id,
                        },
                    }),
                    (0, libs_1.Product)(empresa, false).count({
                        where: { empresa_id: empresa.id, enabled: true },
                    }),
                    favorites_entity_1.Favorites.findAll({
                        attributes: [
                            key,
                            [
                                sequelize_typescript_1.Sequelize.fn("COUNT", sequelize_typescript_1.Sequelize.col(key)),
                                "favoritescount",
                            ],
                        ],
                        where: { empresa_id: empresa.id },
                        group: [key],
                        order: [[sequelize_typescript_1.Sequelize.literal("favoritescount"), "DESC"]],
                        limit: 4,
                        raw: true,
                    }),
                    ratings_entity_1.Ratings.findAll({
                        attributes: [
                            "ratingsable_id",
                            [sequelize_typescript_1.Sequelize.fn("AVG", sequelize_typescript_1.Sequelize.col("rating")), "stars"],
                        ],
                        group: ["ratingsable_id"],
                        order: [[sequelize_typescript_1.Sequelize.literal("stars"), "DESC"]],
                        limit: 4,
                        where: {
                            empresa_id: empresa.id,
                            ratingsable_type: keys,
                        },
                        raw: true,
                    }),
                    comments_entity_1.Comments.unscoped().findAll({
                        attributes: [
                            "commentsable_id",
                            [
                                sequelize_typescript_1.Sequelize.fn("COUNT", sequelize_typescript_1.Sequelize.col("Comments.id")),
                                "commentscount",
                            ],
                        ],
                        where: {
                            empresa_id: empresa.id,
                            commentsable_type: keys,
                        },
                        group: ["commentsable_id"],
                        order: [[sequelize_typescript_1.Sequelize.literal("commentscount"), "DESC"]],
                        limit: 4,
                        raw: true,
                    }),
                    users_entity_1.Users.findAll({
                        where: {
                            empresa_id: empresa.id,
                            enabled: true,
                            role_id: libs_3.ROLES.trabajador,
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
                    brands_entitiy_1.Brands.findAll({
                        where: {
                            empresa_id: empresa.id,
                        },
                        attributes: ["id", "image", "name"],
                    }),
                    (0, libs_1.Product)(empresa, true).count({
                        where: { empresa_id: empresa.id, enabled: true },
                    }),
                    grid_banner_entity_1.GridBanner.findAll({
                        where: { empresa_id: empresa.id },
                        order: [["id", "ASC"]],
                    }),
                ]);
                const getProductsByCategories = yield Promise.all(categories.map((category) => __awaiter(this, void 0, void 0, function* () {
                    let products = yield Products.findAll({
                        limit: (empresa === null || empresa === void 0 ? void 0 : empresa.setting.products_limit) || 5,
                        where: {
                            enabled: true,
                            category_id: category.id,
                            empresa_id: empresa.id,
                        },
                        order: [["createdAt", "DESC"]],
                    });
                    products = yield Promise.all(products.map((product) => __awaiter(this, void 0, void 0, function* () {
                        return yield (0, libs_1.getProductAll)(empresa, product, user, false);
                    })));
                    return Object.assign(Object.assign({}, category.toJSON()), { products });
                })));
                const productsMostReactionMapped = yield Promise.all(productsMostReaction.map((product) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    let producto = yield (0, libs_1.Product)(empresa, false).findByPk(product[empresa.tipo_empresa.tipo_servicio_id !== 2
                        ? "product_normal_id"
                        : "product_restaurant_id"]);
                    producto = yield (0, libs_1.getProductAll)(empresa, producto, user, false);
                    return Object.assign(Object.assign({}, producto.toJSON()), { favoritescount: (_a = product.stars) !== null && _a !== void 0 ? _a : "0" });
                })));
                const productsMostRatingMapped = yield Promise.all(productsMostRating.map((product) => __awaiter(this, void 0, void 0, function* () {
                    let producto = yield (0, libs_1.Product)(empresa, false).findByPk(product.ratingsable_id);
                    producto = yield (0, libs_1.getProductAll)(empresa, producto, user, false);
                    return producto;
                })));
                const productsMostCommentsMapped = yield Promise.all(productsMostComments.map((product) => __awaiter(this, void 0, void 0, function* () {
                    let producto = yield (0, libs_1.Product)(empresa, false).findByPk(product.commentsable_id);
                    producto = yield (0, libs_1.getProductAll)(empresa, producto, user, false);
                    return Object.assign(Object.assign({}, producto.toJSON()), { quantity: product.commentscount });
                })));
                const [productsOffert6Mapped, productsLatest6Mapped] = yield this.fetchProductArrays(empresa, [productsOffert6, productsLatest6], user);
                const [productMostDiscountMapped, productLatestMapped] = yield Promise.all([
                    productMostDiscount
                        ? (0, libs_1.getProductAll)(empresa, productMostDiscount, user, false)
                        : null,
                    productLatest
                        ? (0, libs_1.getProductAll)(empresa, productLatest, user, false)
                        : null,
                ]);
                cacheHome = {
                    title: "Inicio",
                    backgrounds,
                    description: `Bienvenidos a ${empresa.name_empresa} - ${empresa.about ? empresa.about.slice(0, 100) : ""}`,
                    posts,
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
                const max = empresa.isTemplate ? 10000 : 1;
                const hora = 60 * 60 * 1000 * max;
                cache_1.default.set(`home-${empresa.slug}`, JSON.stringify(cacheHome), hora);
            }
            return cacheHome;
        });
    }
    servicios(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!empresa.setting.is_service_page)
                throw new express_core_1.BadRequestException("No permission");
            return {};
        });
    }
    about(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const [posts, categories, noticia, productsQuantity, users, productServicesQuantity,] = yield Promise.all([
                posts_entity_1.Posts.findAll({
                    limit: 6,
                    order: [["createdAt", "DESC"]],
                    where: {
                        empresa_id: empresa.id,
                    },
                }),
                categories_entity_1.Categories.findAll({
                    where: {
                        empresa_id: empresa.id,
                    },
                }),
                new_entity_1.New.findOne({
                    order: [["id", "DESC"]],
                    where: {
                        empresa_id: empresa.id,
                    },
                }),
                (0, libs_1.Product)(empresa, false).count({
                    where: { empresa_id: empresa.id, enabled: true },
                }),
                users_entity_1.Users.findAll({
                    where: {
                        empresa_id: empresa.id,
                        enabled: true,
                        [sequelize_1.Op.not]: {
                            role_id: libs_3.ROLES.user,
                        },
                    },
                    attributes: ["id", "name", "speciality", "photo", "birthday"],
                    limit: empresa.isTemplate ? 5 : 20,
                }),
                (0, libs_1.Product)(empresa, true).count({
                    where: { empresa_id: empresa.id, enabled: true },
                }),
            ]);
            return {
                posts,
                categories,
                noticia,
                productsQuantity,
                users,
                productServicesQuantity,
            };
        });
    }
    shop(empresa, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const [productsLatest, productsOfferts, { data }, productMostDiscount, productLatest, noticia,] = yield Promise.all([
                (0, libs_1.Product)(empresa, false).findAll({
                    limit: 10,
                    where: { enabled: true, empresa_id: empresa.id },
                    order: [["createdAt", "DESC"]],
                }),
                (0, libs_1.Product)(empresa, false).findAll({
                    where: {
                        discount: {
                            [sequelize_1.Op.gt]: 0,
                        },
                        enabled: true,
                        empresa_id: empresa.id,
                    },
                    limit: (empresa === null || empresa === void 0 ? void 0 : empresa.setting.products_limit_offer) || 4,
                    order: [["createdAt", "DESC"]],
                }),
                this.categoriesApiService.index(empresa, false),
                (0, libs_1.Product)(empresa, false).findOne({
                    order: [["discount", "DESC"]],
                    where: {
                        enabled: true,
                        empresa_id: empresa.id,
                    },
                }),
                (0, libs_1.Product)(empresa, false).findOne({
                    order: [["createdAt", "DESC"]],
                    where: {
                        enabled: true,
                        empresa_id: empresa.id,
                    },
                }),
                new_entity_1.New.findOne({
                    order: [["id", "DESC"]],
                    where: {
                        empresa_id: empresa.id,
                    },
                }),
            ]);
            const [productsLatestMapped, productsOffertsMapped] = yield this.fetchProductArrays(empresa, [productsLatest, productsOfferts], user);
            const [productMostDiscountMapped, productLatestMapped] = yield Promise.all([
                productMostDiscount
                    ? (0, libs_1.getProductAll)(empresa, productMostDiscount, user, false)
                    : null,
                productLatest
                    ? (0, libs_1.getProductAll)(empresa, productLatest, user, false)
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
            };
        });
    }
    product(slug, empresa, user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const page = yield page_entity_1.Page.findOne({
                where: {
                    slug,
                    empresa_id: empresa.id,
                },
            });
            if (page) {
                const grid_banner_pages = (yield page.$get("grid_banner_pages", {
                    order: [["id", "ASC"]],
                    include: [grid_banner_entity_1.GridBanner],
                }));
                let pagina = {
                    title: page.title,
                    description: page.description,
                    grid_banner_pages,
                    type_page: "other_page",
                };
                if (page.slug === "shop" || page.slug === "tienda") {
                    const shop = yield this.shop(empresa, user);
                    pagina = Object.assign(Object.assign(Object.assign({}, pagina), shop), { type_page: "shop_page" });
                }
                if (page.slug === "about" || page.slug === "nosotros") {
                    const nosotros = yield this.about(empresa);
                    pagina = Object.assign(Object.assign(Object.assign({}, pagina), nosotros), { type_page: "nosotros_page" });
                }
                if (page.slug === "services" || page.slug === "servicios") {
                    const servicios = yield this.servicios(empresa);
                    return Object.assign(Object.assign(Object.assign({}, pagina), servicios), { type_page: "servicios_page" });
                }
                if (page.slug === "contact" || page.slug === "contactos") {
                    return Object.assign(Object.assign({}, pagina), { type_page: "contact_page" });
                }
                return pagina;
            }
            const { product } = yield this.productsApiService.show(empresa, slug, false, true, user, true);
            const categoriesProductsRandom = yield (0, libs_1.Product)(empresa, false).findAll({
                where: {
                    category_id: product.category_id,
                    id: { [sequelize_1.Op.ne]: product.id },
                    enabled: true,
                    empresa_id: empresa.id,
                },
                limit: 6,
                order: db_config_1.sequelize.random(),
            });
            const mappedProduct = yield Promise.all(categoriesProductsRandom.map((product) => __awaiter(this, void 0, void 0, function* () {
                const prod = yield (0, libs_1.getProductAll)(empresa, product, user, true);
                return prod;
            })));
            let productByBrands = null;
            if ([1, 3].includes(empresa.tipo_empresa.tipo_servicio_id) &&
                (product === null || product === void 0 ? void 0 : product.brand_id)) {
                productByBrands = yield (0, libs_1.Product)(empresa, false).findAll({
                    where: {
                        category_id: product.category_id,
                        brand_id: product.brand_id,
                        enabled: true,
                        id: { [sequelize_1.Op.ne]: product.id },
                        empresa_id: empresa.id,
                    },
                    limit: 8,
                });
                productByBrands = yield Promise.all(productByBrands.map((product) => __awaiter(this, void 0, void 0, function* () {
                    const prod = yield (0, libs_1.getProductAll)(empresa, product, user, false);
                    return prod;
                })));
            }
            const totalComments = yield comments_entity_1.Comments.count({
                where: {
                    commentsable_type: (0, libs_1.ProductKeys)(empresa, false),
                    commentsable_id: product.id,
                    empresa_id: empresa.id,
                },
            });
            return {
                title: product.name,
                description: `${product.name} - ${product.description
                    ? (_a = (0, helpers_1.removeTextHTML)(product.description)) === null || _a === void 0 ? void 0 : _a.slice(0, 100)
                    : ""}...`,
                product,
                categoriesProductsRandom: mappedProduct,
                productByBrands,
                category_name: product.category.name,
                totalComments,
                type_page: null,
            };
        });
    }
    servicio(slug, empresa, user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { product } = yield this.productsApiService.show(empresa, slug, true, true, user, true);
            const categoriesProductsRandom = yield (0, libs_1.Product)(empresa, true).findAll({
                where: {
                    category_id: product.category_id,
                    id: { [sequelize_1.Op.ne]: product.id },
                    enabled: true,
                    empresa_id: empresa.id,
                },
                limit: 6,
                order: db_config_1.sequelize.random(),
            });
            const mappedProduct = yield Promise.all(categoriesProductsRandom.map((product) => __awaiter(this, void 0, void 0, function* () {
                const prod = yield (0, libs_1.getProductAll)(empresa, product, user, true);
                return prod;
            })));
            const totalComments = yield comments_entity_1.Comments.count({
                where: {
                    commentsable_type: (0, libs_1.ProductKeys)(empresa, true),
                    commentsable_id: product.id,
                    empresa_id: empresa.id,
                },
            });
            return {
                title: product.name,
                description: `${product.name} - ${product.description
                    ? (_a = (0, helpers_1.removeTextHTML)(product.description)) === null || _a === void 0 ? void 0 : _a.slice(0, 100)
                    : ""}...`,
                product,
                categoriesProductsRandom: mappedProduct,
                category_name: product.category.name,
                totalComments,
            };
        });
    }
    categories(category_slug, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category } = yield this.categoriesApiService.show(empresa, category_slug.toLowerCase());
            const products = yield (0, libs_1.Product)(empresa, false)
                .unscoped()
                .findAll({
                attributes: ["id", "price", "discount"],
                where: {
                    category_id: category.id,
                    enabled: true,
                    empresa_id: empresa.id,
                },
            });
            const mappedProducts = products.map((prod) => (0, helpers_2.subtotalIgv)(empresa, prod));
            const max = Math.max(...mappedProducts);
            const min = Math.min(...mappedProducts);
            let brands = null;
            let optionsFeatures = null;
            if ([1, 3].includes(empresa.tipo_empresa.tipo_servicio_id)) {
                const brandsID = products.map((product) => product.brand_id);
                const uniqueIdsBrands = [...new Set(brandsID)];
                const brandsId = yield brands_entitiy_1.Brands.findAll({
                    where: {
                        id: uniqueIdsBrands,
                        empresa_id: empresa.id,
                    },
                });
                brands = yield Promise.all(brandsId.map((brand) => __awaiter(this, void 0, void 0, function* () {
                    const quantity = yield (0, libs_1.Product)(empresa, false)
                        .unscoped()
                        .count({
                        where: {
                            brand_id: brand.id,
                            category_id: category.id,
                            enabled: true,
                            empresa_id: empresa.id,
                        },
                    });
                    return Object.assign(Object.assign({}, brand.toJSON()), { quantity });
                })));
                optionsFeatures = yield (0, libs_2.getFeatures)(products, category.id);
            }
            const discounts = yield Promise.all((0, helpers_1.createIncrementArray)(products.map((product) => product.discount)).map((disc) => __awaiter(this, void 0, void 0, function* () {
                const quantity = yield (0, libs_1.Product)(empresa, false)
                    .unscoped()
                    .count({
                    where: {
                        discount: { [sequelize_1.Op.gte]: disc !== null && disc !== void 0 ? disc : 0 },
                        category_id: category.id,
                        enabled: true,
                        empresa_id: empresa.id,
                    },
                });
                return {
                    value: disc,
                    quantity,
                };
            })));
            const subcategories = yield category.$get("subcategories");
            return {
                title: category.name,
                description: category.name,
                priceMinMax: { max: max !== null && max !== void 0 ? max : 0, min: min !== null && min !== void 0 ? min : 0 },
                category,
                discounts,
                brands,
                optionsFeatures,
                subcategories,
            };
        });
    }
    subcategories(category_slug_1, subcategory_slug_1, empresa_1) {
        return __awaiter(this, arguments, void 0, function* (category_slug, subcategory_slug, empresa, isView = false) {
            const [{ category }, { subcategory }] = yield Promise.all([
                this.categoriesApiService.show(empresa, category_slug.toLowerCase(), isView),
                this.subCategoriesApiService.show(empresa, subcategory_slug.toLowerCase(), isView),
            ]);
            const products = yield (0, libs_1.Product)(empresa, false)
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
            const mappedProducts = products.map((prod) => (0, helpers_2.subtotalIgv)(empresa, prod));
            const max = Math.max(...mappedProducts);
            const min = Math.min(...mappedProducts);
            let brands = null;
            let optionsFeatures = null;
            if ([1, 3].includes(empresa.tipo_empresa.tipo_servicio_id)) {
                const brandsID = products.map((product) => product.brand_id);
                const uniqueIdsBrands = [...new Set(brandsID)];
                const brandsId = yield brands_entitiy_1.Brands.findAll({
                    where: {
                        id: uniqueIdsBrands,
                        empresa_id: empresa.id,
                    },
                });
                brands = yield Promise.all(brandsId.map((brand) => __awaiter(this, void 0, void 0, function* () {
                    const quantity = yield (0, libs_1.Product)(empresa, false)
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
                    return Object.assign(Object.assign({}, brand.toJSON()), { quantity });
                })));
                optionsFeatures = yield (0, libs_2.getFeatures)(products, category.id);
            }
            const discounts = yield Promise.all((0, helpers_1.createIncrementArray)(products.map((product) => product.discount)).map((disc) => __awaiter(this, void 0, void 0, function* () {
                const quantity = yield (0, libs_1.Product)(empresa, false)
                    .unscoped()
                    .count({
                    where: {
                        discount: { [sequelize_1.Op.gte]: disc !== null && disc !== void 0 ? disc : 0 },
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
            })));
            return {
                title: category.name,
                description: category.name,
                priceMinMax: { max: max !== null && max !== void 0 ? max : 0, min: min !== null && min !== void 0 ? min : 0 },
                subcategory,
                discounts,
                brands,
                optionsFeatures,
            };
        });
    }
    marcas(brands, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const { brand } = yield this.brandsApiService.show(empresa, brands);
            const products = yield (0, libs_1.Product)(empresa, false)
                .unscoped()
                .findAll({
                attributes: ["id", "price", "discount"],
                where: {
                    brand_id: brand.id,
                    enabled: true,
                    empresa_id: empresa.id,
                },
            });
            const mappedProducts = products.map((prod) => (0, helpers_2.subtotalIgv)(empresa, prod));
            const max = Math.max(...mappedProducts);
            const min = Math.min(...mappedProducts);
            let optionsFeatures = null;
            if ([1, 3].includes(empresa.tipo_empresa.tipo_servicio_id)) {
                optionsFeatures = yield (0, libs_2.getFeatures)(products, undefined, brand.id);
            }
            const discounts = yield Promise.all((0, helpers_1.createIncrementArray)(products.map((product) => product.discount)).map((disc) => __awaiter(this, void 0, void 0, function* () {
                const quantity = yield (0, libs_1.Product)(empresa, false)
                    .unscoped()
                    .count({
                    where: {
                        discount: { [sequelize_1.Op.gte]: disc !== null && disc !== void 0 ? disc : 0 },
                        brand_id: brand.id,
                        enabled: true,
                        empresa_id: empresa.id,
                    },
                });
                return {
                    value: disc,
                    quantity,
                };
            })));
            return {
                title: brand.name,
                description: brand.name,
                brand,
                priceMinMax: { max: max !== null && max !== void 0 ? max : 0, min: min !== null && min !== void 0 ? min : 0 },
                discounts,
                optionsFeatures,
            };
        });
    }
    admin() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                success: true,
            };
        });
    }
    fetchProductArrays(empresa, products, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const arraysLengths = products.map((arr) => arr.length);
            const allProducts = products.flat();
            const allProductsMapped = yield fetchProducts(empresa, allProducts);
            function splitResults(allResults, arraysLengths) {
                let index = 0;
                return arraysLengths.map((length) => {
                    const result = allResults.slice(index, index + length);
                    index += length;
                    return result;
                });
            }
            function fetchProducts(empresa, products) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield Promise.all(products.map((product) => (0, libs_1.getProductAll)(empresa, product, user, false)));
                });
            }
            return splitResults(allProductsMapped, arraysLengths);
        });
    }
};
exports.WebApiService = WebApiService;
exports.WebApiService = WebApiService = __decorate([
    (0, express_core_1.Injectable)(),
    __metadata("design:paramtypes", [products_api_service_1.ProductsApiService,
        categories_api_service_1.CategoriesApiService,
        background_api_service_1.BackgroundApiService,
        brands_api_service_1.BrandsApiService,
        subcategories_api_service_1.SubCategoriesApiService])
], WebApiService);
