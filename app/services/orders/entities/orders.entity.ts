import {
    BelongsTo,
    Column,
    DataType,
    DefaultScope,
    ForeignKey,
    HasMany,
    HasOne,
    Index,
    Model,
    Table,
} from "sequelize-typescript";
import type { OrdersSchema } from "../schemas/orders.schema";
import { StatusOrders } from "./status_orders.entity";
import { PayMethods } from "./pay_methods.entity";
import { DetailOrders } from "./detail_orders.entity";
import type { PayMethodsSchema } from "../schemas/pay_methods.schema";
import type { StatusOrdersSchema } from "../schemas/status_orders.schema";
import { Invoices } from "./invoices.entity";
import { Notes } from "./notes.entity";
import { Guides } from "./guides.entity";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { Users } from "@/users/entities/users.entity";
import type { UsersSchema } from "@/users/schemas/users.schema";
import { Cities } from "@/ubigeo/entities/cities.entity";
import { Mesas } from "./mesas.entity";
import { Floors } from "./floors.entity";
import type { PASARELA } from "@/payments/libs";
import { Address } from "@/empresas/entities/address.entity";

@DefaultScope(() => ({
    include: [
        {
            model: PayMethods,
            attributes: ["id", "name"] as (keyof PayMethodsSchema)[],
        },
        {
            model: StatusOrders,
            attributes: ["id", "name"] as (keyof StatusOrdersSchema)[],
        },
        { model: Cities },
        {
            model: Users,
            attributes: [
                "id",
                "username",
                "name",
                "lastname",
                "photo",
                "email",
                "role_id",
            ] as (keyof UsersSchema)[],
            as: "user",
        },
        {
            model: Users,
            attributes: [
                "id",
                "username",
                "name",
                "lastname",
                "photo",
                "email",
                "role_id",
            ] as (keyof UsersSchema)[],
            as: "seller",
        },
        {
            model: Mesas,
            include: [{ model: Floors }],
        },
        { model: Address },
    ],
}))
@Table
export class Orders extends Model implements Omit<OrdersSchema, "id"> {
    @Index
    @Column({
        allowNull: false,
        type: DataType.STRING(100),
    })
    order_code: string;

    @Column({
        type: DataType.STRING(200),
    })
    address: string;

    @Column({
        type: DataType.STRING(200),
    })
    email: string | null;

    @Column({
        type: DataType.STRING(200),
    })
    type_pasarela: PASARELA | null;

    @Column({
        type: DataType.STRING(200),
    })
    reference: string | null;

    @Column({
        type: DataType.STRING(20),
    })
    telephone: string;

    @Column({ type: DataType.TEXT })
    description: string | null;

    @Column({ type: DataType.DECIMAL(10, 2) })
    get total() {
        return Number.parseFloat(
            this.getDataValue("total" as keyof OrdersSchema)
        );
    }

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    igv: boolean;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    isService: boolean;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    is_pasarela_client: boolean;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    pasarela_comision: boolean;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    isDelivery: boolean;

    @Column({ type: DataType.DECIMAL, allowNull: false, defaultValue: 1 })
    get moneyChange() {
        return Number.parseFloat(
            this.getDataValue("moneyChange" as keyof OrdersSchema)
        );
    }

    @Column({ type: DataType.JSON, defaultValue: null })
    pasarela_response: object | null;

    @Column({ type: DataType.JSON, defaultValue: null })
    paypal_response: object;

    @Column({ type: DataType.STRING, defaultValue: null })
    paypal_token: string;

    @Column({ type: DataType.STRING, defaultValue: null })
    stripe_token: string;

    @Column({ type: DataType.STRING, defaultValue: null })
    mercado_pago_token: string;

    @Column({
        type: DataType.JSON,
    })
    map_marker: { lng: number; lat: number } | null;

    @Column({
        type: DataType.JSON,
    })
    transferencia_image: FilesSchema[] | null;

    @ForeignKey(() => StatusOrders)
    @Column({ allowNull: false, type: DataType.INTEGER })
    status_order_id: number;

    @ForeignKey(() => Users)
    @Column({ type: DataType.INTEGER })
    user_id: number | null;

    @ForeignKey(() => Users)
    @Column({ type: DataType.INTEGER })
    seller_id: number | null;

    @ForeignKey(() => PayMethods)
    @Column({ allowNull: false, type: DataType.INTEGER })
    pay_method_id: number;

    @ForeignKey(() => Mesas)
    @Column({ type: DataType.INTEGER })
    mesa_id: number | null;

    @ForeignKey(() => Cities)
    @Column({ type: DataType.INTEGER })
    city_id: number | null;

    @ForeignKey(() => Address)
    @Column({ type: DataType.INTEGER })
    address_id: number;

    /*****  RELATIONS   *****/

    // orders - status_order: one to many
    @BelongsTo(() => Cities)
    city: unknown;

    @BelongsTo(() => Users, { as: "user", foreignKey: "user_id" })
    user: unknown;

    @BelongsTo(() => Users, { as: "seller", foreignKey: "seller_id" })
    seller: unknown;

    // orders - status_order: one to many
    @BelongsTo(() => StatusOrders)
    status_order: unknown;

    // orders - pay_methods: one to many
    @BelongsTo(() => PayMethods)
    pay_method: unknown;
    // orders - adress: one to many
    @BelongsTo(() => Address)
    address_empresa: Address;

    @HasMany(() => DetailOrders)
    details_orders: unknown[];

    // one to one - order - invoice
    @HasOne(() => Invoices)
    invoice: unknown;

    @HasOne(() => Notes)
    note: unknown;

    @HasOne(() => Guides)
    guide: unknown;

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;

    // mesas - orders: one to many
    @BelongsTo(() => Mesas, { onDelete: "SET NULL" }) // cuando se eliminar la mesa. convierte en nulo los ordenes
    mesa: unknown;
}
