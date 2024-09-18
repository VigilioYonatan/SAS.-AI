import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	Model,
	Table,
} from "sequelize-typescript";
import type { SettingsSchema } from "../schemas/settings.schema";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { Empresas } from "./empresas.entity";

@Table
export class Settings extends Model implements Omit<SettingsSchema, "id"> {
	@Column({
		type: DataType.STRING,
	})
	web: string | null;

	@Column({
		type: DataType.STRING,
	})
	host: string | null;

	@Column({
		type: DataType.TEXT,
	})
	about: string;

	@Column({
		type: DataType.STRING(60),
	})
	bg_color: string;

	@Column({
		type: DataType.BOOLEAN,
	})
	isCoverImage: boolean;

	@Column({
		type: DataType.BOOLEAN,
	})
	isScrolling: boolean;

	@Column({
		type: DataType.BOOLEAN,
		defaultValue: null,
		allowNull: true,
	})
	isDark: boolean;

	@Column({
		type: DataType.STRING(60),
	})
	bg_color_responsive: string;

	@Column({
		type: DataType.STRING(60),
	})
	type_border: string;

	@Column({
		type: DataType.STRING(60),
	})
	type_cart: string;

	@Column({
		type: DataType.JSON,
	})
	icon: FilesSchema[] | null;

	@Column({
		type: DataType.JSON,
	})
	photo: FilesSchema[] | null;

	@ForeignKey(() => Empresas)
	@Column({ type: DataType.INTEGER, allowNull: false })
	empresa_id: number;

	@BelongsTo(() => Empresas)
	empresa: unknown;
}
