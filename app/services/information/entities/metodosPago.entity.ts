import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type {
    MetodosPagoSchema,
    TransferenciaSchema,
} from "../schemas/metodosPago.schema";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { InformationEntity } from "./information.entity";

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
    transferencias: TransferenciaSchema | null;

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
    qrYape: FilesSchema[] | null;

    @Column({
        type: DataType.JSON,
    })
    qrPlin: FilesSchema[] | null;

    @ForeignKey(() => InformationEntity)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    information_id: number;

    @BelongsTo(() => InformationEntity)
    information: unknown;
}
