import {
    Table,
    Model,
    Column,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany,
    Index,
} from "sequelize-typescript";
import { Empresas } from "./empresas.entity";
import { GridBannerPage } from "./grid_banner_page.entity";
import type { PageSchema } from "../schemas/pages.schema";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import type { V } from "~/libs/helpers";

@Table
export class Page extends Model implements Omit<PageSchema, "id"> {
    @Index
    @Column({ type: DataType.STRING })
    title: string;

    @Index
    @Column({ type: DataType.STRING })
    slug: string;

    @Column({ type: DataType.STRING(1000) })
    description: string;

    @Column({ type: DataType.STRING(1000), defaultValue: null })
    keywords: string | null;

    @Column({ type: DataType.JSON, defaultValue: null })
    favicon: FilesSchema[] | null;

    @Column({ type: DataType.JSON, defaultValue: null })
    ogg_favicon: FilesSchema[] | null;

    @Column({ type: DataType.BOOLEAN })
    isDinamic: boolean;

    @Column({ type: DataType.BOOLEAN })
    enabledHeaderPage: boolean;

    @Column({ type: DataType.STRING })
    icon: string;

    @Column({ type: DataType.JSON })
    queries: PageSchema["queries"];

    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: V<Empresas>;

    @HasMany(() => GridBannerPage)
    grid_banner_pages: V<GridBannerPage>[];
}
