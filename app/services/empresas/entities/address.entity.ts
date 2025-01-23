import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Table,
    Model,
    DefaultScope,
    HasMany,
} from "sequelize-typescript";
import type { AddressSchema } from "../schemas/address.schema";
import { Empresas } from "./empresas.entity";
import { Cities } from "@/ubigeo/entities/cities.entity";
import { Orders } from "@/orders/entities/orders.entity";

@DefaultScope(() => ({ include: [{ model: Cities }] }))
@Table({ timestamps: false })
export class Address extends Model implements Omit<AddressSchema, "id"> {
    @ForeignKey(() => Cities)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    city_id: number;

    @Column({
        allowNull: false,
        type: DataType.STRING(255),
    })
    urbanizacion: string;

    @Column({
        defaultValue: true,
        type: DataType.BOOLEAN,
    })
    enabled: boolean;

    @Column({
        allowNull: false,
        type: DataType.STRING(255),
    })
    direccion: string;

    @Column({
        allowNull: false,
        type: DataType.STRING(255),
    })
    codLocal: string;

    // relations
    @BelongsTo(() => Cities)
    city: unknown;

    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;

    @HasMany(() => Orders)
    orders: unknown[];
}
