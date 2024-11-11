import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type { SettingsSchema } from "../schemas/settings.schema";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { Empresas } from "./empresas.entity";

@Table
export class Settings extends Model implements Omit<SettingsSchema, "id"> {
    @Column({
        type: DataType.STRING,
    })
    web: string | null;

    @Column({
        type: DataType.JSON,
    })
    host: SettingsSchema["host"];

    @Column({
        type: DataType.TEXT,
    })
    about: string;

    @Column({
        type: DataType.STRING(60),
    })
    bg_color: string;
    @Column({
        type: DataType.STRING(60),
    })
    bg_color_background: string;

    @Column({
        type: DataType.STRING(60),
    })
    bg_color_footer: string;

    @Column({
        type: DataType.STRING(60),
    })
    font_face: string;

    @Column({
        type: DataType.STRING(60),
    })
    bg_color_paper: string;

    @Column({
        type: DataType.BOOLEAN,
    })
    isCoverImage: boolean;

    @Column({
        type: DataType.BOOLEAN,
    })
    isScrolling: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: null,
        allowNull: true,
    })
    isDark: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: null,
        allowNull: false,
    })
    isLogoImage: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        allowNull: true,
    })
    position_header: boolean;

    @Column({
        type: DataType.STRING(60),
    })
    bg_color_responsive: string;

    @Column({
        type: DataType.STRING(60),
    })
    border_title_type: string;

    @Column({
        type: DataType.STRING(60),
    })
    background_position: "center" | "start" | "end";

    @Column({
        type: DataType.STRING(60),
    })
    header_type: "normal" | "search" | "transparent";

    @Column({
        type: DataType.STRING(60),
    })
    background_type: "first" | "second";

    @Column({
        type: DataType.STRING(60),
    })
    type_icons: string;

    @Column({
        type: DataType.STRING(60),
    })
    type_border: string;

    @Column({
        type: DataType.STRING(60),
    })
    type_cart: string;

    @Column({
        type: DataType.STRING(60),
    })
    type_map: string;

    @Column({
        type: DataType.STRING(60),
    })
    hamburger: string;

    @Column({
        type: DataType.JSON,
    })
    icon: FilesSchema[] | null;

    @Column({
        type: DataType.JSON,
    })
    shows: {
        map: boolean;
        about: boolean;
        cards: boolean;
        brands: boolean;
        android: boolean;
    };

    @Column({
        type: DataType.JSON,
    })
    photo: FilesSchema[] | null;

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;
}
