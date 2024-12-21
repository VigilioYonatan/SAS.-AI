import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type { EmailsSchema } from "../schemas/emails.schema";
import { Empresas } from "@/empresas/entities/empresas.entity";

@Table
export class Emails extends Model implements Omit<EmailsSchema, "id"> {
    @Column({ type: DataType.STRING(100), allowNull: false })
    name: string;

    @Column({ type: DataType.STRING(100), allowNull: false })
    subject: string;

    @Column({ type: DataType.STRING(200), allowNull: false })
    email: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    content: string;

    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;
}
