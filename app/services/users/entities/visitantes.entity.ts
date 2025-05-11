import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import type { VisitantesSchema } from "../schemas/visitantes.schema";
import { VisitantesPagesEntity } from "./visitantes_pages.entity";
import type { V } from "~/libs/helpers";
import { Empresas } from "@/empresas/entities/empresas.entity";

@Table({ tableName: "visitantes" })
export class VisitantesEntity
    extends Model
    implements Omit<VisitantesSchema, "id">
{
    @Column({ type: DataType.STRING(100) })
    name: string;

    @Column({ type: DataType.STRING(255) })
    email: string;

    @Column({ type: DataType.STRING(100) })
    telephone: string;

    @Column({ type: DataType.STRING(100) })
    key: string;

    @Column({ type: DataType.STRING(100) })
    ip: string;

    @Column({ type: DataType.STRING(255) })
    browser: string;

    @Column({ type: DataType.STRING(255) })
    os: string;

    @Column({ type: DataType.STRING(255) })
    ubicacion: string;

    @HasMany(() => VisitantesPagesEntity)
    visitantes_page: V<VisitantesPagesEntity>[];

    @ForeignKey(() => Empresas)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: V<Empresas>;
}
