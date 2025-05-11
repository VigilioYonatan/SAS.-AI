import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type { VisitantesPagesSchema } from "../schemas/visitantes_pages.schema";
import { VisitantesEntity } from "./visitantes.entity";
import type { V } from "~/libs/helpers";
import { Empresas } from "@/empresas/entities/empresas.entity";

@Table({ tableName: "visitantes_pages" })
export class VisitantesPagesEntity
    extends Model
    implements Omit<VisitantesPagesSchema, "id">
{
    @Column({ type: DataType.TEXT })
    page: string;

    @Column({ type: DataType.INTEGER })
    time: number;

    @Column({ type: DataType.INTEGER })
    click: number;

    @Column({ type: DataType.INTEGER })
    scroll: number;

    @Column({ type: DataType.INTEGER })
    visit: number;

    @ForeignKey(() => VisitantesEntity)
    @Column({ type: DataType.INTEGER })
    visitante_id: number;

    @BelongsTo(() => VisitantesEntity)
    visitante: V<VisitantesEntity>;

    @ForeignKey(() => Empresas)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: V<Empresas>;
}
