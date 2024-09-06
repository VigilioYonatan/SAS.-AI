import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type { MetodosPagoSchema } from "../schemas/metodosPago.schema";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { Empresas } from "./empresas.entity";

@Table
export class MetodosPago
    extends Model
    implements Omit<MetodosPagoSchema, "id">
{
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    enable_efectivo: boolean;

    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    paypal: {
        enabled: boolean;
        paypal_client_id: string | null;
        paypal_secret_key: string | null;
    };

    @Column({
        type: DataType.JSON,
    })
    transferencias: Record<
        string,
        { titular: string | null; dolares: string | null }
    > | null;

    @Column({
        type: DataType.JSON,
    })
    mercado_pago: {
        enabled: boolean;
        token: string | null;
    };
    @Column({
        type: DataType.JSON,
    })
    certificado: FilesSchema[] | null;

    @Column({
        type: DataType.JSON,
    })
    qrYape: FilesSchema[] | null;

    @Column({
        type: DataType.JSON,
    })
    qrPlin: FilesSchema[] | null;

    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;
}
