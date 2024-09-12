import {
	Column,
	DataType,
	Table,
	Model,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import type { UrlsSchema } from "../schemas/urls.schema";
import { Empresas } from "@/empresas/entities/empresas.entity";

@Table
export class Urls extends Model implements Omit<UrlsSchema, "id"> {
	@Column({
		allowNull: false,
		type: DataType.STRING,
	})
	web: string;

	@Column({
		allowNull: false,
		type: DataType.STRING,
	})
	hash: string;

	@Column({
		allowNull: false,
		type: DataType.BOOLEAN,
	})
	enabled: boolean;

	@ForeignKey(() => Empresas)
	@Column({ type: DataType.INTEGER, allowNull: false })
	empresa_id: number;

	@BelongsTo(() => Empresas)
	empresa: unknown;
}
