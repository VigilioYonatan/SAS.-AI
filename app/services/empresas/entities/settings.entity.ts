import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type { SettingsSchema } from "../schemas/settings.schema";
import { Empresas } from "./empresas.entity";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";

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
    bg_color_secondary: string;

    @Column({
        type: DataType.STRING(60),
    })
    type_animation: string;

    @Column({
        type: DataType.JSON,
    })
    background_auth: FilesSchema[];

    @Column({
        type: DataType.STRING(60),
    })
    font_face: string;

    @Column({
        type: DataType.STRING(60),
    })
    bg_color_paper: string;

    @Column({
        type: DataType.STRING(60),
    })
    bg_color_button: string;

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
        defaultValue: false,
        allowNull: false,
    })
    isLogoImage: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    })
    is_block_aside: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    is_subcategory: boolean;

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
    type_star: string;

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
        type: DataType.DECIMAL,
    })
    get logo_width(): number {
        return Number.parseFloat(
            this.getDataValue("logo_width" as keyof Settings)
        );
    }

    @Column({
        type: DataType.TEXT,
    })
    web_script: string | null;

    @Column({
        type: DataType.TEXT,
    })
    sc: string | null;

    @Column({
        type: DataType.JSON,
    })
    header_position: { logo: number; navbar: number; icons: number };

    @Column({
        type: DataType.JSON,
    })
    header: {
        home: boolean;
        shop: boolean;
        profile: boolean;
        about: boolean;
        pedidos: boolean;
        condiciones: boolean;
        categories: boolean;
        subcategories: boolean;
        services: boolean;
    };

    @Column({
        type: DataType.STRING(60),
    })
    type_card: string;

    @Column({
        type: DataType.STRING(60),
    })
    type_product_buttons: string;

    @Column({
        type: DataType.BOOLEAN,
    })
    is_hover_product: boolean;

    @Column({
        type: DataType.STRING(60),
    })
    hamburger: string;

    @Column({
        type: DataType.JSON,
    })
    shows: {
        map: boolean;
        about: boolean;
        cards: boolean;
        brands: boolean;
        android: boolean;
        offers_section: boolean;
        offers_user: boolean;
    };

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;
}
