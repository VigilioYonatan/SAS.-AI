import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	Table,
	Model,
	DefaultScope,
} from "sequelize-typescript";
import type { AddressSchema } from "../schemas/address.schema";
import { InformationEntity } from "./information.entity";
import { Cities } from "@/ubigeo/entities/cities.entity";

@DefaultScope(() => ({ include: [{ model: Cities }] }))
@Table({ timestamps: false })
export class Address extends Model implements Omit<AddressSchema, "id"> {
	@ForeignKey(() => Cities)
	@Column({
		allowNull: false,
		type: DataType.INTEGER,
	})
	city_id: number;

	@Column({
		allowNull: false,
		type: DataType.STRING(255),
	})
	urbanizacion: string;

	@Column({
		allowNull: false,
		type: DataType.STRING(255),
	})
	direccion: string;

	@Column({
		allowNull: false,
		type: DataType.STRING(255),
	})
	codLocal: string;

	// relations
	@BelongsTo(() => Cities)
	city: unknown;

	@ForeignKey(() => InformationEntity)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	information_id: number;

	@BelongsTo(() => InformationEntity)
	information: unknown;
}
