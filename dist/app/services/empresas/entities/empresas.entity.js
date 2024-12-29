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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empresas = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const address_entity_1 = require("./address.entity");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
const products_restaurant_entity_1 = require("@/products/entities/products_restaurant.entity");
const coupons_entity_1 = require("@/products/entities/coupons.entity");
const users_entity_1 = require("@/users/entities/users.entity");
const products_options_entity_1 = require("@/products/entities/options/products_options.entity");
const variants_features_entity_1 = require("@/products/entities/options/variants_features.entity");
const brands_entitiy_1 = require("@/products/entities/brands.entitiy");
const tipo_empresa_entity_1 = require("./tipo_empresa.entity");
const new_entity_1 = require("./new.entity");
const metodosPago_entity_1 = require("./metodosPago.entity");
const urls_entity_1 = require("@/urls/entities/urls.entity");
const posts_entity_1 = require("@/posts/entities/posts.entity");
const background_entity_1 = require("./background.entity");
const suppliers_entity_1 = require("@/suppliers/entities/suppliers.entity");
const regions_entity_1 = require("@/ubigeo/entities/regions.entity");
const regions_empresa_entity_1 = require("@/ubigeo/entities/regions_empresa.entity");
const mesas_entity_1 = require("@/orders/entities/mesas.entity");
const floors_entity_1 = require("@/orders/entities/floors.entity");
const settings_entity_1 = require("./settings.entity");
const finanzas_entity_1 = require("@/finanzas/entities/finanzas.entity");
const categories_entity_1 = require("@/finanzas/entities/categories.entity");
const tipo_entity_1 = require("@/finanzas/entities/tipo.entity");
const citas_settings_entity_1 = require("@/citas/entities/citas_settings.entity");
const citas_entities_1 = require("@/citas/entities/citas.entities");
const favorites_entity_1 = require("@/favorites/entities/favorites.entity");
const comments_entity_1 = require("@/polymorphism/entities/comments.entity");
const reactions_entity_1 = require("@/polymorphism/entities/reactions.entity");
const subcomments_entity_1 = require("@/polymorphism/entities/subcomments.entity");
const grid_banner_entity_1 = require("./grid_banner.entity");
const file_entity_1 = require("./file.entity");
const redes_chat_entity_1 = require("./redes_chat.entity");
const questions_entity_1 = require("./questions.entity");
const page_entity_1 = require("./page.entity");
const emails_entity_1 = require("@/emails/entities/emails.entity");
const emails_offers_entity_1 = require("@/emails/entities/emails_offers.entity");
let Empresas = class Empresas extends sequelize_typescript_1.Model {
};
exports.Empresas = Empresas;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
    }),
    __metadata("design:type", String)
], Empresas.prototype, "name_empresa", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
    }),
    __metadata("design:type", String)
], Empresas.prototype, "web", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
    }),
    __metadata("design:type", String)
], Empresas.prototype, "dial_code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "zoho", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "payments", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        unique: true,
    }),
    __metadata("design:type", String)
], Empresas.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(30),
    }),
    __metadata("design:type", String)
], Empresas.prototype, "telephoneFirst", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(30),
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "telephoneReclamos", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(30),
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "telephoneThird", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "facebook", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "tiktok", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "instagram", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "twitter", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "youtube", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", String)
], Empresas.prototype, "tz", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], Empresas.prototype, "about", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "facebook_pixel", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "google_tag_manager", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "tiktok_pixel", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "linkedin_tag", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "company", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "enabledBot", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "enabledBotWeb", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "credentials", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "certificado", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "enabledSendSunat", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "enable_sell_country", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "enabledAnimation", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Empresas.prototype, "timeWhatsapp", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Empresas.prototype, "dateRelease", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON }),
    __metadata("design:type", Object)
], Empresas.prototype, "money", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], Empresas.prototype, "igv", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "enabled_igv", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), unique: true, allowNull: false }),
    __metadata("design:type", String)
], Empresas.prototype, "token", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "enabled_booster", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "enabledEmailMessage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "enabledSendMessage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "enabledClientPayComision", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: true }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "isOpen", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], Empresas.prototype, "yearFounded", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Array)
], Empresas.prototype, "impuestos", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "inteligenceArtificial", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "map_marker", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "enable_map_marker", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "enabled_zoho_mail", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "logo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "logo_pwa", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "enabled_catalogo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "enabledSound", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "isFreeVPS", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "isTemplate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "enabled_address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "enabled_commentario_ia", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "isDolar", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], Empresas.prototype, "enabled_dni_cart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "icon", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], Empresas.prototype, "contacts", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: true,
        defaultValue: "FREE",
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "whatsapp_mode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Empresas.prototype, "port", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], Empresas.prototype, "bancos", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], Empresas.prototype, "groupWhatsapp", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "whatsappconfig", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Array)
], Empresas.prototype, "schedule", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "mercado_pago_comision", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], Empresas.prototype, "tipo_impuesto", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], Empresas.prototype, "versionamiento", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
    }),
    __metadata("design:type", String)
], Empresas.prototype, "header_cart", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => tipo_empresa_entity_1.TipoEmpresa),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], Empresas.prototype, "type_empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(60),
    }),
    __metadata("design:type", Object)
], Empresas.prototype, "telegram_token", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], Empresas.prototype, "type_empresa_other", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => address_entity_1.Address),
    __metadata("design:type", Object)
], Empresas.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => products_normal_entity_1.ProductsNormal),
    __metadata("design:type", Array)
], Empresas.prototype, "products_normal", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => products_restaurant_entity_1.ProductsRestaurant),
    __metadata("design:type", Array)
], Empresas.prototype, "products_restaurant", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => coupons_entity_1.Coupons),
    __metadata("design:type", Array)
], Empresas.prototype, "coupons", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => users_entity_1.Users),
    __metadata("design:type", Array)
], Empresas.prototype, "users", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => products_options_entity_1.ProductsOptions),
    __metadata("design:type", Array)
], Empresas.prototype, "productsOptions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => variants_features_entity_1.VariantsFeatures),
    __metadata("design:type", Array)
], Empresas.prototype, "variantsFeatures", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => brands_entitiy_1.Brands),
    __metadata("design:type", Array)
], Empresas.prototype, "brands", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => floors_entity_1.Floors),
    __metadata("design:type", Array)
], Empresas.prototype, "floors", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => tipo_empresa_entity_1.TipoEmpresa),
    __metadata("design:type", tipo_empresa_entity_1.TipoEmpresa)
], Empresas.prototype, "tipo_empresa", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => new_entity_1.New),
    __metadata("design:type", new_entity_1.New)
], Empresas.prototype, "new", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => metodosPago_entity_1.MetodosPago),
    __metadata("design:type", Object)
], Empresas.prototype, "metodos_pago", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => grid_banner_entity_1.GridBanner),
    __metadata("design:type", Array)
], Empresas.prototype, "gridBanners", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => urls_entity_1.Urls),
    __metadata("design:type", Array)
], Empresas.prototype, "urls", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => posts_entity_1.Posts),
    __metadata("design:type", Array)
], Empresas.prototype, "posts", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => finanzas_entity_1.Finanzas),
    __metadata("design:type", Array)
], Empresas.prototype, "finanzas", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => questions_entity_1.Questions),
    __metadata("design:type", Array)
], Empresas.prototype, "questions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => categories_entity_1.CategoriesFinanzas),
    __metadata("design:type", Array)
], Empresas.prototype, "categoriesFinanzas", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => tipo_entity_1.TipoFinanza),
    __metadata("design:type", Array)
], Empresas.prototype, "tipoFinanza", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => background_entity_1.Background),
    __metadata("design:type", Array)
], Empresas.prototype, "backgrounds", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => mesas_entity_1.Mesas),
    __metadata("design:type", Array)
], Empresas.prototype, "mesas", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => suppliers_entity_1.Suppliers),
    __metadata("design:type", Array)
], Empresas.prototype, "suppliers", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => citas_entities_1.Citas),
    __metadata("design:type", Array)
], Empresas.prototype, "citas", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => favorites_entity_1.Favorites),
    __metadata("design:type", Array)
], Empresas.prototype, "favorites", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => citas_settings_entity_1.CitasSettings),
    __metadata("design:type", citas_settings_entity_1.CitasSettings)
], Empresas.prototype, "citasSetting", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => settings_entity_1.Settings),
    __metadata("design:type", settings_entity_1.Settings)
], Empresas.prototype, "setting", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => regions_entity_1.Regions, () => regions_empresa_entity_1.RegionsEmpresa),
    __metadata("design:type", Array)
], Empresas.prototype, "regions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => comments_entity_1.Comments),
    __metadata("design:type", Array)
], Empresas.prototype, "comments", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => subcomments_entity_1.Subcomments),
    __metadata("design:type", Array)
], Empresas.prototype, "subcomments", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => reactions_entity_1.Reactions),
    __metadata("design:type", Array)
], Empresas.prototype, "reactions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => file_entity_1.FileSchema),
    __metadata("design:type", Array)
], Empresas.prototype, "files", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => redes_chat_entity_1.RedesChat),
    __metadata("design:type", Object)
], Empresas.prototype, "redes_chat", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => grid_banner_entity_1.GridBanner),
    __metadata("design:type", Array)
], Empresas.prototype, "grid_banners", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => page_entity_1.Page),
    __metadata("design:type", Array)
], Empresas.prototype, "pages", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => emails_entity_1.Emails),
    __metadata("design:type", Array)
], Empresas.prototype, "emails", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => emails_offers_entity_1.EmailsPromociones),
    __metadata("design:type", Array)
], Empresas.prototype, "emailsPromociones", void 0);
exports.Empresas = Empresas = __decorate([
    (0, sequelize_typescript_1.DefaultScope)(() => ({
        include: [address_entity_1.Address, metodosPago_entity_1.MetodosPago, tipo_empresa_entity_1.TipoEmpresa, settings_entity_1.Settings, citas_settings_entity_1.CitasSettings],
    })),
    sequelize_typescript_1.Table
], Empresas);
