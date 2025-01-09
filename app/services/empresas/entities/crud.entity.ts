import {
    Table,
    Model,
    Column,
    DataType,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import { Empresas } from "./empresas.entity";
import { type CrudSchema } from "../schemas/crud.schema";

@Table
export class Crud extends Model implements Omit<CrudSchema, "id"> {
    @Column({
        type: DataType.STRING(200),
    })
    name: string;

    @Column({
        type: DataType.STRING(200),
    })
    icon: string;

    @Column({
        type: DataType.STRING(200),
    })
    slug: string;

    @Column({
        type: DataType.BOOLEAN,
    })
    isCreatePage: boolean;
    @Column({
        type: DataType.BOOLEAN,
    })
    isDynamicPage: boolean;

    @Column({
        type: DataType.INTEGER,
    })
    paginator: number | null;

    @Column({
        type: DataType.JSON,
    })
    data: CrudSchema["data"];

    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    empresa_id: number;

    @BelongsTo(() => Empresas)
    empresa: unknown;
}
