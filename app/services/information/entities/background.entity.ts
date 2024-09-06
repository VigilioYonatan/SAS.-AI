import {
	Column,
	DataType,
	Table,
	Model,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import type { BackgroundSchema } from "../schemas/background.schema";
import { InformationEntity } from "./information.entity";

@Table
export class Background extends Model implements Omit<BackgroundSchema, "id"> {
	@Column({
		allowNull: false,
		type: DataType.STRING(60),
	})
	title: string;

	@Column({
		type: DataType.STRING(80),
	})
	description: string | null;

	@Column({
		allowNull: false,
		type: DataType.STRING(255),
	})
	url: string;

	@Column({
		allowNull: false,
		type: DataType.JSON,
	})
	image: FilesSchema[];

	@ForeignKey(() => InformationEntity)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	information_id: number;

	@BelongsTo(() => InformationEntity)
	information: unknown;
}
