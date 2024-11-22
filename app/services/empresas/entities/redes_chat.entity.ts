import {
    Table,
    Model,
    Column,
    DataType,
    BelongsTo,
    ForeignKey,
} from "sequelize-typescript";
import type { RedesChatSchema } from "../schemas/redes_chat.schema";
import { Empresas } from "./empresas.entity";

@Table
export class RedesChat extends Model implements Omit<RedesChatSchema, "id"> {
    @Column({ type: DataType.JSON })
    whatsapp_chat: { id: string; name: string }[];

    @Column({ type: DataType.JSON })
    tiktok_chat: { id: string; name: string }[];

    @Column({ type: DataType.JSON })
    linkedin_chat: { id: string; name: string }[];

    @Column({ type: DataType.JSON })
    messenger_chat: { id: string; name: string }[];

    @Column({ type: DataType.JSON })
    instagram_chat: { id: string; name: string }[];

    @Column({ type: DataType.JSON })
    telegram_chat: { id: string; name: string }[];

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;
}
