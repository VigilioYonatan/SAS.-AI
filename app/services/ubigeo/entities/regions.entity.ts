import {
    Column,
    DataType,
    Table,
    Model,
    HasMany,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import type { RegionsSchema } from "../schemas/regions.schema";
import { Cities } from "./cities.entity";
import { Countries } from "./countries.entity";

@Table
export class Regions extends Model implements Omit<RegionsSchema, "id"> {
    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    code: string;

    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    name: string;

    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    days: number;

    @Column({
        allowNull: false,
        type: DataType.BOOLEAN,
    })
    enabled: boolean;

    @ForeignKey(() => Countries)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    country_id: number;

    @Column({
        allowNull: false,
        type: DataType.DECIMAL,
    })
    priceShipping: number;

    @HasMany(() => Cities)
    cities: unknown[];

    @BelongsTo(() => Countries)
    country: unknown;
}
