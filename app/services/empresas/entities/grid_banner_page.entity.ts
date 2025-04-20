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
import type { GridBannerPageSchema } from "../schemas/grid-banner-page.schema";
import { Page } from "./page.entity";
import type { V } from "~/libs/helpers";

@Table
export class GridBannerPage
    extends Model
    implements Omit<GridBannerPageSchema, "id">
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
    grid_banner: V<GridBanner>;

    @ForeignKey(() => Page)
    page_id: number;

    @BelongsTo(() => Page)
    page: V<Page>;

    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: V<Empresas>;
}
