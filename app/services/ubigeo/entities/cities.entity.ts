import {
    Column,
    DataType,
    Table,
    Model,
    ForeignKey,
    BelongsTo,
    DefaultScope,
    HasMany,
} from "sequelize-typescript";
import type { CitiesSchema } from "../schemas/cities.schema";
import { Regions } from "./regions.entity";
import { Address } from "@/empresas/entities/address.entity";

@DefaultScope(() => ({ include: [Regions] }))
@Table
export class Cities extends Model implements Omit<CitiesSchema, "id"> {
    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    code: string;

    @Column({
        allowNull: false,
        type: DataType.STRING(255),
    })
    name: string;

    @ForeignKey(() => Regions)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    region_id: number;

    @BelongsTo(() => Regions)
    region: unknown;

    @HasMany(() => Address)
    address: unknown;
}
