import {
	Column,
	DataType,
	Table,
	Model,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import { Empresas } from "@/empresas/entities/empresas.entity";
import type { UrlsPaymentSchema } from "../schemas/urls.payment.schema";

@Table
export class UrlsPayment
	extends Model
	implements Omit<UrlsPaymentSchema, "id">
{
	@Column({
		allowNull: false,
		type: DataType.TEXT,
	})
	url: string;

	@Column({
		allowNull: false,
		type: DataType.STRING,
	})
	hash: string;

	@Column({
		allowNull: false,
		type: DataType.DATE,
	})
	time: Date;

	@ForeignKey(() => Empresas)
	@Column({ type: DataType.INTEGER, allowNull: false })
	empresa_id: number;

	@BelongsTo(() => Empresas)
	empresa: unknown;
}
