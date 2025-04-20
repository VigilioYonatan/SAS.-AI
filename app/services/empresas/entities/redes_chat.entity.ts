import {
    Table,
    Model,
    Column,
    DataType,
    BelongsTo,
    ForeignKey,
} from "sequelize-typescript";
import { Empresas } from "./empresas.entity";
import type { RedesChatSchema } from "../schemas/redes_chat.schema";
import type { V } from "~/libs/helpers";

@Table
export class RedesChat extends Model implements Omit<RedesChatSchema, "id"> {
    @Column({ type: DataType.JSON })
    whatsapp_chat: RedesChatSchema["whatsapp_chat"];

    @Column({ type: DataType.JSON })
    tiktok_chat: RedesChatSchema["tiktok_chat"];

    @Column({ type: DataType.JSON })
    linkedin_chat: RedesChatSchema["linkedin_chat"];

    @Column({ type: DataType.JSON })
    messenger_chat: RedesChatSchema["messenger_chat"];

    @Column({ type: DataType.JSON })
    instagram_chat: RedesChatSchema["instagram_chat"];

    @Column({ type: DataType.JSON })
    telegram_chat: RedesChatSchema["telegram_chat"];

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: V<Empresas>;
}
