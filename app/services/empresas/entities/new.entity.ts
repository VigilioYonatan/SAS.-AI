import {
	Table,
	Model,
	Column,
	DataType,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import type { NewSchema } from "../schemas/new.schema";
import { Empresas } from "./empresas.entity";

@Table
export class New extends Model implements Omit<NewSchema, "id"> {
	@Column({ type: DataType.STRING })
	title: string;

	@Column({ type: DataType.STRING })
	subtitle: string;

	@Column({ type: DataType.STRING })
	link: string;

	@Column({ type: DataType.BOOLEAN })
	enabled: boolean;

	@Column({ type: DataType.DATE })
	date: Date | null;

	@ForeignKey(() => Empresas)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	empresa_id: number;

	@BelongsTo(() => Empresas)
	empresa: unknown;
}
