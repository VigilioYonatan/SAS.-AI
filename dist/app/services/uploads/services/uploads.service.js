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
exports.UploadsService = void 0;
const express_core_1 = require("@vigilio/express-core");
const helpers_1 = require("@vigilio/express-core/helpers");
const express_core_2 = require("@vigilio/express-core");
const helpers_2 = require("../libs/helpers");
const libs_1 = require("@/products/libs");
const libs_2 = require("@/empresas/libs");
const users_api_service_1 = require("@/users/services/users.api.service");
const products_api_service_1 = require("@/products/services/products.api.service");
const libs_3 = require("@/users/libs");
const libs_4 = require("@/orders/libs");
const empresas_api_service_1 = require("@/empresas/services/empresas.api.service");
const libs_5 = require("@/posts/libs");
const posts_api_service_1 = require("@/posts/services/posts.api.service");
const background_api_service_1 = require("@/empresas/services/background.api.service");
const categories_api_service_1 = require("@/products/services/categories.api.service");
const brands_api_service_1 = require("@/products/services/brands.api.service");
const libs_6 = require("@/suppliers/libs");
const suppliers_api_service_1 = require("@/suppliers/services/suppliers.api.service");
const new_api_service_1 = require("@/empresas/services/new.api.service");
const subcategories_api_service_1 = require("@/products/services/subcategories.api.service");
const settings_api_service_1 = require("@/empresas/services/settings.api.service");
const file_entity_1 = require("@/empresas/entities/file.entity");
const variants_entity_1 = require("@/products/entities/options/variants.entity");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
const cache_1 = __importDefault(require("@vigilio/express-core/cache"));
let UploadsService = class UploadsService {
    constructor(usersApiService, productsApiService, empresasApiService, postsApiService, backgroundApiService, categoriesApiService, subCategoriesApiService, brandsApiService, suppliersApiService, newApiService, settingsApiService) {
        this.usersApiService = usersApiService;
        this.productsApiService = productsApiService;
        this.empresasApiService = empresasApiService;
        this.postsApiService = postsApiService;
        this.backgroundApiService = backgroundApiService;
        this.categoriesApiService = categoriesApiService;
        this.subCategoriesApiService = subCategoriesApiService;
        this.brandsApiService = brandsApiService;
        this.suppliersApiService = suppliersApiService;
        this.newApiService = newApiService;
        this.settingsApiService = settingsApiService;
    }
    store(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const { entity, property } = props;
            const { files, filesName: name, empresa, } = props.req;
            const userAuth = props.req.user;
            let qualities = {};
            switch (entity) {
                case "users":
                    if (property === "photo") {
                        qualities = yield this.customUpload(files, { maxFiles: 1, required: false }, libs_3.usersPhotoQualities);
                    }
                    break;
                case "products":
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    if (property === "images") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 12,
                            required: false,
                            typeFile: {
                                value: [
                                    "image/jpg",
                                    "image/webp",
                                    "image/jpeg",
                                    "image/gif",
                                    "image/png",
                                    "video/mp4",
                                ],
                            },
                            maxSize: empresa.isFreeVPS ? 15 : 50,
                        }, libs_1.productsImagesQualities);
                    }
                    break;
                case "suppliers":
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    if (property === "logo") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                        }, libs_6.suppliersLogoQualities);
                    }
                    break;
                case "categories":
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    if (property === "image") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: false,
                            typeFile: {
                                value: [
                                    "image/jpg",
                                    "image/webp",
                                    "image/jpeg",
                                    "image/gif",
                                    "image/png",
                                    "video/mp4",
                                ],
                            },
                            maxSize: empresa.isFreeVPS ? 25 : 50,
                        }, libs_1.categoriesImageQualities);
                    }
                    if (property === "wallpaper") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: false,
                            typeFile: {
                                value: [
                                    "image/jpg",
                                    "image/webp",
                                    "image/jpeg",
                                    "image/gif",
                                    "image/png",
                                    "video/mp4",
                                ],
                            },
                            maxSize: empresa.isFreeVPS ? 25 : 50,
                        }, libs_1.categoriesWallpaperQualities);
                    }
                    break;
                case "subcategories":
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    if (property === "image") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                        }, libs_1.categoriesImageQualities);
                    }
                    break;
                case "brands":
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    if (property === "image") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                        }, libs_1.brandsImageQualities);
                    }
                    break;
                case "orders":
                    if (property === "transferencia_image") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                        }, libs_4.ordersTransferenciaImage);
                    }
                    break;
                case "posts":
                    if (property === "image") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                        }, libs_5.postsImageQualities);
                    }
                    break;
                case "files":
                    if (property === "file") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                            typeFile: {
                                value: [
                                    "image/jpg",
                                    "image/webp",
                                    "image/jpeg",
                                    "image/gif",
                                    "image/png",
                                    "video/mp4",
                                    "application/pdf",
                                    "text/plain",
                                ],
                            },
                        }, null);
                    }
                    break;
                case "new":
                    if (property === "image") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                        }, [100, 800]);
                    }
                    break;
                case "metodos_pago":
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    if (property === "qrYape") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                        }, [500]);
                    }
                    if (property === "qrPlin") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                        }, [500]);
                    }
                    break;
                case "background":
                    if (property === "image") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                            typeFile: {
                                value: [
                                    "image/jpg",
                                    "image/webp",
                                    "image/jpeg",
                                    "image/gif",
                                    "image/png",
                                    "video/mp4",
                                ],
                            },
                            maxSize: empresa.isFreeVPS ? 50 : 100,
                        }, libs_2.backgroundQualities);
                    }
                    break;
                case "settings":
                    if (property === "background_auth") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                        }, [100, 1600]);
                        cache_1.default.delete(`EMPRESA:${empresa.slug}`);
                    }
                    break;
                case "empresas":
                    if (property === "certificado") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                            typeFile: {
                                value: [
                                    "application/x-pkcs12",
                                    "application/x-x509-ca-cert",
                                    "application/octet-stream",
                                ],
                            },
                        }, null, "/files");
                    }
                    if (property === "logo") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                        }, libs_2.empresasLogoQualities);
                    }
                    if (property === "photo") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                        }, [100, 800]);
                    }
                    if (property === "logo_pwa") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                        }, libs_2.empresasLogoPWAQualities, undefined, true);
                    }
                    if (property === "icon") {
                        qualities = yield this.customUpload(files, {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                        }, [100, 300]);
                    }
                    cache_1.default.delete(`EMPRESA:${empresa.slug}`);
                    break;
                default:
                    throw new express_core_2.InternalServerErrorException("Error server, comunicarse con desarrollador");
            }
            const responseFile = yield (0, helpers_2.uploadFiles)(Object.assign({ empresa,
                files,
                entity,
                name }, qualities));
            return {
                success: true,
                files: responseFile,
            };
        });
    }
    update(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const { entity, property, id } = props;
            const { files, filesName: name, empresa, query, } = props.req;
            const userAuth = props.req.user;
            let entidad = null;
            switch (entity) {
                case "users": {
                    if (!userAuth ||
                        !userAuth.enabled ||
                        userAuth.id !== Number(id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    const { user } = yield this.usersApiService.show(empresa, id);
                    entidad = user;
                    if (user.photo) {
                        (0, helpers_2.removeFile)(empresa.slug, user.photo);
                    }
                    break;
                }
                case "products": {
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    const { product } = yield this.productsApiService.show(empresa, id, query.type === "service", true, userAuth, false);
                    entidad = product;
                    if (product.images) {
                        (0, helpers_2.removeFile)(empresa.slug, product.images);
                        if (product instanceof products_normal_entity_1.ProductsNormal) {
                            yield variants_entity_1.Variants.update({ images: [] }, {
                                where: {
                                    product_normal_id: product.id,
                                    empresa_id: empresa.id,
                                },
                            });
                        }
                    }
                    break;
                }
                case "categories": {
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    const { category } = yield this.categoriesApiService.show(empresa, id);
                    entidad = category;
                    if (property === "image" && category.image) {
                        (0, helpers_2.removeFile)(empresa.slug, category.image);
                    }
                    if (property === "wallpaper" && category.wallpaper) {
                        (0, helpers_2.removeFile)(empresa.slug, category.wallpaper);
                    }
                    break;
                }
                case "subcategories": {
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    const { subcategory } = yield this.subCategoriesApiService.show(empresa, id);
                    entidad = subcategory;
                    if (property === "image" && subcategory.image) {
                        (0, helpers_2.removeFile)(empresa.slug, subcategory.image);
                    }
                    break;
                }
                case "brands": {
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    const { brand } = yield this.brandsApiService.show(empresa, id);
                    entidad = brand;
                    if (property === "image" && brand.image) {
                        (0, helpers_2.removeFile)(empresa.slug, brand.image);
                    }
                    break;
                }
                case "metodos_pago": {
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    const { metodo } = yield this.empresasApiService.metodos_pago(empresa.slug);
                    entidad = metodo;
                    if (property === "qrPlin") {
                        if (metodo.qrPlin) {
                            (0, helpers_2.removeFile)(empresa.slug, metodo.qrPlin);
                        }
                    }
                    if (property === "qrYape") {
                        if (metodo.qrYape) {
                            (0, helpers_2.removeFile)(empresa.slug, metodo.qrYape);
                        }
                    }
                    break;
                }
                case "posts": {
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    const { post } = yield this.postsApiService.show(empresa, id);
                    entidad = post;
                    if (property === "image") {
                        (0, helpers_2.removeFile)(empresa.slug, post.image);
                    }
                    break;
                }
                case "background": {
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    const { background } = yield this.backgroundApiService.show(empresa, id);
                    entidad = background;
                    if (property === "image") {
                        (0, helpers_2.removeFile)(empresa.slug, background.image);
                    }
                    break;
                }
                case "settings": {
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    const { data } = yield this.settingsApiService.index(empresa);
                    entidad = data;
                    if (property === "background_auth" && data.background_auth) {
                    }
                    break;
                }
                case "suppliers": {
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    const { supplier } = yield this.suppliersApiService.show(empresa, id);
                    entidad = supplier;
                    if (property === "logo") {
                        if (supplier.logo) {
                            (0, helpers_2.removeFile)(empresa.slug, supplier.logo);
                        }
                    }
                    break;
                }
                case "files": {
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    const file = yield file_entity_1.FileSchema.findOne({
                        where: { id: Number(id), empresa_id: empresa.id },
                    });
                    if (!file)
                        throw new express_core_2.BadRequestException("No se encontró empresa file");
                    entidad = file;
                    if (property === "file") {
                        (0, helpers_2.removeFile)(empresa.slug, file.file);
                    }
                    break;
                }
                case "new": {
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    const { nuevo } = yield this.newApiService.show(empresa, Number(id));
                    entidad = nuevo;
                    if (property === "image") {
                        if (nuevo.image) {
                            (0, helpers_2.removeFile)(empresa.slug, nuevo.image);
                        }
                    }
                    break;
                }
                case "empresas": {
                    if (!userAuth ||
                        !userAuth.enabled ||
                        ![1].includes(userAuth.role_id))
                        throw new express_core_2.UnauthorizedException("No tiene permiso para realizar esta acción");
                    const { empresa: emp } = yield this.empresasApiService.show(empresa.slug);
                    entidad = emp;
                    if (property === "logo" && empresa.logo) {
                        (0, helpers_2.removeFile)(empresa.slug, empresa.logo);
                    }
                    if (property === "logo_pwa" && empresa.logo_pwa) {
                        (0, helpers_2.removeFile)(empresa.slug, empresa.logo_pwa);
                    }
                    if (property === "certificado" && empresa.certificado) {
                        (0, helpers_2.removeFile)(empresa.slug, empresa.certificado);
                    }
                    if (property === "icon" && emp.icon) {
                        (0, helpers_2.removeFile)(empresa.slug, emp.icon);
                    }
                    break;
                }
                default:
                    throw new express_core_2.BadRequestException("Error server, comunicarse con desarrollador");
            }
            let filesFoto = null;
            if (files) {
                const { files: responseFile } = yield this.store({
                    req: props.req,
                    entity,
                    property,
                });
                filesFoto = responseFile;
            }
            entidad[property] = filesFoto;
            yield entidad.save();
            return {
                success: true,
                files: filesFoto,
            };
        });
    }
    customUpload(files_1, validation_1, qualities_1) {
        return __awaiter(this, arguments, void 0, function* (files, validation, qualities, directory = "/images", isPwa) {
            try {
                yield (0, helpers_1.validateUpload)(files, validation);
                return { qualities, directory, isPwa };
            }
            catch (error) {
                throw new express_core_2.BadRequestException(error);
            }
        });
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, express_core_1.Injectable)(),
    __metadata("design:paramtypes", [users_api_service_1.UsersApiService,
        products_api_service_1.ProductsApiService,
        empresas_api_service_1.EmpresasApiService,
        posts_api_service_1.PostsApiService,
        background_api_service_1.BackgroundApiService,
        categories_api_service_1.CategoriesApiService,
        subcategories_api_service_1.SubCategoriesApiService,
        brands_api_service_1.BrandsApiService,
        suppliers_api_service_1.SuppliersApiService,
        new_api_service_1.NewApiService,
        settings_api_service_1.SettingsApiService])
], UploadsService);
