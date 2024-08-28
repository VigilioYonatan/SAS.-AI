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
} from "sequelize-typescript";
import type {
    CompanySchema,
    ContactsSchema,
    Credentials,
    CredentialsWeb,
    GroupWhatsapp,
    InformationSchema,
    InteligenceArtificial,
    Payments,
    ScheduleSchema,
    Whatsappconfig,
} from "../schemas/information.schema";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { Address } from "./address.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
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

@DefaultScope(() => ({ include: [Address, MetodosPago, TipoEmpresa] }))
@Table({ tableName: "information" })
export class InformationEntity
    extends Model
    implements Omit<InformationSchema, "id">
{
    // auth
    @Column({
        type: DataType.STRING(200),
    })
    name_empresa: string;

    @Column({
        type: DataType.STRING(200),
    })
    dial_code: string;

    // auth
    @Column({
        type: DataType.STRING(200),
    })
    web: string;

    @Column({
        type: DataType.STRING(200),
    })
    email: string;

    @Column({
        type: DataType.JSON,
    })
    payments: Payments;

    @Column({
        type: DataType.STRING(20),
    })
    bg_color: string;

    @Column({
        type: DataType.STRING(200),
        unique: true,
    })
    slug: string;

    @Column({
        type: DataType.STRING(200),
        unique: true,
    })
    token: string;

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
        type: DataType.JSON,
    })
    icon: FilesSchema[] | null;

    @Column({
        type: DataType.JSON,
    })
    logo: FilesSchema[] | null;

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
        type: DataType.TEXT,
    })
    about: string;

    @Column({
        type: DataType.JSON,
    })
    company: CompanySchema | null;

    @Column({
        type: DataType.JSON,
    })
    certificado: FilesSchema[];

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabledBot: boolean;

    @Column({
        type: DataType.JSON,
    })
    credentials: Credentials;

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
        unique: true,
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
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    enabled_catalogo: boolean;

    @Column({
        type: DataType.JSON,
        defaultValue: [],
    })
    contacts: ContactsSchema[];

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
    })
    credentials_web: CredentialsWeb | null;

    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    whatsappconfig: Whatsappconfig;

    @Column({
        type: DataType.JSON,
    })
    schedule: ScheduleSchema[];

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
    host: string | null;

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

    @HasMany(() => ProductsServicio)
    products_servicio: ProductsServicio[];

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

    @BelongsTo(() => TipoEmpresa)
    tipo_empresa: TipoEmpresa;

    @HasOne(() => New)
    new: New;

    @HasOne(() => MetodosPago)
    metodos_pago: unknown;

    @HasMany(() => Urls)
    urls: unknown[];

    @HasMany(() => Posts)
    posts: unknown[];

    @HasMany(() => Background)
    backgrounds: unknown[];

    @HasMany(() => Suppliers)
    suppliers: unknown[];
}
