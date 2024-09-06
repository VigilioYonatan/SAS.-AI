import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	Model,
	Table,
} from "sequelize-typescript";
import type { FloorsSchema } from "../schemas/floors.schema";
import { Mesas } from "./mesas.entity";
import { InformationEntity } from "@/information/entities/information.entity";

@Table
export class Floors extends Model implements Omit<FloorsSchema, "id"> {
	@Column({ type: DataType.STRING(100) })
	name: string;

	@HasMany(() => Mesas)
	mesas: Mesas[];

	@ForeignKey(() => InformationEntity)
	@Column({ type: DataType.INTEGER, allowNull: false })
	information_id: number;

	@BelongsTo(() => InformationEntity)
	information: unknown;
}
