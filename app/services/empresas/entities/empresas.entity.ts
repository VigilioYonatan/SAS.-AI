import {
    Column,
    DataType,
    Table,
    Model,
    BelongsTo,
    ForeignKey,
    DefaultScope,
    HasMany,
    HasOne,
    BelongsToMany,
} from "sequelize-typescript";
import type {
    CompanySchema,
    ContactsSchema,
    Credentials,
    EmpresasSchema,
    GroupWhatsapp,
    InteligenceArtificial,
    Payments,
    ScheduleSchema,
    Whatsappconfig,
} from "../schemas/empresas.schema";
import { Address } from "./address.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { Coupons } from "@/products/entities/coupons.entity";
import { Users } from "@/users/entities/users.entity";
import { ProductsOptions } from "@/products/entities/options/products_options.entity";
import { VariantsFeatures } from "@/products/entities/options/variants_features.entity";
import { Brands } from "@/products/entities/brands.entitiy";
import { TipoEmpresa } from "./tipo_empresa.entity";
import { New } from "./new.entity";
import { MetodosPago } from "./metodosPago.entity";
import { Urls } from "@/urls/entities/urls.entity";
import { Posts } from "@/posts/entities/posts.entity";
import { Background } from "./background.entity";
import { Suppliers } from "@/suppliers/entities/suppliers.entity";
import { Regions } from "@/ubigeo/entities/regions.entity";
import { RegionsEmpresa } from "@/ubigeo/entities/regions_empresa.entity";
import { Mesas } from "@/orders/entities/mesas.entity";
import { Floors } from "@/orders/entities/floors.entity";
import { Settings } from "./settings.entity";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { Finanzas } from "@/finanzas/entities/finanzas.entity";
import { CategoriesFinanzas } from "@/finanzas/entities/categories.entity";
import { TipoFinanza } from "@/finanzas/entities/tipo.entity";
import { CitasSettings } from "@/citas/entities/citas_settings.entity";
import { Citas } from "@/citas/entities/citas.entities";
import { Favorites } from "@/favorites/entities/favorites.entity";
import { Comments } from "@/polymorphism/entities/comments.entity";
import { Reactions } from "@/polymorphism/entities/reactions.entity";
import { Subcomments } from "@/polymorphism/entities/subcomments.entity";
import { GridBanner } from "./grid_banner.entity";
import { FileSchema } from "./file.entity";
import { RedesChat } from "./redes_chat.entity";
import { Questions } from "./questions.entity";
import { Page } from "./page.entity";
import { Emails } from "@/emails/entities/emails.entity";
import { EmailsPromociones } from "@/emails/entities/emails_offers.entity";

@DefaultScope(() => ({
    include: [Address, MetodosPago, TipoEmpresa, Settings, CitasSettings],
}))
@Table
export class Empresas extends Model implements Omit<EmpresasSchema, "id"> {
    // auth
    @Column({
        type: DataType.STRING(200),
    })
    name_empresa: string;

    @Column({
        type: DataType.STRING(200),
    })
    web: string;

    @Column({
        type: DataType.STRING(200),
    })
    dial_code: string;

    @Column({
        type: DataType.STRING(200),
    })
    email: string | null;

    @Column({
        type: DataType.STRING(200),
    })
    email_zoho: string | null;

    @Column({
        type: DataType.STRING(200),
    })
    password_zoho: string | null;

    @Column({
        type: DataType.JSON,
    })
    payments: Payments;

    @Column({
        type: DataType.STRING(200),
        unique: true,
    })
    slug: string;

    @Column({
        allowNull: false,
        type: DataType.STRING(30),
    })
    telephoneFirst: string;

    @Column({
        type: DataType.STRING(30),
    })
    telephoneReclamos: string | null;

    @Column({
        type: DataType.STRING(30),
    })
    telephoneThird: string | null;

    @Column({
        type: DataType.STRING(100),
    })
    facebook: string | null;

    @Column({
        type: DataType.STRING(100),
    })
    tiktok: string | null;

    @Column({
        type: DataType.STRING(100),
    })
    instagram: string | null;

    @Column({
        type: DataType.STRING(100),
    })
    twitter: string | null;

    @Column({
        type: DataType.STRING(100),
    })
    youtube: string | null;

    @Column({
        type: DataType.STRING(100),
    })
    tz: string;

    @Column({
        type: DataType.TEXT,
    })
    about: string;

    @Column({
        type: DataType.STRING(100),
    })
    facebook_pixel: string | null;

    @Column({
        type: DataType.STRING(100),
    })
    google_tag_manager: string | null;

    @Column({
        type: DataType.STRING(100),
    })
    tiktok_pixel: string | null;

    @Column({
        type: DataType.STRING(100),
    })
    linkedin_tag: string | null;

    @Column({
        type: DataType.JSON,
    })
    company: CompanySchema | null;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabledBot: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabledBotWeb: boolean;

    @Column({
        type: DataType.JSON,
    })
    credentials: Credentials;

    @Column({
        type: DataType.JSON,
    })
    certificado: FilesSchema[] | null;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabledSendSunat: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enable_sell_country: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabledAnimation: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    timeWhatsapp: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    dateRelease: Date;

    @Column({ type: DataType.JSON })
    money: { money: string; international_simbolo: string; simbolo: string };

    @Column({
        type: DataType.INTEGER,
    })
    igv: number;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    enabled_igv: boolean;

    @Column({ type: DataType.STRING(255), unique: true, allowNull: false })
    token: string;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    enabled_booster: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabledEmailMessage: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabledSendMessage: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabledClientPayComision: boolean;

    @Column({ type: DataType.BOOLEAN, allowNull: true })
    isOpen: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    yearFounded: Date;

    @Column({
        type: DataType.JSON,
    })
    impuestos: number[];

    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    inteligenceArtificial: InteligenceArtificial;

    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    map_marker: { lng: number; lat: number };

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    enable_map_marker: boolean;

    @Column({
        type: DataType.JSON,
    })
    logo: FilesSchema[] | null;

    @Column({
        type: DataType.JSON,
    })
    logo_pwa: FilesSchema[] | null;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    enabled_catalogo: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    enabledSound: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    isFreeVPS: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    isTemplate: boolean;
    // activar direccion a la hora de pagar
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    enabled_address: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    enabled_commentario_ia: boolean;

    @Column({
        type: DataType.BOOLEAN,
    })
    isDolar: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    enabled_dni_cart: boolean;

    @Column({
        type: DataType.JSON,
    })
    icon: FilesSchema[] | null;
    @Column({
        type: DataType.JSON,
    })
    photo: FilesSchema[] | null;

    @Column({
        type: DataType.JSON,
        defaultValue: [],
    })
    contacts: ContactsSchema[];

    @Column({
        type: DataType.JSON,
        allowNull: true,
        defaultValue: "FREE",
    })
    whatsapp_mode: {
        type: "FREE" | "VPS" | "API";
        ip: string | null;
        password: string | null;
        memory: string | null;
        cpu: string | null;
        date: Date | null;
    };

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    port: number;

    @Column({
        type: DataType.JSON,
        defaultValue: [],
    })
    bancos: {
        key: string;
        value: string;
        image: string;
    }[];

    @Column({
        type: DataType.JSON,
        defaultValue: [],
    })
    groupWhatsapp: GroupWhatsapp[];

    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    whatsappconfig: Whatsappconfig;

    // @Column({
    //     type: DataType.JSON,
    // })
    // twilio: { account: string; token: string };

    @Column({
        type: DataType.JSON,
    })
    schedule: ScheduleSchema[];

    @Column({
        type: DataType.JSON,
    })
    mercado_pago_comision: {
        comision: number;
        url: string;
        transaccion: number | null;
    };

    @Column({
        type: DataType.STRING,
    })
    tipo_impuesto: string;

    @Column({
        type: DataType.STRING,
    })
    versionamiento: string;

    @Column({
        type: DataType.TEXT,
    })
    header_cart: string;

    @ForeignKey(() => TipoEmpresa)
    @Column({
        type: DataType.INTEGER,
    })
    type_empresa_id: number;

    @Column({
        type: DataType.STRING(60),
    })
    telegram_token: string | null;

    @Column({
        type: DataType.STRING,
    })
    type_empresa_other: string;

    // relations
    @HasOne(() => Address)
    address: unknown;

    @HasMany(() => ProductsNormal)
    products_normal: ProductsNormal[];

    @HasMany(() => ProductsRestaurant)
    products_restaurant: ProductsRestaurant[];

    @HasMany(() => Coupons)
    coupons: unknown[];

    @HasMany(() => Users)
    users: Users[];

    @HasMany(() => ProductsOptions)
    productsOptions: ProductsOptions[];

    @HasMany(() => VariantsFeatures)
    variantsFeatures: VariantsFeatures[];

    @HasMany(() => Brands)
    brands: Brands[];

    @HasMany(() => Floors)
    floors: Floors[];

    @BelongsTo(() => TipoEmpresa)
    tipo_empresa: TipoEmpresa;

    @HasOne(() => New)
    new: New;

    @HasOne(() => MetodosPago)
    metodos_pago: unknown;

    @HasMany(() => GridBanner)
    gridBanners: unknown[];

    @HasMany(() => Urls)
    urls: unknown[];

    @HasMany(() => Posts)
    posts: unknown[];

    @HasMany(() => Finanzas)
    finanzas: unknown[];

    @HasMany(() => Questions)
    questions: unknown[];

    @HasMany(() => CategoriesFinanzas)
    categoriesFinanzas: unknown[];

    @HasMany(() => TipoFinanza)
    tipoFinanza: unknown[];

    @HasMany(() => Background)
    backgrounds: unknown[];

    @HasMany(() => Mesas)
    mesas: unknown[];

    @HasMany(() => Suppliers)
    suppliers: unknown[];

    @HasMany(() => Citas)
    citas: unknown[];

    @HasMany(() => Favorites)
    favorites: Favorites[];

    @HasOne(() => CitasSettings)
    citasSetting: CitasSettings;

    @HasOne(() => Settings)
    setting: Settings;

    @BelongsToMany(() => Regions, () => RegionsEmpresa)
    regions: Regions[];

    @HasMany(() => Comments)
    comments: Comments[];

    @HasMany(() => Subcomments)
    subcomments: Reactions[];

    @HasMany(() => Reactions)
    reactions: Reactions[];

    @HasMany(() => FileSchema)
    files: FileSchema[];

    @HasOne(() => RedesChat)
    redes_chat: unknown;

    @HasMany(() => GridBanner)
    grid_banners: GridBanner[];

    @HasMany(() => Page)
    pages: Page[];

    @HasMany(() => Emails)
    emails: Emails[];

    @HasMany(() => EmailsPromociones)
    emailsPromociones: EmailsPromociones[];
}
