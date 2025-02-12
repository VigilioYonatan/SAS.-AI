import {
    Injectable,
    InternalServerErrorException,
} from "@vigilio/express-core";
import { Empresas } from "../entities/empresas.entity";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import type { EmpresasUpdateDto } from "../dtos/empresas.update.dto";
import type { EmpresasFacturacionUpdateDto } from "../dtos/empresas.facturacion.store.dto";
import type { EmpresasIAUpdateDto } from "../dtos/empresas.ia.update.dto";
import type {
    ContactsSchema,
    GroupWhatsapp,
    Payments,
    ScheduleSchema,
    Whatsappconfig,
    WhatsappMode,
} from "../schemas/empresas.schema";
import type { EmpresasAddressUpdateDto } from "../dtos/empresas.address.update.dto";
import { Address } from "../entities/address.entity";
import { pathUploads, uploadsEntities } from "@/uploads/libs/helpers";
import fs from "node:fs";
import type { EmpresasStoreDto } from "../dtos/empresas.store.dto";
import type { MetodosPagoUpdateDto } from "../dtos/metodosPago.update.dto";
import { MetodosPago } from "../entities/metodosPago.entity";
import type { MetodosPagoSchema } from "../schemas/metodosPago.schema";
import { UsersApiService } from "@/users/services/users.api.service";
import { generateId, slug } from "@vigilio/express-core/helpers";
import openai from "openai";
import { Regions } from "@/ubigeo/entities/regions.entity";
import { RegionsEmpresa } from "@/ubigeo/entities/regions_empresa.entity";
import { Countries } from "@/ubigeo/entities/countries.entity";
import { BackgroundApiService } from "./background.api.service";
import { BASE_URL } from "../libs";
import { mesasSeeder } from "../seeders/mesas.seeder";
import { Floors } from "@/orders/entities/floors.entity";
import { downloadAndSaveFile, terminal } from "~/libs/helpers";
import enviroments from "~/config/enviroments.config";
import { Settings } from "../entities/settings.entity";
import type { SettingsSchema } from "../schemas/settings.schema";
import { NOW, restarDays } from "~/libs/dayjs";
import { initializeBot } from "@/bot/libs/ai";
import type { SettingsUpdateDto } from "../dtos/settings.update.dto";
import { NodeSSH } from "node-ssh";
import { onNginx } from "../libs/subdominio";
import { TipoFinanza } from "@/finanzas/entities/tipo.entity";
import { finanzasSeeder } from "@/finanzas/seeders/finanzas.seeder";
import { CategoriesFinanzas } from "@/finanzas/entities/categories.entity";
import cache from "@vigilio/express-core/cache";
import { GridBanner } from "../entities/grid_banner.entity";
import { Users } from "@/users/entities/users.entity";
import { usersSeeder } from "@/users/seeders/users.seeder";
import { FileSchema } from "../entities/file.entity";
import { Background } from "../entities/background.entity";
import { Categories } from "@/products/entities/categories.entity";
import { Subcategories } from "@/products/entities/subcategories.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { getProductAll } from "@/products/libs";
import { Options } from "@/products/entities/options/options.entity";
import { Features } from "@/products/entities/options/features.entity";
import { Brands } from "@/products/entities/brands.entitiy";
import { ProductsApiService } from "@/products/services/products.api.service";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { Page } from "../entities/page.entity";
import { GridBannerPage } from "../entities/grid_banner_page.entity";
import { PagesApiService } from "./pages.api.service";
// import { sequelize } from "~/config/db.config";

export let openAis: Record<string, openai> = {};
export async function initial() {
    // await sequelize.query(`DELETE FROM "Test"`);
    const empresas = await Empresas.findAll({
        attributes: [
            "slug",
            "credentials",
            "payments",
            "telegram_token",
            "id",
            "name_empresa",
            "whatsapp_mode",
            "model_ai",
        ],
    });
    for (const empresa of empresas) {
        try {
            if (empresa.model_ai === "open-ai") {
                const openAiClient = new openai.OpenAI({
                    apiKey: empresa.credentials.open_ai,
                });
                openAis = { ...openAis, [empresa.slug]: openAiClient };
            } else {
                const openAiClient = new openai.OpenAI({
                    apiKey: empresa.credentials.deekseek_ai,
                    baseURL: "https://api.deepseek.com",
                });
                openAis = { ...openAis, [empresa.slug]: openAiClient };
            }
        } catch (error) {}

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const whatsapp_mode: any = empresa.whatsapp_mode;

        // await empresa.update({
        //     whatsapp_mode: {
        //         name: "docker",
        //         enabled: true,
        //         type: "FREE",
        //         password: null,
        //         date: null,
        //         memory: null,
        //         ip: null,
        //         cpu: null,
        //     },
        // });
        // const optionss = await Options.findOne({
        //     where: {
        //         type: 2,
        //     },
        // });

        // const feats = await Features.count({
        //     where: {
        //         option_id: optionss?.id,
        //     },
        // });

        // if (feats < 22) {
        //     await Promise.all(
        //         [
        //             { value: "#D2691E", description: "Chocolate" },
        //             { value: "#A52A2A", description: "Marrón" },
        //             { value: "#D3D3D3", description: "Gris Claro" },
        //             { value: "#90EE90", description: "Verde Claro" },
        //             { value: "#FF6347", description: "Tomato" },
        //             { value: "#8B0000", description: "Rojo Oscuro" },
        //             { value: "#20B2AA", description: "Verde Turquesa" },
        //             { value: "#C71585", description: "Violeta Oscuro" },
        //             { value: "#B0C4DE", description: "Azul Claro" },
        //             { value: "#FF4500", description: "Rojo Anaranjado" },
        //             { value: "#3CB371", description: "Verde Medio" },
        //             { value: "#F4A460", description: "Siena" },
        //             { value: "#DCDCDC", description: "Gris Claro" },
        //             { value: "#F08080", description: "Rosa Claro" },
        //             { value: "#FF8C00", description: "Naranja Oscuro" },
        //             { value: "#4682B4", description: "Azul Acero" },
        //             { value: "#6A5ACD", description: "Azul Púrpura" },
        //             { value: "#2E8B57", description: "Verde Bosque" },
        //             { value: "#A9A9A9", description: "Gris Oscuro" },
        //             { value: "#708090", description: "Gris Azulado" },
        //             { value: "#BDB76B", description: "Olivino" },
        //             { value: "#FF1493", description: "Rosa Fucsia" },
        //             { value: "#7B68EE", description: "Púrpura Oscuro" },
        //             { value: "#ADFF2F", description: "Verde Amarillo" },
        //             { value: "#FF7F50", description: "Coral" },
        //             { value: "#D3D3D3", description: "Gris Claro" },
        //         ].map(async (a, i) => {
        //             await Features.create({
        //                 id: 200 + i,
        //                 value: a.value,
        //                 description: a.description,
        //                 option_id: optionss?.id,
        //             });
        //         })
        //     );
        // }
        if (!Array.isArray(whatsapp_mode)) {
            const whatsapp_mode2 = [
                { ...whatsapp_mode, name: "docker", enabled: true },
            ];
            // Si ya existía el registro pero el valor está vacío, actualizarlo
            await empresa.update({
                whatsapp_mode: whatsapp_mode2,
            });
        } else {
            if (!empresa.whatsapp_mode.length) {
                await empresa.update({
                    whatsapp_mode: [
                        {
                            cpu: null,
                            type: "FREE",
                            name: "docker",
                            date: null,
                            ip: null,
                            enabled: true,
                            memory: null,
                            password: null,
                        },
                    ],
                });
            }
        }
        if (empresa.telegram_token) {
            await initializeBot(empresa, empresa.telegram_token);
        }
        // // tipos finanzas
        // const pageHome = await Page.findOne({
        //     where: {
        //         slug: "home",
        //         empresa_id: empresa.id,
        //     },
        // });

        // if (!pageHome) {
        //     await Page.create({
        //         title: "Home",
        //         description: `En ${empresa.name_empresa}, ofrecemos una amplia variedad de productos de alta calidad a precios inmejorables, encontrarás todo lo que necesitas en un solo lugar. Disfruta de envíos rápidos, devoluciones fáciles y un servicio al cliente excepcional. ¡Explora nuestras ofertas diarias y descubre la diferencia de comprar en Tienda XYZ!`,
        //         slug: "home",
        //         empresa_id: empresa.id,
        //         icon: "<i class='fas fa-home'></i>",
        //         queries: [],
        //         isDinamic: false,
        //         enabledHeaderPage: true,
        //     });
        // }
        // // const finanzas = await TipoFinanza.findAll();
        // const bg_color_header = await Settings.findOrCreate({
        //     where: { empresa_id: empresa!.id },
        //     defaults: { bg_color_header: "transparent" }, // Valores predeterminados si se crea
        // });
        // const isLogin = await Settings.findOrCreate({
        //     where: { empresa_id: empresa!.id },
        //     defaults: { isLogin: true }, // Valores predeterminados si se crea
        // });
        // const products_limit = await Settings.findOrCreate({
        //     where: { empresa_id: empresa!.id },
        //     defaults: { products_limit: 10 }, // Valores predeterminados si se crea
        // });
        // const products_limit_offer = await Settings.findOrCreate({
        //     where: { empresa_id: empresa!.id },
        //     defaults: { products_limit_offer: 4 }, // Valores predeterminados si se crea
        // });
        // const isEccomerce = await Settings.findOrCreate({
        //     where: { empresa_id: empresa!.id },
        //     defaults: { isEccomerce: true }, // Valores predeterminados si se crea
        // });
        const model_ai = await Empresas.findOrCreate({
            where: {
                id: empresa!.id,
            },
            defaults: {
                model_ai: "open-ai",
            },
        });
        // const type_loader = await Settings.findOrCreate({
        //     where: { empresa_id: empresa!.id },
        //     defaults: { type_loader: "null" }, // Valores predeterminados si se crea
        // });
        // const text_color = await Settings.findOrCreate({
        //     where: { empresa_id: empresa!.id },
        //     defaults: { text_color: "transparent" }, // Valores predeterminados si se crea
        // });
        // const enabled_zoho_mail = await Empresas.findOrCreate({
        //     where: { id: empresa!.id },
        //     defaults: { enabled_zoho_mail: false }, // Valores predeterminados si se crea
        // });
        // // const isProduction = await Empresas.findOrCreate({
        // //     where: { id: empresa!.id },
        // //     defaults: { isProduction: false }, // Valores predeterminados si se crea
        // // });
        // const gridBanners = await GridBanner.findAll({
        //     where: {
        //         empresa_id: empresa.id,
        //     },
        // });
        const address = await Address.findAll({
            where: {
                empresa_id: empresa.id,
            },
        });
        await Promise.all(
            address.map(async (add) => {
                const enabled = await Address.findOrCreate({
                    where: { empresa_id: empresa!.id, id: add.id },
                    defaults: { enabled: true }, // Valores predeterminados si se crea
                });
                if (!enabled[1]) {
                    // Si ya existía el registro pero el valor está vacío, actualizarlo
                    await enabled[0].update({
                        enabled: true,
                    });
                }
            })
        );
        // const queries = await Page.findOrCreate({
        //     where: { empresa_id: empresa!.id },
        //     defaults: { queries: [] }, // Valores predeterminados si se crea
        // });
        // if (!bg_color_header[1] && !bg_color_header[0].bg_color_header) {
        //     // Si ya existía el registro pero el valor está vacío, actualizarlo
        //     await bg_color_header[0].update({ bg_color_header: "transparent" });
        // }
        // if (!isLogin[1] && !isLogin[0].isLogin) {
        //     // Si ya existía el registro pero el valor está vacío, actualizarlo
        //     await isLogin[0].update({ isLogin: true });
        // }
        // if (!queries[1] && !queries[0].queries) {
        //     // Si ya existía el registro pero el valor está vacío, actualizarlo
        //     await queries[0].update({ queries: [] });
        // }
        // // if (!isProduction[1] && !isProduction[0].isProduction) {
        // //     // Si ya existía el registro pero el valor está vacío, actualizarlo
        // //     await isProduction[0].update({ isProduction: true });
        // // }
        // if (!enabled_zoho_mail[1] && !enabled_zoho_mail[0].enabled_zoho_mail) {
        //     // Si ya existía el registro pero el valor está vacío, actualizarlo
        //     await enabled_zoho_mail[0].update({
        //         enabled_zoho_mail: false,
        //     });
        // }
        // if (!isEccomerce[1] && !isEccomerce[0].isEccomerce) {
        //     // Si ya existía el registro pero el valor está vacío, actualizarlo
        //     await isEccomerce[0].update({
        //         isEccomerce: true,
        //     });
        // }
        // if (!products_limit[1] && !products_limit[0].products_limit) {
        //     // Si ya existía el registro pero el valor está vacío, actualizarlo
        //     await products_limit[0].update({
        //         products_limit: 5,
        //     });
        // }
        // if (
        //     !products_limit_offer[1] &&
        //     !products_limit_offer[0].products_limit_offer
        // ) {
        //     // Si ya existía el registro pero el valor está vacío, actualizarlo
        //     await products_limit[0].update({
        //         products_limit_offer: 4,
        //     });
        // }
        // if (!type_loader[1] && !type_loader[0].type_loader) {
        //     // Si ya existía el registro pero el valor está vacío, actualizarlo
        //     await type_loader[0].update({
        //         type_loader: "null" as Settings["type_loader"],
        //     });
        // }
        // if (!text_color[1] && !text_color[0].text_color) {
        //     // Si ya existía el registro pero el valor está vacío, actualizarlo
        //     await text_color[0].update({
        //         text_color: "transparent" as Settings["text_color"],
        //     });
        // }

        // if (gridBanners.length < 6) {
        //     await Promise.all(
        //         Array.from({ length: 5 }).map(async () => {
        //             await GridBanner.create({
        //                 html: null,
        //                 enabled: false,
        //                 empresa_id: empresa!.id,
        //                 title: null,
        //             });
        //         })
        //     );
        // }
        // await Promise.all(
        //     pages.map(async (page) => {
        //         const isDinamic = await Page.findOrCreate({
        //             where: { id: page.id, empresa_id: empresa!.id },
        //             defaults: { isDinamic: false }, // Valores predeterminados si se crea
        //         });
        //         const enabledHeaderPage = await Page.findOrCreate({
        //             where: { id: page.id, empresa_id: empresa!.id },
        //             defaults: { enabledHeaderPage: false }, // Valores predeterminados si se crea
        //         });

        //         if (!isDinamic[1] && !isDinamic[0].isDinamic) {
        //             // Si ya existía el registro pero el valor está vacío, actualizarlo
        //             await isDinamic[0].update({
        //                 isDinamic: false,
        //             });
        //         }
        //         if (
        //             !enabledHeaderPage[1] &&
        //             !enabledHeaderPage[0].enabledHeaderPage
        //         ) {
        //             // Si ya existía el registro pero el valor está vacío, actualizarlo
        //             await enabledHeaderPage[0].update({
        //                 enabledHeaderPage: false,
        //             });
        //         }
        //         const gridBannersPage = await GridBannerPage.findAll({
        //             where: {
        //                 empresa_id: empresa.id,
        //                 page_id: page.id,
        //             },
        //         });
        //         if (gridBannersPage.length < 6) {
        //             await Promise.all(
        //                 Array.from({ length: 5 }).map(async () => {
        //                     await GridBannerPage.create({
        //                         html: null,
        //                         enabled: false,
        //                         empresa_id: empresa!.id,
        //                         title: null,
        //                         page_id: page.id,
        //                     });
        //                 })
        //             );
        //         }
        //     })
        // );

        // openAis = { ...openAis, [empresa.slug]: openAiClient };
    }
}

@Injectable()
export class EmpresasApiService {
    constructor(
        private readonly UsersApiService: UsersApiService,
        private readonly backgroundApiService: BackgroundApiService,
        private readonly productsApiService: ProductsApiService,
        private readonly pagesApiService: PagesApiService
    ) {}
    async payment(slug: string) {
        const iaTokens = JSON.parse(cache.get(`IA_TOKENS:${slug}`) ?? "null");

        if (iaTokens) {
            await Empresas.update(iaTokens, { where: { slug } });
            cache.delete(`IA_TOKENS:${slug}`);
        }
        const data = await Empresas.unscoped().findOne({
            where: { slug },
            attributes: [
                "payments",
                "slug",
                "id",
                "credentials",
                "enabled_zoho_mail",
                "isProduction",
                "payment_completed",
                "date_cuota",
            ],
        });
        if (!data) throw new NotFoundException(`no se encontró ${slug}`);
        return {
            success: true,
            data,
        };
    }
    async settings(slug: string) {
        const { empresa } = await this.show(slug);
        const data = await Settings.findOne({
            where: {
                empresa_id: empresa!.id,
            },
        });
        if (!data) throw new NotFoundException("no se encontró settings");

        cache.delete(`EMPRESA:${empresa.slug}`);
        return {
            success: true,
            data,
        };
    }
    async settingsTemplate(slug: string) {
        const { data: setting } = await this.settings(slug);
        const { empresa } = await this.show(slug);
        const gridBanners = await GridBanner.findAll({
            where: {
                empresa_id: empresa!.id,
            },
            order: [["id", "ASC"]],
        });

        const pages = await Page.findAll({
            where: {
                empresa_id: empresa.id,
            },
            include: [GridBannerPage],
        });
        let files = await FileSchema.findAll({
            where: { empresa_id: empresa!.id },
        });
        files = files.map((f) => {
            const file = f.file
                ? f.file?.map((file) => {
                      return {
                          ...file,
                          file: `${BASE_URL(empresa)}/empresas/${
                              empresa.slug
                          }/${file.file}`,
                      };
                  })
                : null;
            return {
                ...f.toJSON(),
                file,
            };
        }) as FileSchema[];
        let backgrounds = await Background.findAll({
            where: { empresa_id: empresa!.id },
        });
        backgrounds = backgrounds.map((f) => {
            const image = f.image
                ? f.image?.map((file) => {
                      return {
                          ...file,
                          file: `${BASE_URL(empresa)}/empresas/${
                              empresa.slug
                          }/${file.file}`,
                      };
                  })
                : null;
            return {
                ...f.toJSON(),
                image,
            };
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        }) as any;

        let categories = await Categories.findAll({
            where: { empresa_id: empresa!.id },
            limit: 2,
        });
        let brands = await Brands.findAll({
            where: { empresa_id: empresa!.id },
        });
        brands = (await Promise.all(
            brands.map(async (brand) => {
                const image = brand.image
                    ? brand.image?.map((file) => {
                          return {
                              ...file,
                              file: `${BASE_URL(empresa)}/empresas/${
                                  empresa.slug
                              }/${file.file}`,
                          };
                      })
                    : null;
                return {
                    ...brand.toJSON(),
                    image,
                };
            })
        )) as Brands[];
        categories = await Promise.all(
            categories.map(async (category) => {
                const image = category.image
                    ? category.image.map((file) => {
                          return {
                              ...file,
                              file: `${BASE_URL(empresa)}/empresas/${
                                  empresa.slug
                              }/${file.file}`,
                          };
                      })
                    : null;
                const wallpaper = category.wallpaper?.map((file) => {
                    return {
                        ...file,
                        file: `${BASE_URL(empresa)}/empresas/${empresa.slug}/${
                            file.file
                        }`,
                    };
                });
                let subcategories = (await category.$get(
                    "subcategories"
                )) as Subcategories[];
                subcategories = subcategories.map((sub) => {
                    const image = sub.image
                        ? sub.image.map((file) => {
                              return {
                                  ...file,
                                  file: `${BASE_URL(empresa)}/empresas/${
                                      empresa.slug
                                  }/${file.file}`,
                              };
                          })
                        : null;

                    return {
                        ...sub.toJSON(),
                        image,
                        wallpaper,
                    };
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                }) as any;
                let productsNormals = (await category.$get(
                    "productsNormals"
                )) as ProductsNormal[];
                productsNormals = (await Promise.all(
                    productsNormals.map(async (prod) => {
                        const product = await getProductAll(
                            empresa,
                            prod,
                            null,
                            false
                        );
                        const images = prod.images
                            ? prod.images?.map((file) => {
                                  return {
                                      ...file,
                                      file: `${BASE_URL(empresa)}/empresas/${
                                          empresa.slug
                                      }/${file.file}`,
                                  };
                              })
                            : null;
                        return {
                            ...prod.toJSON(),
                            images,
                            options: (
                                product.dataValues.options as Options[]
                            ).map((opt) => ({
                                option_id: opt.id,
                                features: (opt.features as Features[]).map(
                                    (feat) => feat.id
                                ),
                            })),
                        };
                    })
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                )) as any;
                // options: [{ features: [1], option_id: 1 }],
                let productsRestaurants = (await category.$get(
                    "productsRestaurants"
                )) as ProductsRestaurant[];
                productsRestaurants = productsRestaurants.map((prod) => {
                    const images = prod.images
                        ? prod.images?.map((file) => {
                              return {
                                  ...file,
                                  file: `${BASE_URL(empresa)}/empresas/${
                                      empresa.slug
                                  }/${file.file}`,
                              };
                          })
                        : null;
                    return {
                        ...prod.toJSON(),
                        images,
                    };
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                }) as any;
                let productsServicios = (await category.$get(
                    "productsServicios"
                )) as ProductsServicio[];
                productsServicios = productsServicios.map((prod) => {
                    const images = prod.images
                        ? prod.images.map((file) => {
                              return {
                                  ...file,
                                  file: `${BASE_URL(empresa)}/empresas/${
                                      empresa.slug
                                  }/${file.file}`,
                              };
                          })
                        : null;
                    return {
                        ...prod.toJSON(),
                        images,
                    };
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                }) as any;
                return {
                    ...category.toJSON(),
                    image: category.image ? image : null,
                    wallpaper: category.wallpaper ? wallpaper : null,
                    subcategories,
                    productsNormals,
                    productsRestaurants,
                    productsServicios,
                };
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            }) as any
        );
        const settingsBackground = {
            ...setting.toJSON(),
            background_auth: setting.background_auth
                ? setting.background_auth.map((file) => {
                      return {
                          ...file,
                          file: `${BASE_URL(empresa)}/empresas/${
                              empresa.slug
                          }/${file.file}`,
                      };
                  })
                : null,
        };

        return {
            success: true,
            data: {
                setting: settingsBackground,
                gridBanners: gridBanners,
                files,
                pages,
                backgrounds,
                categories,
                brands,
                logo: empresa.logo ? empresa.logo[0].file : null,
            },
        };
    }
    async updateSettings(slug: string, body: SettingsUpdateDto) {
        const { empresa } = await this.show(slug);
        const data = await Settings.findOne({
            where: {
                empresa_id: empresa!.id,
            },
        });

        await data!.update(body);

        cache.delete(`EMPRESA:${empresa.slug}`);
        return {
            success: true,
            message: "Editado correctamente",
        };
    }
    async paymentUpdate(
        slug: string,
        paymentDto: Payments & {
            tokenOpenAi: string;
            tokenDeepSeek: string;
            secure: string;
            enabled_zoho_mail: boolean;
            payment_completed: boolean;
            date_cuota: Date;
        }
    ) {
        if (paymentDto.secure !== "dokixd123@")
            throw new BadRequestException("Error");

        const { data } = await this.payment(slug);
        const {
            tokenOpenAi,
            tokenDeepSeek,
            secure,
            enabled_zoho_mail,
            ...rest
        } = paymentDto;
        await data.update({
            payments: rest,
            credentials: {
                ...data.credentials,
                open_ai: paymentDto.tokenOpenAi,
                deekseek_ai: paymentDto.tokenDeepSeek,
            },
            enabled_zoho_mail,
            date_cuota: paymentDto.date_cuota,
        });

        cache.delete(`EMPRESA:${slug}`);
        return {
            success: true,
            data,
        };
    }

    async show(slug: string) {
        let empresa = null;
        if (!Number.isNaN(Number(slug))) {
            empresa = await Empresas.findByPk(Number(slug), {
                attributes: {
                    exclude: ["company", "groupWhatsapp"],
                },
            });
        } else {
            empresa = await Empresas.findOne({
                where: {
                    slug,
                },
                attributes: {
                    exclude: ["company", "groupWhatsapp"],
                },
            });
        }

        if (!empresa) {
            throw new NotFoundException(
                `No se encontró un informacion con ${slug}`
            );
        }

        return {
            success: true,
            empresa,
        };
    }

    async store(body: EmpresasStoreDto) {
        let empresa: Empresas | null = null;
        try {
            const { password, fullname, ...rest } = body;
            const existingEmpresa = await Empresas.findOne({
                where: { slug: body.slug },
            });
            if (existingEmpresa) {
                // Maneja el caso donde el slug ya existe
                throw new Error("El slug ya está en uso");
            }

            empresa = new Empresas({
                ...rest,
                enabled_booster: false,
                enabledBot: true,
                enabledBotWeb: true,
                enabledClientPayComision: false,
                enabled_igv: true,
                enabledSound: true,
                isOpen: true,
                enabledAnimation: false,
                enabled_catalogo: true,
                enable_sell_country: false,
                token: `${body.slug}-${generateId().slice(4, 12)}`,
                whatsapp_mode: {
                    type: "FREE",
                    ip: null,
                    password: null,
                    memory: null,
                    cpu: null,
                },
                enable_map_marker: false,
                enabled_address: true,
                photo: [
                    {
                        file: `https://www.${body.slug}.vigilio-services.com/images/settings/others/restaurant.jpg`,
                        dimension: 800,
                    },
                ],
                icon: null,
                logo_pwa: null,
                model_ai: "open-ai",
            }) as Empresas;
            await empresa.save();

            const dirEmpresa = `${pathUploads()}/${empresa.slug}`;
            if (!fs.existsSync(pathUploads())) {
                fs.mkdirSync(pathUploads());
                // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                console.log("Creado directorio correctamente");
            }
            if (!fs.existsSync(dirEmpresa)) {
                fs.mkdirSync(dirEmpresa);
                // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                console.log("Creado directorio correctamente");
            }
            //    crear carpetas si no existe
            for (const entity of uploadsEntities) {
                const dir = `${dirEmpresa}/images`;
                const dirEntity = `${dir}/${entity}`;

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                    console.log("Creado directorio correctamente");
                }
                if (!fs.existsSync(dirEntity)) {
                    fs.mkdirSync(dirEntity);
                    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                    console.log("Creado directorio correctamente");
                }
            }

            if (body.servicio_id === 2) {
                await Promise.all(
                    mesasSeeder.map(async (floor) => {
                        const newFloor = await Floors.create({
                            name: floor.name,
                            empresa_id: empresa!.id,
                        });
                        await Promise.all(
                            floor.mesas.map(async (mesa) => {
                                await newFloor.$create("mesa", {
                                    mesa_code: mesa.mesa_code,
                                    empresa_id: empresa!.id,
                                });
                            })
                        );
                    })
                );
            }
            //! background here
            if (body.backgrounds) {
                await Promise.all(
                    body.backgrounds.map(async (background) => {
                        const { empresa_id, id, ...rest } = background;
                        const image = await Promise.all(
                            background.image.map(async (f) => {
                                const file = f.file.substring(
                                    f.file.indexOf("/images")
                                );
                                const dirEmpresa = `${pathUploads()}/${
                                    empresa!.slug
                                }`;
                                const dirEntity = `${dirEmpresa}${file}`;
                                await downloadAndSaveFile(f.file, dirEntity);

                                return {
                                    ...f,
                                    file,
                                };
                            })
                        );
                        await this.backgroundApiService.store(empresa!, {
                            ...rest,
                            image,
                        });
                    })
                );
            } else {
                await this.backgroundApiService.store(empresa, {
                    image: [
                        {
                            file: `${BASE_URL(
                                empresa
                            )}/images/settings/others/slider.jpg`,
                            dimension: 1000,
                        },
                    ],
                    html: null,
                });
            }

            const transferencias = {} as Record<
                keyof typeof empresa.bancos,
                { titular: null | string; dolares: null | string }
            >;
            for (const banco of empresa.bancos) {
                transferencias[banco.key as keyof typeof empresa.bancos] = {
                    titular: body.isTemplate ? "TEST-VIGILIO-SERVICES" : null,
                    dolares: body.isTemplate ? "TEST-VIGILIO-SERVICES" : null,
                    [empresa.money.simbolo]: body.isTemplate
                        ? "TEST-VIGILIO-SERVICES"
                        : null,
                };
            }
            const am8 = "09:00";
            const pm8 = "18:00";
            if (body.setting.background_auth) {
                const imag = await Promise.all(
                    body.setting.background_auth.map(async (f) => {
                        const file = f.file.substring(
                            f.file.indexOf("/images")
                        );
                        const dirEmpresa = `${pathUploads()}/${empresa!.slug}`;
                        const dirEntity = `${dirEmpresa}${file}`;
                        await downloadAndSaveFile(f.file, dirEntity);

                        return {
                            ...f,
                            file,
                        };
                    })
                );
            }

            // como hacer qeu sea {[bank.key]:{titular:null}}
            await Promise.all([
                empresa.$create("metodos_pago", {
                    transferencias,
                    enable_efectivo: true,
                    mercado_pago: {
                        token: body.isTemplate ? "test-key" : null,
                        enabled: body.isTemplate,
                    },
                    qrYape: null,
                    qrPlin: null,
                    paypal: {
                        enabled: body.isTemplate,
                        paypal_client_id: body.isTemplate ? "test-key" : null,
                        paypal_secret_key: body.isTemplate ? "test-key" : null,
                    },
                    izipay: {
                        enabled: body.isTemplate,
                        izipay_client_id: body.isTemplate ? "test-key" : null,
                        izipay_client_secret: body.isTemplate
                            ? "test-key"
                            : null,
                        izipay_hash_key: body.isTemplate ? "test-key" : null,
                        izipay_public_key: body.isTemplate ? "test-key" : null,
                        izipay_url: body.isTemplate ? "test-key" : null,
                    },
                    stripe: {
                        enabled: body.isTemplate,
                        stripe_client_secret: body.isTemplate
                            ? "test-key"
                            : null,
                        stripe_secret_key: body.isTemplate ? "test-key" : null,
                    },
                } as Omit<MetodosPagoSchema, "empresa_id">),
                Address.create({
                    city_id: 1,
                    urbanizacion: "",
                    direccion: "",
                    codLocal: "0000",
                    empresa_id: empresa.id,
                }),

                empresa.$create("setting", {
                    ...body.setting,
                    host: {
                        enabled: false,
                        host: null,
                        nameserver_one: null,
                        nameserver_two: null,
                        time: null,
                    },
                } as Omit<SettingsSchema, "id" | "empresa_id">),

                await empresa.$create("citasSetting", {
                    max_days: 14,
                    max_minutes: 60,
                    sendQuestionChunk: false,
                    enabled: true,
                    isNextDay: true,
                    maxCitas: 1,
                    sendAlert: 5,
                    maxCitasForHour: 1,
                    questions: [
                        {
                            question: "¿Cual es tu nombre completo?",
                            options: [],
                        },
                        {
                            question: "¿En que plataforma te gustaría la Cita?",
                            options: ["Microsoft Teams", "Discord", "Zoom"],
                        },
                    ],
                    custom: null,
                    horario: [
                        {
                            id: 1,
                            day: "Lunes",
                            openTime: am8,
                            closeTime: pm8,
                            enabled: true,
                        },
                        {
                            id: 2,
                            day: "Martes",
                            openTime: am8,
                            closeTime: pm8,
                            enabled: true,
                        },
                        {
                            id: 3,
                            day: "Miercoles",
                            openTime: am8,
                            closeTime: pm8,
                            enabled: true,
                        },
                        {
                            id: 4,
                            day: "Jueves",
                            openTime: am8,
                            closeTime: pm8,
                            enabled: true,
                        },
                        {
                            id: 5,
                            day: "Viernes",
                            openTime: am8,
                            closeTime: pm8,
                            enabled: true,
                        },
                        {
                            id: 6,
                            day: "Sabado",
                            openTime: am8,
                            closeTime: pm8,
                            enabled: true,
                        },
                        {
                            id: 0,
                            day: "Domingo",
                            openTime: am8,
                            closeTime: pm8,
                            enabled: false,
                        },
                    ],
                }),
            ]);
            let gridBannersMap: (GridBanner & { id_test: number })[] | null =
                null;

            if (body.gridBanners?.length) {
                const gridBannersMap2: (GridBanner & { id_test: number })[] =
                    [];
                for (const grid of body.gridBanners) {
                    const { id, ...rest } = grid;

                    // Esperar a que se cree el GridBanner antes de proceder al siguiente
                    const g = await GridBanner.create({
                        ...rest,
                        empresa_id: empresa!.id,
                    });

                    gridBannersMap2.push({
                        ...g.toJSON(),
                        id_test: id,
                    } as GridBanner & { id_test: number });
                }
                gridBannersMap = gridBannersMap2;
            } else {
                await GridBanner.bulkCreate(
                    Array.from({ length: 10 }).map(() => ({
                        html: null,
                        enabled: false,
                        empresa_id: empresa!.id,
                        title: null,
                    }))
                );
            }
            if (body.pages?.length) {
                for (const page of body.pages) {
                    const { grid_banner_pages, id, ...resto } = page;
                    const newpage = await Page.create({
                        ...resto,
                        empresa_id: empresa!.id,
                    });
                    for (const grid of page.grid_banner_pages) {
                        const { grid_banner_id, id, ...rest } = grid;

                        const findBannerTest = gridBannersMap?.find(
                            (grid) => grid.id_test === grid_banner_id
                        );
                        const gridBanner = findBannerTest
                            ? await GridBanner.findByPk(findBannerTest.id)
                            : null;

                        await GridBannerPage.create({
                            ...rest,
                            page_id: newpage.id,
                            empresa_id: empresa!.id,
                            grid_banner_id: gridBanner
                                ? findBannerTest?.id
                                : null,
                        });
                    }
                }
            } else {
                await Promise.all([
                    this.pagesApiService.store(empresa, {
                        title: "Home",
                        description: `En ${empresa.name_empresa}, ofrecemos una amplia variedad de productos de alta calidad a precios inmejorables, encontrarás todo lo que necesitas en un solo lugar. Disfruta de envíos rápidos, devoluciones fáciles y un servicio al cliente excepcional. ¡Explora nuestras ofertas diarias y descubre la diferencia de comprar en Tienda XYZ!`,
                        slug: "home",
                        empresa_id: empresa.id,
                        icon: "<i class='fas fa-home'></i>",
                        queries: [],
                        enabledHeaderPage: true,
                    }),
                    this.pagesApiService.store(empresa, {
                        title: "Nosotros",
                        description: `Bienvenidos a ${empresa.name_empresa}`,
                        slug: "nosotros",
                        empresa_id: empresa.id,
                        icon: "<i class='fas fa-users'></i>",
                        enabledHeaderPage: true,
                        queries: [],
                    }),
                    this.pagesApiService.store(empresa, {
                        title: "Shop",
                        description: `Bienvenidos a ${empresa.name_empresa}`,
                        slug: "shop",
                        empresa_id: empresa.id,
                        icon: "<i class='fas fa-store'></i>",
                        enabledHeaderPage: true,
                        queries: [],
                    }),
                    this.pagesApiService.store(empresa, {
                        title: "Servicios",
                        description: `En ${empresa.name_empresa}, ofrecemos una amplia variedad de productos de alta calidad a precios inmejorables, encontrarás todo lo que necesitas en un solo lugar. Disfruta de envíos rápidos, devoluciones fáciles y un servicio al cliente excepcional. ¡Explora nuestras ofertas diarias y descubre la diferencia de comprar en Tienda XYZ!`,
                        slug: "servicios",
                        empresa_id: empresa.id,
                        icon: "<i class='fas fa-building'></i>",
                        enabledHeaderPage: true,
                        queries: [],
                    }),
                    this.pagesApiService.store(empresa, {
                        title: "Contacto",
                        description: `En ${empresa.name_empresa}, ofrecemos una amplia variedad de productos de alta calidad a precios inmejorables, encontrarás todo lo que necesitas en un solo lugar. Disfruta de envíos rápidos, devoluciones fáciles y un servicio al cliente excepcional. ¡Explora nuestras ofertas diarias y descubre la diferencia de comprar en Tienda XYZ!`,
                        slug: "contacto",
                        empresa_id: empresa.id,
                        icon: "<i class='fas fa-envelope-open'></i>",
                        enabledHeaderPage: true,
                        queries: [],
                    }),
                ]);
            }

            if (body.isTemplate) {
                await Users.bulkCreate(
                    usersSeeder.map((user) => ({
                        ...user,
                        empresa_id: empresa!.id,
                    }))
                );
                await empresa.update({
                    telephoneFirst: "990317888",
                    telephoneReclamos: "99045238",
                    telephoneThird: "9903145843",
                    facebook: "https://www.facebook.com/",
                    tiktok: "https://www.tiktok.com/",
                    instagram: "https://www.instagram.com/",
                    twitter: "https://www.twitter.com/",
                    youtube: "https://www.youtube.com/",
                });
            }

            await Promise.all(
                body.files.map(async (f) => {
                    const { id, ...rest } = f;
                    const file = await Promise.all(
                        f.file.map(async (f) => {
                            const file = f.file.substring(
                                f.file.indexOf("/images")
                            );
                            const dirEmpresa = `${pathUploads()}/${
                                empresa!.slug
                            }`;
                            const dirEntity = `${dirEmpresa}${file}`;
                            await downloadAndSaveFile(f.file, dirEntity);

                            return {
                                ...f,
                                file,
                            };
                        })
                    );
                    await FileSchema.create({
                        ...rest,
                        empresa_id: empresa!.id,
                        file,
                    });
                })
            );
            let brands: (Brands & { id_test: number })[] = [];
            if (body.brands) {
                brands = (await Promise.all(
                    body.brands.map(async (brand) => {
                        const { id, empresa_id, ...rest } = brand;
                        const br = await Brands.create({
                            ...rest,
                            empresa_id: empresa!.id,
                        });
                        let image = null;
                        if (brand.image) {
                            image = await Promise.all(
                                brand.image.map(async (f) => {
                                    const file = f.file.substring(
                                        f.file.indexOf("/images")
                                    );
                                    const dirEmpresa = `${pathUploads()}/${
                                        empresa!.slug
                                    }`;
                                    const dirEntity = `${dirEmpresa}${file}`;
                                    await downloadAndSaveFile(
                                        f.file,
                                        dirEntity
                                    );

                                    return {
                                        ...f,
                                        file,
                                    };
                                })
                            );
                        }

                        return { ...br, id_test: brand.id, image };
                    })
                )) as (Brands & { id_test: number })[];
            }
            if (body.categories) {
                await Promise.all(
                    body.categories.map(async (category) => {
                        const {
                            id,
                            productsNormals,
                            productsRestaurants,
                            productsServicios,
                            subcategories,
                            empresa_id,
                            ...rest
                        } = category;
                        const categoria = await Categories.create({
                            ...rest,
                            empresa_id: empresa!.id,
                        });
                        const subcategorias = await Promise.all(
                            subcategories.map(async (sub) => {
                                const { empresa_id, id, ...rest } = sub;
                                let image = null;
                                if (sub.image) {
                                    image = await Promise.all(
                                        sub.image.map(async (f) => {
                                            const file = f.file.substring(
                                                f.file.indexOf("/images")
                                            );
                                            const dirEmpresa = `${pathUploads()}/${
                                                empresa!.slug
                                            }`;
                                            const dirEntity = `${dirEmpresa}${file}`;
                                            await downloadAndSaveFile(
                                                f.file,
                                                dirEntity
                                            );

                                            return {
                                                ...f,
                                                file,
                                            };
                                        })
                                    );
                                }

                                const subcategoria = await Subcategories.create(
                                    {
                                        ...rest,
                                        empresa_id: empresa!.id,
                                        category_id: categoria.id,
                                        image,
                                    }
                                );
                                return {
                                    ...subcategoria.toJSON(),
                                    id_test: id,
                                };
                            })
                        );

                        await Promise.all(
                            productsNormals.map(async (prod) => {
                                const subcategory_id = subcategorias.find(
                                    (sub) => sub.id_test === prod.subcategory_id
                                );
                                const brand_id = brands.find(
                                    (br) => br.id_test === prod.brand_id
                                );
                                const { images, ...rest } = prod;
                                let result = null;
                                if (images) {
                                    result = await Promise.all(
                                        images.map(async (f) => {
                                            const file = f.file.substring(
                                                f.file.indexOf("/images")
                                            );
                                            const dirEmpresa = `${pathUploads()}/${
                                                empresa!.slug
                                            }`;
                                            const dirEntity = `${dirEmpresa}${file}`;
                                            await downloadAndSaveFile(
                                                f.file,
                                                dirEntity
                                            );

                                            return {
                                                ...f,
                                                file,
                                            };
                                        })
                                    );
                                }
                                await this.productsApiService.store(
                                    {
                                        ...empresa!.toJSON(),
                                        tipo_empresa: {
                                            tipo_servicio_id: body.servicio_id,
                                        },
                                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                    } as any,
                                    {
                                        ...rest,
                                        category_id: categoria.id,
                                        empresa_id: empresa!.id,
                                        subcategory_id: subcategory_id
                                            ? subcategory_id.id
                                            : null,
                                        brand_id: brand_id ? brand_id.id : null,
                                        images: result,
                                    },
                                    true,
                                    false
                                );
                            })
                        );

                        await Promise.all(
                            productsRestaurants.map(async (prod) => {
                                const { id, ...rest } = prod;
                                let images = null;
                                if (prod.images) {
                                    images = await Promise.all(
                                        prod.images.map(async (f) => {
                                            const file = f.file.substring(
                                                f.file.indexOf("/images")
                                            );
                                            const dirEmpresa = `${pathUploads()}/${
                                                empresa!.slug
                                            }`;
                                            const dirEntity = `${dirEmpresa}${file}`;
                                            await downloadAndSaveFile(
                                                f.file,
                                                dirEntity
                                            );

                                            return {
                                                ...f,
                                                file,
                                            };
                                        })
                                    );
                                }
                                await ProductsRestaurant.create({
                                    ...rest,
                                    category_id: categoria.id,
                                    empresa_id: empresa!.id,
                                    images,
                                });
                            })
                        );
                        await Promise.all(
                            productsServicios.map(async (prod) => {
                                const { id, ...rest } = prod;
                                let images = null;
                                if (prod.images) {
                                    images = await Promise.all(
                                        prod.images.map(async (f) => {
                                            const file = f.file.substring(
                                                f.file.indexOf("/images")
                                            );
                                            const dirEmpresa = `${pathUploads()}/${
                                                empresa!.slug
                                            }`;
                                            const dirEntity = `${dirEmpresa}${file}`;
                                            await downloadAndSaveFile(
                                                f.file,
                                                dirEntity
                                            );

                                            return {
                                                ...f,
                                                file,
                                            };
                                        })
                                    );
                                }
                                await ProductsServicio.create({
                                    ...rest,
                                    category_id: categoria.id,
                                    empresa_id: empresa!.id,
                                    images,
                                });
                            })
                        );
                    })
                );
            }
            const username = `${fullname}${Math.random()
                .toString(32)
                .slice(3, 4)}`;
            const name = fullname.split(" ");
            await this.UsersApiService.store(empresa, {
                name: name[0],
                lastname: name[1] ?? "",
                email: null,
                password,
                telephone: empresa.telephoneFirst,
                username,
                enabled: true,
                address: null,
                birthday: new Date(),
                slug: slug(username),
                role_id: 1,
                empresa_id: empresa!.id,
                speciality: null,
                buys: [],
                identification_number: null,
                reference: null,
                city_id: null,
            });
            const openAiClient = new openai.OpenAI({
                apiKey: empresa.credentials.open_ai,
            });

            openAis = { ...openAis, [empresa.slug]: openAiClient };

            const regions = await Regions.findAll({
                include: [
                    {
                        model: Countries,
                        where: {
                            code: empresa.dial_code,
                        },
                        required: true,
                    },
                ],
            });
            await Promise.all(
                regions.map(async (region) => {
                    await RegionsEmpresa.create({
                        region_id: region.id,
                        empresa_id: empresa!.id,
                        days: 3,
                        enabled: true,
                        priceShipping: 0,
                    });
                })
            );
            await Promise.all(
                finanzasSeeder.map(async (tipo) => {
                    const tipoFinanza = await TipoFinanza.create({
                        name: tipo.name,
                        empresa_id: empresa!.id,
                    });
                    await Promise.all(
                        tipo.categories.map(async (cat) => {
                            await CategoriesFinanzas.create({
                                value: cat.value,
                                icon: cat.icon,
                                tipo_finanza_id: tipoFinanza.id,
                                empresa_id: empresa!.id,
                            });
                        })
                    );
                })
            );
            if (enviroments.NODE_ENV === "production" && body.isWhatsappFree) {
                // crear whatsapp contenedor
                await terminal(
                    `docker volume create ${
                        empresa.slug
                    } && docker run -d --name ${
                        empresa.slug
                    } -e PORT=5000 -e NODE_ENV=${
                        enviroments.NODE_ENV
                    } -e SESSION_NAME=${empresa.slug} -e NAME=${
                        name || "docker"
                    } -e VITE_TOKEN_VIGILIO_SERVICES=${
                        enviroments.VITE_TOKEN_VIGILIO_SERVICES
                    } --restart always --memory="2000m" --memory-swap="2000m" --cpus="2" -p ${
                        empresa.port
                    }:5000 -v ${empresa.slug}:/app/data ${
                        enviroments.DOCKER_IMAGE_WHATSAPP
                    }`,
                    true
                );
                const whatsapp_mode: WhatsappMode[] = [
                    {
                        cpu: null,
                        type: "FREE",
                        name: "docker",
                        date: null,
                        ip: null,
                        enabled: true,
                        memory: null,
                        password: null,
                    },
                ];
                await empresa.update({ whatsapp_mode });
                // // eliminar docker en 15 dias
                // const fechaUTC5 = new Date();
                // fechaUTC5.setDate(fechaUTC5.getDate() + 14);
                // await executeCronDate(fechaUTC5, async () => {
                //     if (!empresa.slug.includes("demo")) {
                //         await terminal(`docker stop ${empresa.slug} || true`);
                //         await terminal(`docker rm -f ${empresa.slug} || true`);
                //     }
                // });
            }
            cache.delete("CACHE_HOST");

            return {
                success: true,
                message: "Nuevo información agregado correctamente.",
            };
        } catch (error) {
            // biome-ignore lint/suspicious/noConsoleLog: <explanation> 2
            console.log((error as Error).message);
            if (empresa) {
                await GridBanner.destroy({ where: { empresa_id: empresa.id } });
                await GridBannerPage.destroy({
                    where: { empresa_id: empresa.id },
                });
                await empresa.destroy();
            }
            throw new InternalServerErrorException("Error al agregar empresa");
        }
    }
    async whatsapp_mode_store(empresa: Empresas, body: WhatsappMode) {
        let whatsapp_mode: WhatsappMode[] = empresa.whatsapp_mode;
        const whatsappMode = empresa.whatsapp_mode.find(
            (w) => w.ip === body.ip
        );
        if (!whatsappMode) {
            const nombres = [
                "sofia",
                "mateo",
                "isabella",
                "lucas",
                "camila",
                "benjamin",
                "valentina",
                "sebastian",
                "emilia",
                "gabriel",
                "victoria",
                "martin",
                "maria",
                "joaquin",
                "antonia",
                "nicolas",
                "renata",
                "diego",
                "lucia",
                "samuel",
            ];
            const name = nombres.filter(
                (a) => !empresa.whatsapp_mode!.map((na) => na.name).includes(a)
            )[0];
            const bo = { ...body, name };
            whatsapp_mode = [...whatsapp_mode, bo];

            if (body?.type === "VPS") {
                if (enviroments.NODE_ENV === "production") {
                    const response = await fetch(
                        `${enviroments.VITE_VIGILIO_WEB}/api/empresas/subdominio`,
                        {
                            method: "POST",
                            body: JSON.stringify({
                                sub_domain: `${empresa.slug}.${name}`,
                                port: 5000,
                                vps_ip: body.ip || "localhost",
                            }),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    const result = await response.json();
                }
                // instalar whatsapp en nginx
                const ssh = new NodeSSH();
                try {
                    // Intentar conectar por SSH
                    await ssh.connect({
                        host: body.ip!,
                        username: "root",
                        password: body.password!,
                    });
                    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                    console.log("Conectado correctamente a vps");
                    const commands = `
                        # Asegúrate de que dpkg no esté interrumpido
                        dpkg --configure -a || true;
            
                        # Configurar debconf para la instalación de GRUB
                        echo 'grub-pc grub-pc/bootdev select /dev/sda' | debconf-set-selections;
                        echo 'grub-pc grub-pc/install_devices multiselect /dev/sda' | debconf-set-selections;
            
                        # Actualizar el sistema
                        apt update -y;
                        apt upgrade -y;
            
                        # Instalar dependencias necesarias
                        resize2fs /dev/sda1 || true && 
                        apt-get install -y git nginx sudo nano curl;
                        apt install -y apt-transport-https ca-certificates software-properties-common;
            
                        # Agregar la clave GPG de Docker
                        curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -;
            
                        # Agregar el repositorio de Docker
                        echo "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list;
            
                        # Instalar Docker
                        apt update -y;
                        apt install -y docker-ce;
            
                        # Verificar si existe un contenedor y eliminarlo
                        if sudo docker ps -a -q --filter "name=${
                            empresa.slug
                        }"; then \
                            sudo docker stop ${empresa.slug} || true; \
                            sudo docker rm ${empresa.slug} || true; \
                            sudo docker volume rm ${empresa.slug} || true; \
                        fi; 
            
                        # Borrar imagen si existe
                        if sudo docker images -q "${
                            enviroments.DOCKER_IMAGE_WHATSAPP
                        }"; then \
                            sudo docker rmi "${
                                enviroments.DOCKER_IMAGE_WHATSAPP
                            }" || true; \
                        fi; 
            
                        # Crear un volumen para el contenedor
                        sudo docker volume create ${empresa.slug}; 
            
                        # Ejecutar el contenedor
                        sudo docker run -d --name ${empresa.slug} \
                            -e PORT=5000 \
                            -e NODE_ENV=production \
                            -e SESSION_NAME=${empresa.slug} \
                            -e NAME=${name || "docker"} \
                            -e VITE_TOKEN_VIGILIO_SERVICES=${
                                enviroments.VITE_TOKEN_VIGILIO_SERVICES
                            } \
                            --restart always \
                            --memory="${Number(body.memory!) - 0.2}g" \
                            --memory-swap="${Number(body.memory!) - 0.2}g" \
                            --cpus="${Number(body.cpu!) - 0.2}" \
                            -p 5000:5000 \
                            -v ${empresa.slug}:/app/data \
                            ${enviroments.DOCKER_IMAGE_WHATSAPP}
                    `;

                    // Ejecutar los comandos en el servidor remoto
                    const result = await ssh.execCommand(commands);
                    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                    console.log(`STDOUT: ${result.stdout}`);
                    console.error(`STDERR: ${result.stderr}`);
                } catch (error) {
                    console.error(
                        "Error al conectar o ejecutar los comandos:",
                        error
                    );
                    throw new BadRequestException(
                        `error ${(error as Error).message}`
                    );
                } finally {
                    ssh.dispose();
                }
            }

            await Empresas.update(
                { whatsapp_mode },
                {
                    where: {
                        slug: empresa.slug,
                    },
                }
            );
            await Empresas.update(
                {
                    timeWhatsapp: NOW(empresa).add(3, "minute").format(),
                },
                {
                    where: {
                        slug: empresa.slug,
                    },
                }
            );
            cache.delete(`EMPRESA:${empresa.slug}`);
            return {
                success: true,
                message: "Agregado correctamente",
            };
        }
        throw new BadRequestException(
            "Ya existe este whatsapp con el mismo ip"
        );
    }

    async whatsapp_mode_destroy(empresa: Empresas, name: string) {
        const whatsappMode = empresa.whatsapp_mode.find((w) => w.name === name);
        if (!whatsappMode) {
            throw new BadRequestException("No existe whatsapp");
        }
        const whatsapp_modeFilter = empresa.whatsapp_mode.filter(
            (w) => w.name !== name
        );
        await Empresas.update(
            { whatsapp_mode: whatsapp_modeFilter },
            {
                where: {
                    slug: empresa.slug,
                },
            }
        );
        cache.delete(`EMPRESA:${empresa.slug}`);
        return {
            success: true,
            message: "Eliminado correctamente",
        };
    }
    async whatsapp_mode(empresa: Empresas, ip: string, body: WhatsappMode) {
        let whatsapp_mode: WhatsappMode[] = empresa.whatsapp_mode;
        const whatsappMode = empresa.whatsapp_mode.find((w) => w.ip === ip);
        if (!whatsappMode) {
            throw new BadRequestException("No existe este whatsapp");
        }
        whatsapp_mode = whatsapp_mode.map((what) =>
            what.ip === ip ? { ...what, ...body } : what
        );
        const whatsappMode2 = whatsapp_mode.find((w) => w.ip === ip);

        if (
            whatsappMode2?.type === "FREE" &&
            whatsappMode.enabled === body.enabled
        ) {
            await terminal(
                `docker volume create ${empresa.slug} && docker run -d --name ${
                    empresa.slug
                } -e PORT=5000 -e NODE_ENV=${enviroments.NODE_ENV}
            
                -e SESSION_NAME=${
                    empresa.slug
                } -e VITE_TOKEN_VIGILIO_SERVICES=${
                    enviroments.VITE_TOKEN_VIGILIO_SERVICES
                } --restart always --memory="${"2000"}m" --memory-swap="${"2000"}m"   --cpus="${"2"}" -p ${
                    empresa.port
                }:5000 -v ${empresa.slug}:/app/data ${
                    enviroments.DOCKER_IMAGE_WHATSAPP
                }`
            );
        }
        if (
            whatsappMode2?.type === "VPS" &&
            whatsappMode.enabled === body.enabled
        ) {
            // instalar whatsapp en nginx
            const ssh = new NodeSSH();
            try {
                // Intentar conectar por SSH
                await ssh.connect({
                    host: body.ip!,
                    username: "root",
                    password: body.password!,
                });
                // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                console.log("Conectado correctamente a vps");
                const commands = `
                    # Asegúrate de que dpkg no esté interrumpido
                    dpkg --configure -a || true;
        
                    # Configurar debconf para la instalación de GRUB
                    echo 'grub-pc grub-pc/bootdev select /dev/sda' | debconf-set-selections;
                    echo 'grub-pc grub-pc/install_devices multiselect /dev/sda' | debconf-set-selections;
        
                    # Actualizar el sistema
                    apt update -y;
                    apt upgrade -y;
                    resize2fs /dev/sda1 || true &&
                    # Instalar dependencias necesarias
                    apt-get install -y git nginx sudo nano curl;
                    apt install -y apt-transport-https ca-certificates software-properties-common;
        
                    # Agregar la clave GPG de Docker
                    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -;
        
                    # Agregar el repositorio de Docker
                    echo "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list;
        
                    # Instalar Docker
                    apt update -y;
                    apt install -y docker-ce;
        
                    # Verificar si existe un contenedor y eliminarlo
                    if sudo docker ps -a -q --filter "name=${
                        empresa.slug
                    }"; then \
                        sudo docker stop ${empresa.slug} || true; \
                        sudo docker rm ${empresa.slug} || true; \
                        sudo docker volume rm ${empresa.slug} || true; \
                    fi; 
        
                    # Borrar imagen si existe
                    if sudo docker images -q "${
                        enviroments.DOCKER_IMAGE_WHATSAPP
                    }"; then \
                        sudo docker rmi "${
                            enviroments.DOCKER_IMAGE_WHATSAPP
                        }" || true; \
                    fi; 
        
                    # Crear un volumen para el contenedor
                    sudo docker volume create ${empresa.slug}; 
        
                    # Ejecutar el contenedor
                    sudo docker run -d --name ${empresa.slug} \
                        -e PORT=5000 \
                        -e NODE_ENV=production \
                        -e SESSION_NAME=${empresa.slug} \
                        -e NAME=${whatsappMode2.name} \
                        -e VITE_TOKEN_VIGILIO_SERVICES=${
                            enviroments.VITE_TOKEN_VIGILIO_SERVICES
                        } \
                        --restart always \
                        --memory="${Number(body.memory!) - 0.2}g" \
                        --memory-swap="${Number(body.memory!) - 0.2}g" \
                        --cpus="${Number(body.cpu!) - 0.2}" \
                        -p 5000:5000 \
                        -v ${empresa.slug}:/app/data \
                        ${enviroments.DOCKER_IMAGE_WHATSAPP}
                `;

                // Ejecutar los comandos en el servidor remoto
                const result = await ssh.execCommand(commands);
                // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                console.log(`STDOUT: ${result.stdout}`);
                console.error(`STDERR: ${result.stderr}`);
            } catch (error) {
                console.error(
                    "Error al conectar o ejecutar los comandos:",
                    error
                );
                throw new BadRequestException(
                    `error ${(error as Error).message}`
                );
            } finally {
                ssh.dispose();
            }
        }

        await Empresas.update(
            { whatsapp_mode },
            {
                where: {
                    slug: empresa.slug,
                },
            }
        );
        await Empresas.update(
            {
                timeWhatsapp: NOW(empresa).add(3, "minute").format(),
            },
            {
                where: {
                    slug: empresa.slug,
                },
            }
        );
        cache.delete(`EMPRESA:${empresa.slug}`);
        return {
            success: true,
            message: "whatsapp mode cambiado correctamente",
        };
    }
    async private(slug: string) {
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: {
                exclude: ["groupWhatsapp"],
            },
        });

        if (!empresa) {
            // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
            throw new NotFoundException(`No se encontró un informacion`);
        }
        cache.delete(`EMPRESA:${empresa.slug}`);
        return {
            success: true,
            empresa,
        };
    }
    async metodos_pago(slug: string) {
        const { empresa } = await this.show(slug);
        const metodo = await MetodosPago.findOne({
            where: {
                empresa_id: empresa!.id,
            },
        });

        if (!metodo)
            throw new BadRequestException("No se encontró metodo de pago");
        cache.delete(`EMPRESA:${empresa.slug}`);
        return {
            success: true,
            metodo,
        };
    }
    async metodospago(slug: string, body: MetodosPagoUpdateDto) {
        const { metodo } = await this.metodos_pago(slug);

        const data = Object.entries(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            body.transferencias as any
        ).map(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (body) => Object.values((body as any)[1]).filter((val) => val)
        );

        // aca si  esta vacio entonces que sea null
        body.transferencias =
            data[0].length || data[1].length || data[2].length
                ? body.transferencias
                : null;
        await metodo.update(body);
        return {
            success: true,
            message: "Editado correctamente",
        };
    }
    async update(emp: Empresas, empresasUpdateDto: EmpresasUpdateDto) {
        const { empresa } = await this.show(emp.slug);

        try {
            if (
                empresasUpdateDto.telegram_token &&
                empresasUpdateDto.telegram_token !== empresa.telegram_token &&
                empresa.payments.mensual.enabled &&
                restarDays(
                    empresa,
                    NOW(empresa).format(),
                    empresa.payments.mensual.date as Date
                ) > 0
            ) {
                await initializeBot(empresa, empresasUpdateDto.telegram_token);
            }
            console.log({ a: empresasUpdateDto.model_ai });

            cache.delete(`EMPRESA:${empresa.slug}`);
            if (empresasUpdateDto.model_ai === "open-ai") {
                const openAiClient = new openai.OpenAI({
                    apiKey: empresa.credentials.open_ai,
                });
                openAis = { ...openAis, [empresa.slug]: openAiClient };
            } else {
                const openAiClient = new openai.OpenAI({
                    apiKey: empresa.credentials.deekseek_ai,
                    baseURL: "https://api.deepseek.com",
                });
                openAis = { ...openAis, [empresa.slug]: openAiClient };
            }
            await empresa.update({
                ...empresasUpdateDto,
            });
            return {
                success: true,
                empresa,
            };
        } catch (error) {
            throw new InternalServerErrorException((error as Error).message);
        }
    }
    async whatsappConfigUpdate(slug: string, whatsappconfig: Whatsappconfig) {
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: ["id", "whatsappconfig", "slug"],
        });
        if (!empresa) throw new NotFoundException("Error empresas.");
        cache.delete(`EMPRESA:${empresa.slug}`);
        await empresa.update({ whatsappconfig });
        return {
            success: true,
            message: "Se actualizó correctamente los mensajes de whatsapp",
        };
    }
    async company(
        emp: Empresas,
        companyStoreDto: EmpresasFacturacionUpdateDto
    ) {
        const { empresa } = await this.show(emp.slug);
        // to reutilize if company no update certificado
        cache.delete(`EMPRESA:${empresa.slug}`);
        await empresa.update({
            company: companyStoreDto,
        });
        return {
            success: true,
            empresa,
        };
    }
    async inteligenceArtificial(
        slug: string,
        empresasIAUpdateDto: EmpresasIAUpdateDto
    ) {
        const empresa = await Empresas.unscoped().findOne({
            where: { slug },
            attributes: ["inteligenceArtificial", "id"],
        });
        if (!empresa) throw new BadRequestException("No informacion");
        // to reutilize if company no update certificado
        await empresa.update({
            inteligenceArtificial: empresasIAUpdateDto.inteligenceArtificial,
        });
        cache.delete(`EMPRESA:${empresa.slug}`);
        return {
            success: true,
            message:
                "Se modificó correctamente el prompt de tu inteligencia Artificial.",
        };
    }
    async all(slug: string) {
        const empresa = await Empresas.unscoped().findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!empresa) throw new NotFoundException("Error empresas.");

        return { success: true, data: empresa.contacts };
    }
    async favorites(slug: string) {
        const empresa = await Empresas.unscoped().findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!empresa) throw new NotFoundException("Error empresas.");
        // to reutilize if company no update certificado
        const favorites = empresa.contacts.filter(
            (empresa) => empresa.isFavorite
        );
        cache.delete(`EMPRESA:${empresa.slug}`);
        return { success: true, favorites };
    }

    async address(
        empresa: Empresas,
        id: string,
        body: EmpresasAddressUpdateDto
    ) {
        const address = await Address.findOne({
            where: { empresa_id: empresa!.id, id },
        });

        cache.delete(`EMPRESA:${empresa.slug}`);
        await address!.update(body);
        return {
            success: true,
            message: "Direccion Editado Correctamente",
        };
    }
    async addressStore(empresa: Empresas, body: EmpresasAddressUpdateDto) {
        const address = await Address.create({
            ...body,
            empresa_id: empresa.id,
        });
        cache.delete(`EMPRESA:${empresa.slug}`);
        return {
            success: true,
            message: "Creado correctamente dirección",
            address,
        };
    }

    async contacts(
        slug: string,
        telephone: string,
        body: { ia: boolean; isFavorite: boolean }
    ) {
        const empresa = await Empresas.unscoped().findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!empresa) throw new NotFoundException("Error empresas.");
        if (!empresa.contacts || !empresa.contacts.length)
            throw new BadRequestException("No hay contactos");

        const newChanges = empresa.contacts.map((contacto) => {
            if (contacto.telephone === telephone) {
                return { ...contacto, ...body };
            }
            return contacto;
        });
        cache.delete(`EMPRESA:${empresa.slug}`);
        await empresa.update({
            contacts: newChanges,
        });
        return {
            success: true,
            message: "Se realizo correctamente los cambios",
        };
    }
    async searchContact(slug: string, name: string) {
        const empresa = await Empresas.unscoped().findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!empresa) throw new NotFoundException("Error empresas.");
        const findByNameContacts = empresa.contacts
            .filter((contact) =>
                (contact.telephone ?? contact.name ?? "")
                    .toLowerCase()
                    .startsWith(name.toLowerCase())
            )
            .slice(0, 10);
        return {
            success: true,
            data: findByNameContacts,
        };
    }

    async contactStore(slug: string, contactsSchema: ContactsSchema) {
        const empresa = await Empresas.unscoped().findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp", "dial_code"],
        });
        if (!empresa) throw new NotFoundException("Error empresas.");
        const existNumero = empresa.contacts.find((cont) =>
            cont.telephone.includes(contactsSchema.telephone)
        );
        if (existNumero)
            throw new BadRequestException(
                "Este numero ya existe en tu contacto",
                {
                    body: "telephone",
                }
            );
        cache.delete(`EMPRESA:${empresa.slug}`);
        await empresa.update({
            contacts: [
                ...empresa.contacts,
                {
                    ...contactsSchema,
                    telephone: `${empresa.dial_code}${contactsSchema.telephone}@c.us`,
                },
            ],
        });
        return {
            success: true,
            message: "Se agregó nuevo contacto correctamente",
        };
    }
    async contactDestroy(slug: string, telephone: string) {
        const empresa = await Empresas.unscoped().findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!empresa) throw new NotFoundException("Error empresas.");
        const existNumero = empresa.contacts.find((cont) =>
            cont.telephone.includes(telephone)
        );
        if (!existNumero)
            throw new BadRequestException("Este numero no existe");
        const filtered = empresa.contacts.filter(
            (num) => num.telephone !== telephone
        );
        await empresa.update({
            contacts: filtered,
        });
        cache.delete(`EMPRESA:${empresa.slug}`);
        return {
            success: true,
            message: "Se agregó nuevo contacto correctamente",
        };
    }
    async scheduleUpdate(emp: Empresas, body: { schedule: ScheduleSchema[] }) {
        const { empresa } = await this.show(emp.slug);
        await empresa.update({ schedule: body.schedule });
        cache.delete(`EMPRESA:${empresa.slug}`);
        return {
            success: true,
            message: "Se edito horario de atención correctamente",
        };
    }

    async dominio(slug: string, body: { host: string | null }) {
        const { empresa } = await this.show(slug);
        const response = await fetch(
            `${enviroments.VITE_VIGILIO_WEB}/api/empresas/domain/${empresa.slug}`,
            {
                method: "POST",
                body: JSON.stringify({ dominio: body.host }),
                headers: {
                    "Content-Type": "application/json",
                    "access-token": enviroments.VITE_TOKEN_VIGILIO_SERVICES,
                },
            }
        );
        const result = await response.json();
        if (!result.success) {
            if (result.body) {
                throw new BadRequestException(result.message, { body: "host" });
            }
            throw new InternalServerErrorException(result.message);
        }
        const setting = await Settings.findOne({
            where: {
                empresa_id: empresa!.id,
            },
        });
        const time = NOW(empresa).add(4, "minute");
        cache.delete(`EMPRESA:${empresa.slug}`);
        await setting?.update({
            host: {
                host: body.host,
                nameserver_one: result.name_servers[0],
                nameserver_two: result.name_servers[1],
                time,
                enabled: false,
            },
        });
        cache.delete("CACHE_HOST");
        cache.delete("HOSTS");
        return {
            success: true,
            host: {
                host: body.host,
                nameserver_one: result.name_servers[0],
                nameserver_two: result.name_servers[1],
                time,
            },
        };
    }
    async name_servers(slug: string) {
        const { empresa } = await this.show(slug);
        await terminal(
            `rm -rf /etc/nginx/sites-available/${empresa.setting.host.host}  || true`,
            true
        );
        await terminal(
            `rm -rf /etc/nginx/sites-enabled/${empresa.setting.host.host} || true`,
            true
        );
        await terminal(
            `certbot delete --cert-name www.${empresa.setting.host.host} --non-interactive --quiet || true`,
            true
        );
        const setting = await Settings.findOne({
            where: {
                empresa_id: empresa!.id,
            },
        });
        await onNginx({
            port: Number(enviroments.PORT),
            sub_domain: "",
            domain: empresa.setting.host.host!,
        });
        await setting?.update({
            host: {
                ...setting.toJSON().host,
                enabled: true,
            },
        });
        cache.delete(`EMPRESA:${empresa.slug}`);
        cache.delete("CACHE_HOST");
        cache.delete("HOSTS");
        return {
            success: true,
            url: empresa.setting.host.host!,
        };
    }
    async deleteDominio(slug: string) {
        const { empresa } = await this.show(slug);
        await terminal(
            `rm -rf /etc/nginx/sites-available/${empresa.setting.host.host}  || true`,
            true
        );
        await terminal(
            `rm -rf /etc/nginx/sites-enabled/${empresa.setting.host.host} || true`,
            true
        );
        await terminal(
            `certbot delete --cert-name www.${empresa.setting.host.host} --non-interactive --quiet || true`,
            true
        );
        const setting = await Settings.findOne({
            where: {
                empresa_id: empresa!.id,
            },
        });
        const time = NOW(empresa).add(4, "minute");
        cache.delete(`EMPRESA:${empresa.slug}`);
        cache.delete("CACHE_HOST");
        await setting?.update({
            host: {
                host: null,
                nameserver_one: null,
                nameserver_two: null,
                enabled: false,
                time,
            },
        });
        const response = await fetch(
            `${enviroments.VITE_VIGILIO_WEB}/api/empresas/domain/${slug}`,
            {
                method: "DELETE",
                headers: {
                    "access-token": enviroments.VITE_TOKEN_VIGILIO_SERVICES,
                },
            }
        );
        const result = await response.json();
        if (!response.ok)
            throw new InternalServerErrorException(result.message);

        return {
            success: true,
            message: "Eliminado correctamente.",
        };
    }
    async whatsappGroupIndex(slug: string) {
        const empresa = await Empresas.unscoped().findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id"],
        });
        if (!empresa) return;
        return { success: true, data: empresa.groupWhatsapp };
    }
    async whatsappGroupShow(slug: string, name: string) {
        const empresa = await Empresas.unscoped().findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id"],
        });
        if (!empresa) throw new BadRequestException("No informacion");
        const group = empresa.groupWhatsapp.find(
            (group) => group.name === name
        );
        if (!group) throw new BadRequestException("No se encontró ese grupo");
        const getEmpresas = empresa.contacts
            .map((contact) =>
                group.members.includes(contact.telephone) ? contact : null
            )
            .filter((contact) => contact);

        return { success: true, group: { ...group, members: getEmpresas } };
    }
    async whatsappGroupStore(slug: string, body: GroupWhatsapp) {
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id", "slug"],
        });
        if (!empresa) throw new BadRequestException("No informacion");
        const findGroup = empresa.groupWhatsapp?.find(
            (group) => group.name === body.name
        );
        if (findGroup)
            throw new BadRequestException(
                `Ya existe grupo con el nombre ${body.name}`,
                { body: "name" }
            );
        const groupWhatsapp = [...(empresa.groupWhatsapp || []), body];
        cache.delete(`EMPRESA:${empresa.slug}`);
        await empresa.update({ groupWhatsapp });
        return {
            success: true,
            message: "Se agregó nuevo grupo whatsapp",
        };
    }
    async changeMode(slug: string) {
        const empresa = await Empresas.unscoped().findOne({
            where: { slug },
            attributes: ["isProduction", "slug", "id"],
        });
        if (!empresa) throw new BadRequestException("No informacion");
        await empresa.update({ isProduction: !empresa.isProduction });
        cache.delete(`EMPRESA:${empresa.slug}`);
        return {
            success: true,
            message: `Se cambió a modo ${
                empresa.isProduction ? "Modo producción" : "Modo desarrollo"
            }`,
        };
    }

    async whatsappGroupUpdate(slug: string, body: GroupWhatsapp) {
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id", "slug"],
        });
        if (!empresa) throw new BadRequestException("No informacion");
        const findGroup = empresa.groupWhatsapp?.find(
            (group) => group.name === body.name
        );
        if (!findGroup)
            throw new BadRequestException(`No existe este grupo ${body.name}`);
        const groupWhatsapp = empresa.groupWhatsapp.map((group) =>
            group.name === body.name
                ? { name: body.name, members: body.members }
                : group
        );
        cache.delete(`EMPRESA:${empresa.slug}`);
        await empresa.update({ groupWhatsapp });
        return {
            success: true,
            message: "Se edito los miembros de whatsapp whatsapp",
        };
    }

    async deleteContact(empresas: Empresas) {
        const empresa = await Empresas.unscoped().findOne({
            where: { slug: empresas.slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!empresa) throw new NotFoundException("Error empresas.");
        cache.delete(`EMPRESA:${empresa.slug}`);
        await empresa.update({ contacts: [], groupWhatsapp: [] });
        return {
            success: true,
            message: "Formateado Correctamente",
        };
    }
    async whatsappGroupDestroy(slug: string, group: string) {
        const empresa = await Empresas.unscoped().findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!empresa) throw new NotFoundException("Error empresas.");
        const groupWhatsapp = empresa!.groupWhatsapp.filter(
            (gro) => gro.name !== group
        );
        cache.delete(`EMPRESA:${empresa.slug}`);
        await empresa.update({ groupWhatsapp });
        return {
            success: true,
            message: "Se eliminó grupo de whatsapp correctamente",
        };
    }
    async whatsappGroupTelephoneDestroy(
        slug: string,
        name: string,
        telephone: string
    ) {
        const empresa = await Empresas.unscoped().findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id", "slug"],
        });
        if (!empresa) throw new BadRequestException("No informacion");
        const group = empresa.groupWhatsapp.find(
            (group) => group.name === name
        );
        if (!group) throw new BadRequestException("No se encontró ese grupo");

        const filterGroup = group.members.filter(
            (member) => member !== telephone
        );
        const groupWhatsapp = empresa.groupWhatsapp.map((group) => {
            if (group.name === name) {
                return { ...group, members: filterGroup };
            }
            return group;
        });
        cache.delete(`EMPRESA:${empresa.slug}`);
        await empresa!.update({ groupWhatsapp });
        return {
            success: true,
            message: `Se eliminó telephone del grupo ${name}  correctamente`,
        };
    }

    async destroy(id: string) {
        try {
            const { empresa } = await this.show(id);

            const dir = `${pathUploads()}/${empresa.slug}`;
            if (fs.existsSync(dir)) {
                fs.rmdirSync(dir, { recursive: true });
            }
            cache.delete(`EMPRESA:${empresa.slug}`);
            await empresa.destroy({ force: true });
            await terminal(`docker container stop ${empresa.slug} || true`);
            await terminal(`docker container rm -f ${empresa.slug} || true`);
            await terminal(`docker volume  rm  ${empresa.slug} || true`);
            if (openAis[empresa.slug]) {
                delete openAis[empresa.slug];
            }
            return { success: true, message: "Eliminado correctamente" };
        } catch (error) {
            throw new InternalServerErrorException("Error al eliminar");
        }
    }
}
