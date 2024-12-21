import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type { EmailsPromocionesSchema } from "../schemas/emails_promociones.schema";
import { Empresas } from "@/empresas/entities/empresas.entity";

@Table
export class EmailsPromociones
    extends Model
    implements Omit<EmailsPromocionesSchema, "id">
{
    @Column({ type: DataType.STRING(200), allowNull: false })
    email: string;

    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;
}
