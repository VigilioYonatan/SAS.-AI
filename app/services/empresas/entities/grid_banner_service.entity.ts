import {
    Table,
    Model,
    Column,
    DataType,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import { Empresas } from "./empresas.entity";
import type { GridBannerServicechema } from "../schemas/grid-banner-service.schema";
import { GridBanner } from "./grid_banner.entity";

@Table
export class GridBannerService
    extends Model
    implements Omit<GridBannerServicechema, "id">
{
    @Column({ type: DataType.STRING })
    title: string | null;

    @Column({ type: DataType.TEXT })
    html: string | null;

    @Column({ type: DataType.BOOLEAN })
    enabled: boolean;

    @ForeignKey(() => GridBanner)
    grid_banner_id: number | null;

    @BelongsTo(() => GridBanner)
    grid_banner: unknown;

    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;
}
