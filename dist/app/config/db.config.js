"use strict";
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
exports.sequelize = void 0;
exports.connectDB = connectDB;
const sequelize_typescript_1 = require("sequelize-typescript");
const enviroments_config_1 = __importDefault(require("./enviroments.config"));
const helpers_1 = require("@vigilio/express-core/helpers");
const products_servicio_entity_1 = require("@/products/entities/products_servicio.entity");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
const products_restaurant_entity_1 = require("@/products/entities/products_restaurant.entity");
const users_entity_1 = require("@/users/entities/users.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const cart_entity_1 = require("@/cart/entites/cart.entity");
const address_entity_1 = require("@/empresas/entities/address.entity");
const orders_entity_1 = require("@/orders/entities/orders.entity");
const detail_orders_entity_1 = require("@/orders/entities/detail_orders.entity");
const guides_entity_1 = require("@/orders/entities/guides.entity");
const invoices_entity_1 = require("@/orders/entities/invoices.entity");
const kind_credit_notes_entity_1 = require("@/orders/entities/kind_credit_notes.entity");
const kind_debit_notes_entity_1 = require("@/orders/entities/kind_debit_notes.entity");
const kind_invoice_entity_1 = require("@/orders/entities/kind_invoice.entity");
const notes_entity_1 = require("@/orders/entities/notes.entity");
const pay_methods_entity_1 = require("@/orders/entities/pay_methods.entity");
const status_orders_entity_1 = require("@/orders/entities/status_orders.entity");
const brands_entitiy_1 = require("@/products/entities/brands.entitiy");
const categories_entity_1 = require("@/products/entities/categories.entity");
const coupons_entity_1 = require("@/products/entities/coupons.entity");
const notifications_entity_1 = require("@/notificactions/entities/notifications.entity");
const notifications_user_entity_1 = require("@/notificactions/entities/notifications_user.entity");
const documents_entity_1 = require("@/orders/entities/documents.entity");
const products_options_entity_1 = require("@/products/entities/options/products_options.entity");
const options_entity_1 = require("@/products/entities/options/options.entity");
const features_entity_1 = require("@/products/entities/options/features.entity");
const variants_entity_1 = require("@/products/entities/options/variants.entity");
const variants_features_entity_1 = require("@/products/entities/options/variants_features.entity");
const tipo_empresa_entity_1 = require("@/empresas/entities/tipo_empresa.entity");
const tipo_servicio_entity_1 = require("@/empresas/entities/tipo_servicio.entity");
const new_entity_1 = require("@/empresas/entities/new.entity");
const metodosPago_entity_1 = require("@/empresas/entities/metodosPago.entity");
const urls_entity_1 = require("@/urls/entities/urls.entity");
const background_entity_1 = require("@/empresas/entities/background.entity");
const posts_entity_1 = require("@/posts/entities/posts.entity");
const suppliers_entity_1 = require("@/suppliers/entities/suppliers.entity");
const regions_entity_1 = require("@/ubigeo/entities/regions.entity");
const cities_entity_1 = require("@/ubigeo/entities/cities.entity");
const countries_entity_1 = require("@/ubigeo/entities/countries.entity");
const regions_empresa_entity_1 = require("@/ubigeo/entities/regions_empresa.entity");
const mesas_entity_1 = require("@/orders/entities/mesas.entity");
const floors_entity_1 = require("@/orders/entities/floors.entity");
const complaints_entity_1 = require("@/empresas/entities/complaints.entity");
const settings_entity_1 = require("@/empresas/entities/settings.entity");
const information_entity_1 = require("@/empresas/entities/information.entity");
const urls_payment_entity_1 = require("@/urls/entities/urls.payment.entity");
const tipo_entity_1 = require("@/finanzas/entities/tipo.entity");
const categories_entity_2 = require("@/finanzas/entities/categories.entity");
const finanzas_entity_1 = require("@/finanzas/entities/finanzas.entity");
const citas_entities_1 = require("@/citas/entities/citas.entities");
const citas_settings_entity_1 = require("@/citas/entities/citas_settings.entity");
const favorites_entity_1 = require("@/favorites/entities/favorites.entity");
const ratings_entity_1 = require("@/polymorphism/entities/ratings.entity");
const comments_entity_1 = require("@/polymorphism/entities/comments.entity");
const reactions_entity_1 = require("@/polymorphism/entities/reactions.entity");
const subcomments_entity_1 = require("@/polymorphism/entities/subcomments.entity");
const subcategories_entity_1 = require("@/products/entities/subcategories.entity");
const grid_banner_entity_1 = require("@/empresas/entities/grid_banner.entity");
const file_entity_1 = require("@/empresas/entities/file.entity");
const redes_chat_entity_1 = require("@/empresas/entities/redes_chat.entity");
const questions_entity_1 = require("@/empresas/entities/questions.entity");
const page_entity_1 = require("@/empresas/entities/page.entity");
const grid_banner_page_entity_1 = require("@/empresas/entities/grid_banner_page.entity");
const emails_entity_1 = require("@/emails/entities/emails.entity");
const emails_offers_entity_1 = require("@/emails/entities/emails_offers.entity");
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: "postgres",
    host: enviroments_config_1.default.DB_HOST,
    username: enviroments_config_1.default.DB_USER,
    password: enviroments_config_1.default.DB_PASS,
    database: enviroments_config_1.default.DB_NAME,
    port: enviroments_config_1.default.DB_PORT,
    pool: {
        max: 30,
        min: 10,
        acquire: 60000,
        idle: 20000,
    },
    timezone: "+00:00",
});
exports.sequelize = sequelize;
sequelize.addModels([
    products_servicio_entity_1.ProductsServicio,
    products_normal_entity_1.ProductsNormal,
    products_restaurant_entity_1.ProductsRestaurant,
    empresas_entity_1.Empresas,
    users_entity_1.Users,
    cart_entity_1.Cart,
    address_entity_1.Address,
    orders_entity_1.Orders,
    detail_orders_entity_1.DetailOrders,
    guides_entity_1.Guides,
    invoices_entity_1.Invoices,
    kind_credit_notes_entity_1.KindCreditNotes,
    kind_debit_notes_entity_1.KindDebitNotes,
    kind_invoice_entity_1.KindInvoice,
    notes_entity_1.Notes,
    pay_methods_entity_1.PayMethods,
    status_orders_entity_1.StatusOrders,
    brands_entitiy_1.Brands,
    categories_entity_1.Categories,
    coupons_entity_1.Coupons,
    notifications_entity_1.Notifications,
    notifications_user_entity_1.NotificationsUser,
    documents_entity_1.Documents,
    products_options_entity_1.ProductsOptions,
    options_entity_1.Options,
    features_entity_1.Features,
    variants_entity_1.Variants,
    variants_features_entity_1.VariantsFeatures,
    tipo_empresa_entity_1.TipoEmpresa,
    tipo_servicio_entity_1.TipoServicio,
    new_entity_1.New,
    metodosPago_entity_1.MetodosPago,
    urls_entity_1.Urls,
    background_entity_1.Background,
    posts_entity_1.Posts,
    suppliers_entity_1.Suppliers,
    regions_entity_1.Regions,
    cities_entity_1.Cities,
    countries_entity_1.Countries,
    regions_empresa_entity_1.RegionsEmpresa,
    mesas_entity_1.Mesas,
    complaints_entity_1.Complaints,
    floors_entity_1.Floors,
    settings_entity_1.Settings,
    information_entity_1.Information,
    urls_payment_entity_1.UrlsPayment,
    tipo_entity_1.TipoFinanza,
    categories_entity_2.CategoriesFinanzas,
    finanzas_entity_1.Finanzas,
    citas_entities_1.Citas,
    citas_settings_entity_1.CitasSettings,
    favorites_entity_1.Favorites,
    ratings_entity_1.Ratings,
    comments_entity_1.Comments,
    reactions_entity_1.Reactions,
    subcomments_entity_1.Subcomments,
    subcategories_entity_1.Subcategories,
    grid_banner_entity_1.GridBanner,
    file_entity_1.FileSchema,
    redes_chat_entity_1.RedesChat,
    questions_entity_1.Questions,
    page_entity_1.Page,
    grid_banner_page_entity_1.GridBannerPage,
    emails_entity_1.Emails,
    emails_offers_entity_1.EmailsPromociones,
]);
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield sequelize.authenticate();
            helpers_1.logger.success("conectado a base de datos correctamente");
            if (enviroments_config_1.default.NODE_ENV === "production") {
                yield sequelize.sync({ alter: true });
                return;
            }
            yield sequelize.sync({ alter: true });
        }
        catch (error) {
            helpers_1.logger.error(`Error al conectar base de datos: ${error}`);
        }
    });
}
