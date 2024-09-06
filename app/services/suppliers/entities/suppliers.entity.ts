import {
    Column,
    DataType,
    Table,
    Model,
    Index,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import { type SuppliersSchema } from "../schemas/suppliers.schema";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { Empresas } from "@/empresas/entities/empresas.entity";

@Table
export class Suppliers extends Model implements Omit<SuppliersSchema, "id"> {
    @Index
    @Column({
        allowNull: false,
        type: DataType.STRING(30),
    })
    supplier_code: string;

    @Index
    @Column({ type: DataType.STRING(30), allowNull: false })
    ruc: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    razon_social: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    activity: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    address: string;

    @Column({ type: DataType.STRING(30) })
    contact: string | null;

    @Column({ type: DataType.STRING(30), allowNull: false })
    phone_one: string;

    @Column({ type: DataType.STRING(30) })
    phone_two: string | null;

    @Column({ type: DataType.STRING(255), allowNull: false })
    email: string;

    @Column({ type: DataType.STRING(255) })
    email2: string | null;

    @Column({ type: DataType.STRING(100) })
    web: string | null;

    @Column({ type: DataType.JSON })
    logo: FilesSchema[] | null;

    @ForeignKey(() => Empresas)
    @Column({ type: DataType.INTEGER, allowNull: false })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;
}
