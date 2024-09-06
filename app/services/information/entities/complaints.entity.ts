import {
	Column,
	DataType,
	Table,
	Model,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import type {
	ComplaintsSchema,
	TypeComplaint,
	TypeConsumption,
} from "../schemas/complaints.schema";
import { InformationEntity } from "./information.entity";

@Table
export class Complaints extends Model implements Omit<ComplaintsSchema, "id"> {
	@Column({
		allowNull: false,
		type: DataType.STRING(30),
	})
	fullName: string;

	@Column({
		allowNull: false,
		type: DataType.STRING(20),
	})
	phone: string;

	@Column({
		allowNull: false,
		type: DataType.STRING(20),
	})
	numberDocument: string;

	@Column({
		allowNull: false,
		type: DataType.STRING(100),
	})
	email: string;

	@Column({
		type: DataType.STRING(100),
	})
	guardianName: string;

	@Column({
		allowNull: false,
		type: DataType.STRING(100),
	})
	address: string;

	@Column({
		allowNull: false,
		type: DataType.ENUM("Queja", "Reclamo"),
	})
	typeComplaint: TypeComplaint;

	@Column({
		allowNull: false,
		type: DataType.TEXT,
	})
	detailsOfComplaint: string;

	@Column({
		allowNull: false,
		type: DataType.ENUM("Producto", "Servicio"),
	})
	typeOfConsumption: TypeConsumption;

	@Column({
		allowNull: false,
		type: DataType.TEXT,
	})
	detailsOfConsumption: string;

	@Column({
		allowNull: false,
		type: DataType.DATE,
	})
	dateOfComplaint: Date;

	@ForeignKey(() => InformationEntity)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	information_id: number;

	@BelongsTo(() => InformationEntity)
	information: unknown;
}
