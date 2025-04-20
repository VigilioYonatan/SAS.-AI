import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Orders } from "./orders.entity";
import type { StatusOrdersSchema } from "../schemas/status_orders.schema";
import type { V } from "~/libs/helpers";

@Table({ tableName: "status_order" })
export class StatusOrders
    extends Model
    implements Omit<StatusOrdersSchema, "id">
{
    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        unique: true,
    })
    name: string;

    /*****  RELATIONS  *****/
    // order - status-order:one - to many
    @HasMany(() => Orders)
    orders: V<Orders>[];
}
