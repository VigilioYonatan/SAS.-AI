import {
    Column,
    DataType,
    Table,
    Model,
    DefaultScope,
    ForeignKey,
    BelongsTo,
    HasMany,
} from "sequelize-typescript";
import { Empresas } from "@/empresas/entities/empresas.entity";
import type { ClientSchema } from "../schemas/client.schema";
import { Orders } from "@/orders/entities/orders.entity";
import { Notifications } from "@/notificactions/entities/notifications.entity";
import { Cities } from "@/ubigeo/entities/cities.entity";

@DefaultScope(() => ({
    include: [
        {
            model: Empresas,
            attributes: ["id", "slug", "name_empresa"],
        },
    ],
}))
@Table
export class Clients extends Model implements Omit<ClientSchema, "id"> {
    @Column({
        allowNull: false,
        type: DataType.STRING(100),
    })
    fullname: string;

    @Column({
        type: DataType.STRING(100),
    })
    address: string | null;

    @Column({
        type: DataType.STRING(100),
    })
    email: string | null;

    @Column({
        type: DataType.STRING(30),
    })
    telephone: string;

    @Column({
        allowNull: false,
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabled: boolean;

    @ForeignKey(() => Cities)
    @Column({
        type: DataType.INTEGER,
    })
    city_id: number | null;

    @Column({
        type: DataType.JSON,
    })
    map_marker: {
        lng: number;
        lat: number;
    } | null;

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;

    @BelongsTo(() => Cities)
    city: unknown;

    @HasMany(() => Orders)
    orders: unknown[];

    @HasMany(() => Notifications)
    notifications: unknown[];
}
