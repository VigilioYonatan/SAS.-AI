import {
    Table,
    Model,
    Column,
    DataType,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import { Empresas } from "./empresas.entity";
import type { QuestionsSchema } from "../schemas/questions.schema";

@Table
export class Questions extends Model implements Omit<QuestionsSchema, "id"> {
    @Column({ type: DataType.STRING(250) })
    question: string;

    @Column({ type: DataType.STRING(250) })
    answer: string | null;

    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;
}
