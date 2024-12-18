import {
    Table,
    Model,
    Column,
    DataType,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import { Empresas } from "./empresas.entity";
import { GridBanner } from "./grid_banner.entity";
import type { GridBannerAboutSchema } from "../schemas/grid-banner-about.schema";

@Table
export class GridBannerAbout
    extends Model
    implements Omit<GridBannerAboutSchema, "id">
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
