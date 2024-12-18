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
import type { GridBannerShopSchema } from "../schemas/grid-banner-shop.schema";

@Table
export class GridBannerShop
    extends Model
    implements Omit<GridBannerShopSchema, "id">
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
