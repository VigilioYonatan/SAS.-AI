import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	Model,
	Table,
} from "sequelize-typescript";
import type { CategoryFinanzasSchema } from "../schemas/tipo.schema";
import { TipoFinanza } from "./tipo.entity";
import { Finanzas } from "./finanzas.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";

@Table
export class CategoriesFinanzas
	extends Model
	implements Omit<CategoryFinanzasSchema, "id">
{
	@Column({ type: DataType.STRING })
	value: string;

	@Column({ type: DataType.STRING })
	icon: string;

	@ForeignKey(() => TipoFinanza)
	@Column({ type: DataType.INTEGER })
	tipo_finanza_id: number;

	@BelongsTo(() => TipoFinanza)
	tipoFinanza: unknown;

	@ForeignKey(() => Empresas)
	@Column({ type: DataType.INTEGER })
	empresa_id: number;

	@BelongsTo(() => Empresas)
	empresa: unknown;

	@HasMany(() => Finanzas)
	finanzas: Finanzas[];
}
