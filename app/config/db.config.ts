import { Sequelize } from "sequelize-typescript";
import enviroments from "./enviroments.config";
import { logger } from "@vigilio/express-core/helpers";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { Users } from "@/users/entities/users.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { Cart } from "@/cart/entites/cart.entity";
import { Address } from "@/empresas/entities/address.entity";
import { Orders } from "@/orders/entities/orders.entity";
import { DetailOrders } from "@/orders/entities/detail_orders.entity";
import { Guides } from "@/orders/entities/guides.entity";
import { Invoices } from "@/orders/entities/invoices.entity";
import { KindCreditNotes } from "@/orders/entities/kind_credit_notes.entity";
import { KindDebitNotes } from "@/orders/entities/kind_debit_notes.entity";
import { KindInvoice } from "@/orders/entities/kind_invoice.entity";
import { Notes } from "@/orders/entities/notes.entity";
import { PayMethods } from "@/orders/entities/pay_methods.entity";
import { StatusOrders } from "@/orders/entities/status_orders.entity";
import { Brands } from "@/products/entities/brands.entitiy";
import { Categories } from "@/products/entities/categories.entity";
import { Coupons } from "@/products/entities/coupons.entity";
import { Notifications } from "@/notificactions/entities/notifications.entity";
import { NotificationsUser } from "@/notificactions/entities/notifications_user.entity";
import { Documents } from "@/orders/entities/documents.entity";
import { ProductsOptions } from "@/products/entities/options/products_options.entity";
import { Options } from "@/products/entities/options/options.entity";
import { Features } from "@/products/entities/options/features.entity";
import { Variants } from "@/products/entities/options/variants.entity";
import { VariantsFeatures } from "@/products/entities/options/variants_features.entity";
import { TipoEmpresa } from "@/empresas/entities/tipo_empresa.entity";
import { TipoServicio } from "@/empresas/entities/tipo_servicio.entity";
import { New } from "@/empresas/entities/new.entity";
import { MetodosPago } from "@/empresas/entities/metodosPago.entity";
import { Urls } from "@/urls/entities/urls.entity";
import { Background } from "@/empresas/entities/background.entity";
import { Posts } from "@/posts/entities/posts.entity";
import { Suppliers } from "@/suppliers/entities/suppliers.entity";
import { Regions } from "@/ubigeo/entities/regions.entity";
import { Cities } from "@/ubigeo/entities/cities.entity";
import { Countries } from "@/ubigeo/entities/countries.entity";
import { RegionsEmpresa } from "@/ubigeo/entities/regions_empresa.entity";
import { Mesas } from "@/orders/entities/mesas.entity";
import { Floors } from "@/orders/entities/floors.entity";
import { Complaints } from "@/empresas/entities/complaints.entity";
import { Settings } from "@/empresas/entities/settings.entity";
import { Information } from "@/empresas/entities/information.entity";
import { UrlsPayment } from "@/urls/entities/urls.payment.entity";
import { TipoFinanza } from "@/finanzas/entities/tipo.entity";
import { CategoriesFinanzas } from "@/finanzas/entities/categories.entity";
import { Finanzas } from "@/finanzas/entities/finanzas.entity";
import { Citas } from "@/citas/entities/citas.entities";
import { CitasSettings } from "@/citas/entities/citas_settings.entity";
import { Favorites } from "@/favorites/entities/favorites.entity";
import { Ratings } from "@/polymorphism/entities/ratings.entity";
import { Comments } from "@/polymorphism/entities/comments.entity";
import { Reactions } from "@/polymorphism/entities/reactions.entity";
import { Subcomments } from "@/polymorphism/entities/subcomments.entity";
import { Subcategories } from "@/products/entities/subcategories.entity";
import { Banner } from "@/empresas/entities/banner.entity";
import { GridBanner } from "@/empresas/entities/grid_banner.entity";

const sequelize = new Sequelize({
    dialect: "postgres",
    host: enviroments.DB_HOST,
    username: enviroments.DB_USER,
    password: enviroments.DB_PASS,
    database: enviroments.DB_NAME,
    port: enviroments.DB_PORT,
    pool: {
        max: 30,
        min: 10,
        acquire: 60000,
        idle: 20000,
    },
    timezone: "+00:00",
});

sequelize.addModels([
    // here entities
    ProductsServicio,
    ProductsNormal,
    ProductsRestaurant,
    Empresas,
    Users,
    Cart,
    Address,
    Orders,
    DetailOrders,
    Guides,
    Invoices,
    KindCreditNotes,
    KindDebitNotes,
    KindInvoice,
    Notes,
    PayMethods,
    StatusOrders,
    Brands,
    Categories,
    Coupons,
    Notifications,
    NotificationsUser,
    Documents,
    ProductsOptions,
    Options,
    Features,
    Variants,
    VariantsFeatures,
    TipoEmpresa,
    TipoServicio,
    New,
    MetodosPago,
    Urls,
    Background,
    Posts,
    Suppliers,
    Regions,
    Cities,
    Countries,
    RegionsEmpresa,
    Mesas,
    Complaints,
    Floors,
    Settings,
    Information,
    UrlsPayment,
    TipoFinanza,
    CategoriesFinanzas,
    Finanzas,
    Citas,
    CitasSettings,
    Favorites,
    Ratings,
    Comments,
    Reactions,
    Subcomments,
    Subcategories,
    GridBanner,
    Banner,
]);

export async function connectDB() {
    try {
        await sequelize.authenticate();
        logger.success("conectado a base de datos correctamente");
        if (enviroments.NODE_ENV === "production") {
            await sequelize.sync({ alter: true });
            return;
        }
        await sequelize.sync();
    } catch (error) {
        logger.error(`Error al conectar base de datos: ${error}`);
    }
}
export { sequelize };
