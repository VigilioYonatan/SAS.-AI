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
import type { V } from "~/libs/helpers";

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
    paypal: MetodosPagoSchema["paypal"];

    @Column({
        type: DataType.JSON,
    })
    izipay: MetodosPagoSchema["izipay"];

    @Column({
        type: DataType.JSON,
    })
    stripe: MetodosPagoSchema["stripe"];

    @Column({
        type: DataType.JSON,
    })
    transferencias: MetodosPagoSchema["transferencias"];

    @Column({
        type: DataType.JSON,
    })
    mercado_pago: MetodosPagoSchema["mercado_pago"];

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
    empresa: V<Empresas>;
}
