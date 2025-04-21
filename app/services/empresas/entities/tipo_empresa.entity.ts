import {
    BelongsTo,
    Column,
    DataType,
    DefaultScope,
    ForeignKey,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import type { TipoEmpresaSchema } from "../schemas/tipo_empresa.schema";
import { TipoServicio } from "./tipo_servicio.entity";
import { Empresas } from "./empresas.entity";
import type { V } from "~/libs/helpers";

@DefaultScope(() => ({ include: [TipoServicio] }))
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
    tipo_servicio: V<TipoServicio>;

    @HasMany(() => Empresas)
    empresas: V<Empresas>;
}
