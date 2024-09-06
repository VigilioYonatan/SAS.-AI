import { Column, DataType, Table, Model, HasMany } from "sequelize-typescript";
import type { CountriesSchema } from "../schemas/countries.schema";
import { Regions } from "./regions.entity";
@Table
export class Countries extends Model implements Omit<CountriesSchema, "id"> {
	@Column({
		allowNull: false,
		type: DataType.STRING,
	})
	code: string;

	@Column({
		allowNull: false,
		type: DataType.STRING(255),
	})
	name: string;

	@HasMany(() => Regions)
	regions: unknown[];
}
