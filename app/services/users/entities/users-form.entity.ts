import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type { V } from "~/libs/helpers";
import { Empresas } from "@/empresas/entities/empresas.entity";
import type { UsersFormSchema } from "../schemas/users-form.schema";

@Table({ tableName: "usersForm" })
export class UsersForm
    extends Model
    implements Omit<UsersFormSchema, "id">
{
    @Column({ type: DataType.STRING(100) })
    name: string;

    @Column({ type: DataType.STRING(255) })
    email: string;

    @Column({ type: DataType.STRING(100) })
    telephone: string;

    @ForeignKey(() => Empresas)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: V<Empresas>;
}
