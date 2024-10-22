import {
	BelongsTo,
	Column,
	DataType,
	DefaultScope,
	ForeignKey,
	Model,
	Table,
} from "sequelize-typescript";
import type { FinanzasSchema } from "../schemas/finanzas.schema";
import { TipoFinanza } from "./tipo.entity";
import { CategoriesFinanzas } from "./categories.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";

@DefaultScope(() => ({ include: [CategoriesFinanzas] }))
@Table
export class Finanzas extends Model implements Omit<FinanzasSchema, "id"> {
	@Column({ type: DataType.DATE })
	date: Date;

	@Column({ type: DataType.STRING(100) })
	description: string;

	@Column({ type: DataType.DECIMAL(10, 2) })
	get presupuesto(): number {
		return Number.parseFloat(
			this.getDataValue("presupuesto" as keyof Finanzas),
		);
	}

	@Column({ type: DataType.DECIMAL(10, 2) })
	get monto(): number {
		return Number.parseFloat(this.getDataValue("monto" as keyof Finanzas));
	}

	@ForeignKey(() => TipoFinanza)
	@Column({ type: DataType.INTEGER })
	tipo_finanza_id: number;

	@BelongsTo(() => TipoFinanza)
	tipoFinanza: unknown;

	@ForeignKey(() => CategoriesFinanzas)
	@Column({ type: DataType.INTEGER })
	category_finanza_id: number;

	@BelongsTo(() => CategoriesFinanzas)
	categoriesFinanza: unknown;

	@ForeignKey(() => Empresas)
	@Column({ type: DataType.INTEGER })
	empresa_id: number;

	@BelongsTo(() => TipoFinanza)
	empresa: unknown;
}
