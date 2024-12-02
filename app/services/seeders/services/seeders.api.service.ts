import { PayMethods } from "@/orders/entities/pay_methods.entity";
import { StatusOrders } from "@/orders/entities/status_orders.entity";
import { payMethodsSeeder } from "@/orders/seeders/pay_methods.seeder";
import { statusOrdersSeeder } from "@/orders/seeders/status_orders.seeder";
import { Injectable } from "@vigilio/express-core";
import { sequelize } from "~/config/db.config";
import { KindInvoice } from "@/orders/entities/kind_invoice.entity";
import { kindInvoiceSeeder } from "@/orders/seeders/kind_invoice.seeder";
import { documentsSeeder } from "@/orders/seeders/documents.seeder";
import { Documents } from "@/orders/entities/documents.entity";
import { KindCreditNotes } from "@/orders/entities/kind_credit_notes.entity";
import { KindDebitNotes } from "@/orders/entities/kind_debit_notes.entity";
import { kindCreditNotesSeeder } from "@/orders/seeders/kind_credit_notes.seeder";
import { kindDebitNotesSeeder } from "@/orders/seeders/kind_debit_notes.seeder";
import { Options } from "@/products/entities/options/options.entity";
import { optionsSeeder } from "@/products/seeders/options.seeder";
import enviroments from "~/config/enviroments.config";
import { TipoServicio } from "@/empresas/entities/tipo_servicio.entity";
import { servicios } from "@/empresas/seeders/tipo_empresa.seeder";
import { ubigeoSeeder } from "@/ubigeo/seeders/countries.seeder";
import { Information } from "@/empresas/entities/information.entity";
import { empresasSeeder2 } from "@/empresas/seeders/empresas.seeder";
import { EmpresasApiService } from "@/empresas/services/empresas.api.service";
import { Address } from "@/empresas/entities/address.entity";
import { addressSeeder } from "@/empresas/seeders/address.seeder";
import { Users } from "@/users/entities/users.entity";
import { usersSeeder } from "@/users/seeders/users.seeder";

@Injectable()
export class SeedersApiService {
    constructor(private readonly empresasApiService: EmpresasApiService) {}
    async index() {
        try {
            if (enviroments.NODE_ENV !== "production") {
                await sequelize.sync({ force: true });
            }

            await Promise.all([
                Information.create({ token: enviroments.VITE_VIGILIO_TOKEN }),
                StatusOrders.bulkCreate(statusOrdersSeeder),
                PayMethods.bulkCreate(payMethodsSeeder),
                Documents.bulkCreate(documentsSeeder),
                KindCreditNotes.bulkCreate(kindCreditNotesSeeder),
                KindDebitNotes.bulkCreate(kindDebitNotesSeeder),
            ]);
            await Promise.all([KindInvoice.bulkCreate(kindInvoiceSeeder)]);
            await Promise.all(
                servicios.map(async (servicio) => {
                    const { tipo, empresas, id } = servicio;
                    const service = await TipoServicio.create({ id, tipo });
                    await Promise.all(
                        empresas.map(async (empresa) => {
                            await service.$create("tipo_empresa", empresa);
                        })
                    );
                })
            );
            await ubigeoSeeder();

            if (enviroments.NODE_ENV === "development") {
                const empresa = await empresasSeeder2();
                await this.empresasApiService.store({
                    ...empresa,
                    fullname: "Yonatan Vigilio",
                    password: "123456a",
                    servicio_id: 1,
                    setting: {
                        host: {
                            host: null,
                            nameserver_one: null,
                            nameserver_two: null,
                            time: null,
                            enabled: false,
                        },
                        bg_color: "rgb(28,141,227)",
                        bg_color_responsive: "#FFFFFF",
                        type_border: "circle",
                        type_cart: "fas fa-shopping-cart",
                        isCoverImage: true,
                        isDark: false,
                        isScrolling: true,
                        hamburger: "fas fa-bars",
                        isLogoImage: false,
                        position_header: true,
                        logo_width: 80,
                        border_title_type: "normal",
                        type_icons: "normal",
                        bg_color_background: "#FFFFFF",
                        bg_color_footer: "#FFFFFF",
                        bg_color_paper: "#F2F2F2",
                        bg_color_button: "rgb(28,141,227)",
                        font_face: "Exo",
                        background_position: "center",
                        background_type: "first",
                        shows: {
                            about: true,
                            brands: true,
                            cards: true,
                            map: true,
                            android: true,
                            offers_section: true,
                            offers_user: true,
                        },
                        type_map: "satelite",
                        header_type: "normal",
                        type_star: "star",
                        is_block_aside: false,
                        type_card: "normal",
                        is_subcategory: false,
                        header_position: { logo: 1, icons: 3, navbar: 2 },
                        header: {
                            about: true,
                            condiciones: true,
                            home: true,
                            pedidos: true,
                            profile: true,
                            shop: true,
                            categories: true,
                            services: true,
                            subcategories: true,
                        },
                        background_auth: null,
                        bg_color_secondary: "#dc2626",
                        type_animation: "fade-up",
                        web_script: null,
                        is_hover_product: true,
                        type_product_buttons: "first",
                        type_icons_bars: "normal",
                        is_hidde_total_cart: false,
                        type_arrow: "first",
                        isProductWallpaper: false,
                        is_service_page: true,
                    },
                    gridBanners: null,
                    files: [],
                    gridBannerServices: null,
                });
                await Promise.all([Address.bulkCreate(addressSeeder)]);
                await Promise.all([Users.bulkCreate(usersSeeder)]);
            }

            // if (enviroments.NODE_ENV === "production") {

            // await Promise.all([Suppliers.bulkCreate(suppliersSeeder)]);
            await Promise.all(
                optionsSeeder.map(async (prod) => {
                    const { features, ...rest } = prod;
                    const option = await Options.create(rest);
                    await Promise.all(
                        features.map(async (feature) => {
                            await option.$create("feature", {
                                id: feature.id,
                                value: feature.value,
                                description: feature.description,
                            });
                        })
                    );
                })
            );

            // await Promise.all([Posts.bulkCreate(postsSeeder)]);
            return { success: true, message: "Seed executed" };
        } catch (error) {
            return {
                success: false,
                message: JSON.stringify((error as unknown as Error).message),
            };
        }
    }
}
