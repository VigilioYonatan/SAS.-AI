"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouters = void 0;
const empresas_api_controller_1 = require("../services/empresas/controllers/empresas.api.controller");
const users_api_controller_1 = require("@/users/controllers/users.api.controller");
const products_api_controller_1 = require("@/products/controllers/products.api.controller");
const categories_api_controller_1 = require("@/products/controllers/categories.api.controller");
const coupons_api_controller_1 = require("@/products/controllers/coupons.api.controller");
const orders_api_controller_1 = require("@/orders/controllers/orders.api.controller");
const cart_api_controller_1 = require("@/cart/controllers/cart.api.controller");
const auth_api_controller_1 = require("@/auth/controllers/auth.api.controller");
const backup_api_controller_1 = require("@/empresas/controllers/backup.api.controller");
const notifications_api_controller_1 = require("@/notificactions/controllers/notifications.api.controller");
const detail_orders_api_controller_1 = require("@/orders/controllers/detail_orders.api.controller");
const documents_api_controller_1 = require("@/orders/controllers/documents.api.controller");
const guides_api_controller_1 = require("@/orders/controllers/guides.api.controller");
const Invoices_api_controller_1 = require("@/orders/controllers/Invoices.api.controller");
const kind_debit_notes_api_controller_1 = require("@/orders/controllers/kind_debit_notes.api.controller");
const notes_api_controller_1 = require("@/orders/controllers/notes.api.controller");
const pay_methods_api_controller_1 = require("@/orders/controllers/pay_methods.api.controller");
const status_orders_api_controller_1 = require("@/orders/controllers/status_orders.api.controller");
const kind_credit_notes_api_controller_1 = require("@/orders/controllers/kind_credit_notes.api.controller");
const ubigeo_api_controller_1 = require("@/ubigeo/controllers/ubigeo.api.controller");
const brands_api_controller_1 = require("@/products/controllers/brands.api.controller");
const seeders_api_controller_1 = require("@/seeders/controllers/seeders.api.controller");
const paginator_api_controller_1 = require("@/common/paginator/controllers/paginator.api.controller");
const servicio_api_controller_1 = require("@/empresas/controllers/servicio.api.controller");
const admin_api_controller_1 = require("@/admin/controllers/admin.api.controller");
const suppliers_api_controller_1 = require("@/suppliers/controllers/suppliers.api.controller");
const posts_api_controller_1 = require("@/posts/controllers/posts.api.controller");
const uploads_controller_1 = require("@/uploads/controllers/uploads.controller");
const options_api_controller_1 = require("@/products/controllers/options/options.api.controller");
const mesas_api_controller_1 = require("@/orders/controllers/mesas.api.controller");
const complaints_api_controller_1 = require("@/empresas/controllers/complaints.api.controller");
const urls_controller_1 = require("@/urls/controllers/urls.controller");
const new_api_controller_1 = require("@/empresas/controllers/new.api.controller");
const background_api_controller_1 = require("@/empresas/controllers/background.api.controller");
const settings_api_controller_1 = require("@/empresas/controllers/settings.api.controller");
const kind_invoice_api_controller_1 = require("@/orders/controllers/kind_invoice.api.controller");
const floors_api_controller_1 = require("@/orders/controllers/floors.api.controller");
const ia_api_controller_1 = require("@/bot/controllers/ia.api.controller");
const whatsapp_api_controller_1 = require("@/bot/controllers/whatsapp.api.controller");
const web_api_controller_1 = require("@/web/controllers/web.api.controller");
const telegram_api_controller_1 = require("@/bot/controllers/telegram.api.controller");
const categories_api_controller_2 = require("@/finanzas/controllers/categories.api.controller");
const finanzas_api_controller_1 = require("@/finanzas/controllers/finanzas.api.controller");
const izipay_api_controller_1 = require("@/payments/controllers/izipay.api.controller");
const citas_api_controller_1 = require("@/citas/controllers/citas.api.controller");
const comments_api_controller_1 = require("@/polymorphism/controllers/comments.api.controller");
const ratings_api_controller_1 = require("@/polymorphism/controllers/ratings.api.controller");
const reactions_api_controller_1 = require("@/polymorphism/controllers/reactions.api.controller");
const subcomments_api_controller_1 = require("@/polymorphism/controllers/subcomments.api.controller");
const favorites_api_controller_1 = require("@/favorites/controllers/favorites.api.controller");
const subcategories_api_controller_1 = require("@/products/controllers/subcategories.api.controller");
const grid_banner_api_controller_1 = require("@/empresas/controllers/grid_banner.api.controller");
const files_api_controller_1 = require("@/empresas/controllers/files.api.controller");
const questions_api_controller_1 = require("@/empresas/controllers/questions.api.controller");
const pages_api_controller_1 = require("@/empresas/controllers/pages.api.controller");
const grid_banner_page_api_controller_1 = require("@/empresas/controllers/grid_banner_page.api.controller");
const emails_api_controller_1 = require("@/emails/controllers/emails.api.controller");
const emails_promociones_controller_1 = require("@/emails/controllers/emails_promociones.controller");
exports.apiRouters = [
    empresas_api_controller_1.EmpresasApiController,
    users_api_controller_1.UsersApiController,
    products_api_controller_1.ProductsApiController,
    categories_api_controller_1.CategoriesApiController,
    coupons_api_controller_1.CouponsApiController,
    orders_api_controller_1.OrdersApiController,
    cart_api_controller_1.CartApiController,
    auth_api_controller_1.AuthApiController,
    notifications_api_controller_1.NotificationsApiController,
    detail_orders_api_controller_1.DetailOrdersApiController,
    documents_api_controller_1.DocumentsApiController,
    guides_api_controller_1.GuidesApiController,
    Invoices_api_controller_1.InvoicesApiController,
    kind_credit_notes_api_controller_1.KindCreditNotesApiController,
    kind_debit_notes_api_controller_1.KindDebitNotesApiController,
    notes_api_controller_1.NotesApiController,
    pay_methods_api_controller_1.PayMethodsApiController,
    status_orders_api_controller_1.StatusOrdersApiController,
    brands_api_controller_1.BrandsApiController,
    ubigeo_api_controller_1.UbigeoApiController,
    seeders_api_controller_1.SeederApiController,
    paginator_api_controller_1.PaginatorApiController,
    servicio_api_controller_1.ServicioApiController,
    admin_api_controller_1.AdminApiController,
    suppliers_api_controller_1.SuppliersApiController,
    posts_api_controller_1.PostsApiController,
    uploads_controller_1.UploadsController,
    options_api_controller_1.OptionsApiController,
    mesas_api_controller_1.MesasApiController,
    complaints_api_controller_1.ComplaintApiController,
    urls_controller_1.UrlsController,
    new_api_controller_1.NewApiController,
    background_api_controller_1.BackgroundApiController,
    backup_api_controller_1.BackupApiController,
    settings_api_controller_1.SettingsApiController,
    kind_invoice_api_controller_1.KindInvoiceApiController,
    floors_api_controller_1.FloorsApiController,
    ia_api_controller_1.IAApiController,
    whatsapp_api_controller_1.whatsappApiController,
    web_api_controller_1.WebApiController,
    telegram_api_controller_1.TelegramApiController,
    categories_api_controller_2.CategoriesFinanzasApiController,
    finanzas_api_controller_1.FinanzasApiController,
    izipay_api_controller_1.IzipayApiController,
    citas_api_controller_1.CitasApiController,
    comments_api_controller_1.CommentsApiController,
    ratings_api_controller_1.RatingApiController,
    reactions_api_controller_1.ReactionsApiController,
    subcomments_api_controller_1.SubcommentsApiController,
    favorites_api_controller_1.FavoritesApiController,
    subcategories_api_controller_1.SubcategoriesApiController,
    grid_banner_api_controller_1.GridBannerApiController,
    files_api_controller_1.FilesApiServiceApiController,
    questions_api_controller_1.QuestionsApiController,
    pages_api_controller_1.PagesApiController,
    grid_banner_page_api_controller_1.GridBannerPageApiController,
    emails_api_controller_1.EmailsApiController,
    emails_promociones_controller_1.EmailsPromocionesApiController,
];
