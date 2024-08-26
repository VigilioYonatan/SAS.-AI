import { InformationEntity } from "@/information/entities/information.entity";
import { PayMethods } from "@/orders/entities/pay_methods.entity";
import { StatusOrders } from "@/orders/entities/status_orders.entity";
import { payMethodsSeeder } from "@/orders/seeders/pay_methods.seeder";
import { statusOrdersSeeder } from "@/orders/seeders/status_orders.seeder";
import { Users } from "@/users/entities/users.entity";
import { adminUser } from "@/users/seeders/users.seeder";
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
import { Departments } from "@/ubigeo/entities/departments.entity";
import { departmentsSeeder } from "@/ubigeo/seeders/departments.seeder";
import { Provinces } from "@/ubigeo/entities/provinces.entity";
import { provincesSeeder } from "@/ubigeo/seeders/provinces.seeder";
import { Districts } from "@/ubigeo/entities/districts.entity";
import { districtsSeeder } from "@/ubigeo/seeders/districts.seeder";
import { Address } from "@/information/entities/address.entity";
import { addressSeeder } from "@/information/seeders/address.seeder";
import { Options } from "@/products/entities/options/options.entity";
import { optionsSeeder } from "@/products/seeders/options.seeder";
import enviroments from "~/config/enviroments.config";
import { TipoServicio } from "@/information/entities/tipo_servicio.entity";
import { servicios } from "@/information/seeders/tipo_empresa.seeder";

@Injectable()
export class SeedersApiService {
    async index() {
        try {
            if (enviroments.NODE_ENV !== "production") {
                await sequelize.sync({ force: true });
            }
            await Promise.all([
                Departments.bulkCreate(departmentsSeeder),
                StatusOrders.bulkCreate(statusOrdersSeeder),
                PayMethods.bulkCreate(payMethodsSeeder),
                Documents.bulkCreate(documentsSeeder),
                KindCreditNotes.bulkCreate(kindCreditNotesSeeder),
                KindDebitNotes.bulkCreate(kindDebitNotesSeeder),
            ]);
            await Promise.all([
                Provinces.bulkCreate(provincesSeeder),
                KindInvoice.bulkCreate(kindInvoiceSeeder),
            ]);
            await Promise.all([Districts.bulkCreate(districtsSeeder)]);
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
            await Promise.all([
                InformationEntity.create(await informationSeeder()),
            ]);
            await Promise.all([Address.bulkCreate(addressSeeder)]);

            // if (enviroments.NODE_ENV === "production") {
            await Promise.all([Users.bulkCreate([adminUser])]);

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
