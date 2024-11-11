import {
	Column,
	DataType,
	Table,
	Model,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import { Empresas } from "@/empresas/entities/empresas.entity";
import type { CitasSettingSchema } from "../schemas/citas_settings.schema";

@Table
export class CitasSettings
	extends Model
	implements Omit<CitasSettingSchema, "id">
{
	@Column({
		allowNull: false,
		type: DataType.INTEGER,
	})
	max_days: number;

	@Column({
		allowNull: false,
		type: DataType.INTEGER,
	})
	max_minutes: number;
	@Column({
		allowNull: false,
		type: DataType.INTEGER,
	})
	maxCitasForHour: number;

	@Column({
		allowNull: false,
		type: DataType.BOOLEAN,
	})
	sendQuestionChunk: boolean;

	@Column({
		allowNull: false,
		type: DataType.INTEGER,
	})
	maxCitas: number;

	@Column({
		allowNull: false,
		type: DataType.BOOLEAN,
	})
	enabled: boolean;

	@Column({
		allowNull: false,
		type: DataType.BOOLEAN,
	})
	isNextDay: boolean;

	@Column({
		allowNull: false,
		type: DataType.INTEGER,
	})
	sendAlert: number;

	@Column({
		type: DataType.STRING,
	})
	custom: string | null;

	@Column({
		allowNull: false,
		type: DataType.JSON,
	})
	questions: { question: string; options: string[] }[];

	@Column({
		allowNull: false,
		type: DataType.JSON,
	})
	horario: {
		id: number;
		day: string;
		openTime: string;
		closeTime: string;
		enabled: boolean;
	}[];

	@ForeignKey(() => Empresas)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
	})
	empresa_id: number;

	@BelongsTo(() => Empresas)
	empresa: unknown;
}
