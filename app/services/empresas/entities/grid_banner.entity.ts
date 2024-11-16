import {
    Table,
    Model,
    Column,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany,
} from "sequelize-typescript";
import { Empresas } from "./empresas.entity";
import type { GridBannerSchema } from "../schemas/grid_banner.schema";
import { Banner } from "./banner.entity";

@Table
export class GridBanner extends Model implements Omit<GridBannerSchema, "id"> {
    @Column({ type: DataType.JSON })
    responsive: {
        width: number;
        cols: number;
        rows: number;
        height: number;
        gap: number;
    }[];
    @Column({ type: DataType.TEXT })
    custom_html: string;

    @Column({ type: DataType.STRING(60) })
    title: string;

    @Column({ type: DataType.BOOLEAN })
    enabled: boolean;

    @HasMany(() => Banner)
    banners: unknown[];

    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;
}
