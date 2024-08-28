import { PayMethods } from "@/orders/entities/pay_methods.entity";
import { StatusOrders } from "@/orders/entities/status_orders.entity";
import { payMethodsSeeder } from "@/orders/seeders/pay_methods.seeder";
import { statusOrdersSeeder } from "@/orders/seeders/status_orders.seeder";
import { Injectable } from "@vigilio/express-core";
import { sequelize } from "~/config/db.config";
import { informationSeeder } from "@/information/seeders/information.seeder";
import { KindInvoice } from "@/orders/entities/kind_invoice.entity";
import { kindInvoiceSeeder } from "@/orders/seeders/kind_invoice.seeder";
import { documentsSeeder } from "@/orders/seeders/documents.seeder";
import { Documents } from "@/orders/entities/documents.entity";
import { KindCreditNotes } from "@/orders/entities/kind_credit_notes.entity";
import { KindDebitNotes } from "@/orders/entities/kind_debit_notes.entity";
import { kindCreditNotesSeeder } from "@/orders/seeders/kind_credit_notes.seeder";
import { kindDebitNotesSeeder } from "@/orders/seeders/kind_debit_notes.seeder";
import { Suppliers } from "@/suppliers/entities/suppliers.entity";
import { suppliersSeeder } from "@/suppliers/seeders/suppliers.seeder";
import { Posts } from "@/posts/entities/posts.entity";
import { postsSeeder } from "@/posts/seeders/posts.seeder";
import { Options } from "@/products/entities/options/options.entity";
import { optionsSeeder } from "@/products/seeders/options.seeder";
import enviroments from "~/config/enviroments.config";
import { TipoServicio } from "@/information/entities/tipo_servicio.entity";
import { servicios } from "@/information/seeders/tipo_empresa.seeder";
import { InformationApiService } from "@/information/services/information.api.service";

@Injectable()
export class SeedersApiService {
    constructor(
        private readonly informationApiService: InformationApiService
    ) {}
    async index() {
        try {
            if (enviroments.NODE_ENV !== "production") {
                await sequelize.sync({ force: true });
            }
            await Promise.all([
                StatusOrders.bulkCreate(statusOrdersSeeder),
                PayMethods.bulkCreate(payMethodsSeeder),
                Documents.bulkCreate(documentsSeeder),
                KindCreditNotes.bulkCreate(kindCreditNotesSeeder),
                KindDebitNotes.bulkCreate(kindDebitNotesSeeder),
            ]);
            //    await ubigeoSeeder()
            await Promise.all([KindInvoice.bulkCreate(kindInvoiceSeeder)]);
            await Promise.all(
                servicios.map(async (servicio) => {
                    const { tipo, empresas } = servicio;
                    const service = await TipoServicio.create({ tipo });
                    await Promise.all(
                        empresas.map(async (empresa) => {
                            await service.$create("tipo_empresa", empresa);
                        })
                    );
                })
            );
            const information = await informationSeeder();
            await this.informationApiService.store({
                ...information,
                fullname: "Yonatan Vigilio",
                password: "123456",
            });
            // await Promise.all([Address.bulkCreate(addressSeeder)]);

            // if (enviroments.NODE_ENV === "production") {

            await Promise.all([Suppliers.bulkCreate(suppliersSeeder)]);
            await Promise.all(
                optionsSeeder.map(async (prod) => {
                    const { features, ...rest } = prod;
                    const option = await Options.create(rest);
                    await Promise.all(
                        features.map(async (feature) => {
                            await option.$create("feature", {
                                value: feature.value,
                                description: feature.description,
                            });
                        })
                    );
                })
            );

            // await Promise.all([Users.bulkCreate([...usersSeeder])]);
            await Promise.all([Posts.bulkCreate(postsSeeder)]);
            return { success: true, message: "Seed executed" };
        } catch (error) {
            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log(error);
            return {
                success: false,
                message: JSON.stringify((error as unknown as Error).message),
            };
        }
    }
}
