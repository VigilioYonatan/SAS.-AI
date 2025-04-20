import { Table, Model, Column, DataType, HasOne } from "sequelize-typescript";
import { Empresas } from "./empresas.entity";
import type { ScrappingSchema } from "../schemas/scrapping.schema";
import { V } from "~/libs/helpers";

@Table
export class Scrapping extends Model implements Omit<ScrappingSchema, "id"> {
    @Column({ type: DataType.STRING })
    web_url: string;

    @Column({ type: DataType.INTEGER })
    hours: number;

    @Column({ type: DataType.JSON })
    categories: ScrappingSchema["categories"];

    @Column({ type: DataType.JSON })
    products: ScrappingSchema["products"];

    @Column({ type: DataType.JSON })
    product: ScrappingSchema["product"];

    @Column({ type: DataType.JSON })
    pages: ScrappingSchema["pages"];

    @HasOne(() => Empresas)
    empresa: V<Empresas>;
}
