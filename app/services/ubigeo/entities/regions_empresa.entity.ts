import {
    Column,
    DataType,
    Table,
    Model,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import type { RegionsEmpresaSchema } from "../schemas/regions_empresa.schema";
import { Regions } from "./regions.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";
import type { V } from "~/libs/helpers";

@Table
export class RegionsEmpresa
    extends Model
    implements Omit<RegionsEmpresaSchema, "id">
{
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

    @Column({
        allowNull: false,
        type: DataType.DECIMAL,
    })
    get priceShipping(): number {
        return Number.parseFloat(
            this.getDataValue("priceShipping" as keyof RegionsEmpresaSchema)
        );
    }

    @ForeignKey(() => Regions)
    @Column({ type: DataType.INTEGER, allowNull: false })
    region_id: number;

    @BelongsTo(() => Regions)
    region: V<Regions>;

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: V<Empresas>;
}
