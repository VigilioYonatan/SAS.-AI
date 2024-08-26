import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import type { TipoEmpresaSchema } from "../schemas/tipo_empresa.schema";
import { TipoServicio } from "./tipo_servicio.entity";
import { InformationEntity } from "./information.entity";

@Table
export class TipoEmpresa
    extends Model
    implements Omit<TipoEmpresaSchema, "id">
{
    @Column({ type: DataType.STRING(100), allowNull: false })
    value: string;

    @ForeignKey(() => TipoServicio)
    @Column({ type: DataType.INTEGER })
    tipo_servicio_id: number;

    @BelongsTo(() => TipoServicio)
    tipo_servicio: unknown;

    @HasMany(() => InformationEntity)
    informations: unknown;
}
