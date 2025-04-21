import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import type { TipoServicioSchema } from "../schemas/tipo_servicio.schema";
import { TipoEmpresa } from "./tipo_empresa.entity";
import type { V } from "~/libs/helpers";

@Table
export class TipoServicio
    extends Model
    implements Omit<TipoServicioSchema, "id">
{
    @Column({ type: DataType.STRING })
    tipo: string;

    @HasMany(() => TipoEmpresa)
    tipo_empresas: V<TipoEmpresa>[];
}
