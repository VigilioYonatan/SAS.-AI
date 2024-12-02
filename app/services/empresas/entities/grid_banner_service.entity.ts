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
import { Banner } from "./banner.entity";
import type { GridBannerServicechema } from "../schemas/grid-banner-service.schema";
import { GridBanner } from "./grid_banner.entity";

@Table
export class GridBannerService
    extends Model
    implements Omit<GridBannerServicechema, "id">
{
    @Column({ type: DataType.JSON })
    responsive: {
        width: number;
        cols: number;
        rows: number;
        height: number;
        gap: number;
    }[];

    @Column({ type: DataType.STRING(60) })
    title: string;

    @Column({ type: DataType.BOOLEAN })
    enabled: boolean;

    @ForeignKey(() => GridBanner)
    grid_banner_id: number | null;

    @BelongsTo(() => GridBanner)
    grid_banner: unknown;

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
