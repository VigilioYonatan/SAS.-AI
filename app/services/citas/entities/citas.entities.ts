import {
    Column,
    DataType,
    Table,
    Model,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import type { CitasSchema } from "../schemas/citas.schema";
import { Empresas } from "@/empresas/entities/empresas.entity";
import type { V } from "~/libs/helpers";

@Table
export class Citas extends Model implements Omit<CitasSchema, "id"> {
    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    hour: string;

    @Column({
        allowNull: false,
        type: DataType.DATEONLY,
    })
    date: Date;

    @Column({
        allowNull: false,
        type: DataType.STRING(60),
    })
    telephone: string;

    @Column({
        type: DataType.STRING,
    })
    description: string | null;

    @Column({
        allowNull: false,
        type: DataType.JSON,
    })
    answers: Record<string, string>;

    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: V<Empresas>;
}
