import {
	Column,
	DataType,
	Table,
	Model,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import type { UrlsSchema } from "../schemas/urls.schema";
import { InformationEntity } from "@/information/entities/information.entity";

@Table
export class Urls extends Model implements Omit<UrlsSchema, "id"> {
	@Column({
		allowNull: false,
		unique: true,
		type: DataType.STRING,
	})
	web: string;

	@Column({
		allowNull: false,
		unique: true,
		type: DataType.STRING,
	})
	hash: string;

	@Column({
		allowNull: false,
		type: DataType.BOOLEAN,
	})
	enabled: boolean;

	@ForeignKey(() => InformationEntity)
	@Column({ type: DataType.INTEGER, allowNull: false })
	information_id: number;

	@BelongsTo(() => InformationEntity)
	information: unknown;
}
