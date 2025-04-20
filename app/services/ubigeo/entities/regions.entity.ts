import {
    Column,
    DataType,
    Table,
    Model,
    HasMany,
    ForeignKey,
    BelongsTo,
    BelongsToMany,
} from "sequelize-typescript";
import type { RegionsSchema } from "../schemas/regions.schema";
import { Cities } from "./cities.entity";
import { Countries } from "./countries.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { RegionsEmpresa } from "./regions_empresa.entity";
import type { V } from "~/libs/helpers";

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

    @ForeignKey(() => Countries)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    country_id: number;

    @HasMany(() => Cities)
    cities: V<Cities>[];

    @BelongsTo(() => Countries)
    country: V<Countries>;

    @BelongsToMany(() => Empresas, () => RegionsEmpresa)
    empresas: (V<Empresas> & { RegionsEmpresa: RegionsEmpresa })[];
}
