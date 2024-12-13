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
import { GridBannerService } from "./grid_banner_service.entity";

@Table
export class GridBanner extends Model implements Omit<GridBannerSchema, "id"> {
    @Column({ type: DataType.STRING })
    title: string | null;

    @Column({ type: DataType.BOOLEAN })
    enabled: boolean;

    @Column({ type: DataType.TEXT })
    html: string;

    @HasMany(() => GridBannerService)
    grid_banner_services: unknown[];

    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;
}
