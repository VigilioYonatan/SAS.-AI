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
import type { PageSchema } from "../schemas/pages.schema";
import { GridBannerPage } from "./grid_banner_page.entity";

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

    @Column({ type: DataType.STRING })
    icon: string;

    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;

    @HasMany(() => GridBannerPage)
    grid_banner_pages: unknown[];
}
