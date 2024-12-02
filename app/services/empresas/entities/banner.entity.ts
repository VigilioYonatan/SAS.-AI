import {
    Table,
    Model,
    Column,
    DataType,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import type { BannerSchema } from "../schemas/banner.schema";
import { Empresas } from "./empresas.entity";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { GridBanner } from "./grid_banner.entity";
import { GridBannerService } from "./grid_banner_service.entity";

@Table
export class Banner extends Model implements Omit<BannerSchema, "id"> {
    @Column({ type: DataType.STRING })
    title: string;

    @Column({ type: DataType.INTEGER })
    order: number;

    @Column({ type: DataType.INTEGER })
    row: number;

    @Column({ type: DataType.INTEGER })
    col: number;

    @Column({ type: DataType.STRING })
    link: string | null;

    @Column({ type: DataType.STRING })
    button: string;

    @Column({ type: DataType.STRING })
    subtitle: string;

    @Column({ type: DataType.TEXT })
    script: string | null;

    @Column({ type: DataType.BOOLEAN })
    enabled: boolean;

    @Column({ type: DataType.JSON })
    file: FilesSchema[] | null;

    @Column({ type: DataType.DATE })
    date: Date | null;

    @ForeignKey(() => GridBanner)
    @Column({
        type: DataType.INTEGER,
    })
    grid_banner_id: number;

    @BelongsTo(() => GridBanner)
    gridBanner: unknown;

    @ForeignKey(() => GridBannerService)
    @Column({
        type: DataType.INTEGER,
    })
    grid_banner_service_id: number;

    @BelongsTo(() => GridBannerService)
    gridBanner_service: unknown;

    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;
}
