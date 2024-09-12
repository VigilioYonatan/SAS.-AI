import { Column, DataType, Table, Model } from "sequelize-typescript";
import type { InformationSchema } from "../schemas/information.schema";

@Table
export class Information
	extends Model
	implements Omit<InformationSchema, "id">
{
	@Column({
		allowNull: false,
		type: DataType.STRING(50),
		unique: true,
	})
	token: string;
}
