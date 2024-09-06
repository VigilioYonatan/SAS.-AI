import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	Model,
	Table,
} from "sequelize-typescript";
import type { MesasSchema } from "../schemas/mesas.schema";
import { Orders } from "./orders.entity";
import { Floors } from "./floors.entity";
import { InformationEntity } from "@/information/entities/information.entity";

@Table
export class Mesas extends Model implements Omit<MesasSchema, "id"> {
	@Column({ type: DataType.STRING(100), allowNull: false })
	mesa_code: string;

	@ForeignKey(() => Floors)
	@Column({ type: DataType.INTEGER, allowNull: false })
	floor_id: number;

	@ForeignKey(() => InformationEntity)
	@Column({ type: DataType.INTEGER, allowNull: false })
	information_id: number;

	// mesas - floor : one - to many
	@BelongsTo(() => Floors)
	floor: unknown;

	// mesas - orders: one to many
	@HasMany(() => Orders)
	orders: unknown[];

	@BelongsTo(() => InformationEntity)
	information: unknown;
}
