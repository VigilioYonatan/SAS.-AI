import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import {
	Table,
	Model,
	Column,
	DataType,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import { Empresas } from "./empresas.entity";

@Table
export class FileSchema extends Model implements Omit<FileSchema, "id"> {
	@Column({ type: DataType.JSON })
	file: FilesSchema[];

	@ForeignKey(() => Empresas)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	empresa_id: number;

	@BelongsTo(() => Empresas)
	empresa: unknown;
}
