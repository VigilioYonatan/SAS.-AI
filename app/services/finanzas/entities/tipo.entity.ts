import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	Model,
	Table,
} from "sequelize-typescript";
import type { TipoFinanzasSchema } from "../schemas/tipo.schema";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { CategoriesFinanzas } from "./categories.entity";

@Table
export class TipoFinanza
	extends Model
	implements Omit<TipoFinanzasSchema, "id">
{
	@Column({ type: DataType.STRING })
	name: string;

	@ForeignKey(() => Empresas)
	@Column({ type: DataType.INTEGER })
	empresa_id: number;

	@BelongsTo(() => Empresas)
	empresa: unknown;

	@HasMany(() => CategoriesFinanzas)
	categoriesFinanzas: CategoriesFinanzas[];
}
