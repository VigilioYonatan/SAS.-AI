import { BadRequestException, Injectable } from "@vigilio/express-core";
import { pathUploads } from "@/uploads/libs/helpers";
import enviroments from "~/config/enviroments.config";
import fs from "node:fs";
import dayjs from "~/libs/dayjs";
import type { Empresas } from "../entities/empresas.entity";
import { Clients } from "@/users/entities/clients.entity";
import { Users } from "@/users/entities/users.entity";
import XLSX from "xlsx";
import { terminal } from "~/libs/helpers";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";

@Injectable()
export class BackupApiService {
    async backup() {
        const containerName = enviroments.DB_CONTAINER; // Cambia esto por el nombre de tu contenedor
        const username = enviroments.DB_USER;
        const dbname = enviroments.DB_NAME;
        const nameFile = `backup-${dayjs().format("DD-MM-YYYY.HH.mm.ss")}.sql`;

        const containerBackupPath = nameFile; // Ubicación del archivo de backup en el contenedor
        const hostBackupPath = `${pathUploads()}/backup`;
        if (!fs.existsSync(hostBackupPath)) {
            fs.mkdirSync(hostBackupPath);
        }
        const filesql = `${hostBackupPath}/${nameFile}`;

        // Comando para crear el backup dentro del contenedor
        const dumpCommand = `docker exec ${containerName} pg_dump -U ${username} -d ${dbname} -F c -f ${containerBackupPath}`;
        await terminal(dumpCommand);

        // Comando para copiar el archivo de backup del contenedor al host
        const copyCommand = `docker cp ${containerName}:${containerBackupPath} ${filesql}`;
        await terminal(copyCommand);
        const removeCommand = `docker exec ${containerName} rm ${containerBackupPath}`;
        await terminal(removeCommand);
        return {
            success: true,
            message: "backup finalizado correctamente",
            file: `backup/${nameFile}`,
        };
    }

    async restart() {
        try {
            const dumpCommand = `pm2 restart ${enviroments.PM2_ID}`;
            await terminal(dumpCommand);
        } catch (error) {
            throw new BadRequestException(
                "error pm2 - comunicarse con empresa."
            );
        }
    }

    async downloadProducts(empresa: Empresas) {
        try {
            const [products, restaurant, servicios] = await Promise.all([
                ProductsNormal.findAll({
                    where: {
                        empresa_id: empresa.id,
                    },
                }),
                ProductsRestaurant.findAll({
                    where: {
                        empresa_id: empresa.id,
                    },
                }),
                ProductsServicio.findAll({
                    where: {
                        empresa_id: empresa.id,
                    },
                }),
            ]);

            const clients = await Clients.findAll({
                where: { empresa_id: empresa.id },
            });

            const users = await Users.findAll({
                where: { empresa_id: empresa.id },
                attributes: { exclude: ["password"] },
            });

            const workbook = XLSX.utils.book_new();

            const productsSheet = XLSX.utils.json_to_sheet(
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                products.map((p: any) => p.toJSON())
            );
            const serviciosSheet = XLSX.utils.json_to_sheet(
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                servicios.map((p: any) => p.toJSON())
            );
            const restaurantSheet = XLSX.utils.json_to_sheet(
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                restaurant.map((p: any) => p.toJSON())
            );
            const clientsSheet = XLSX.utils.json_to_sheet(
                clients.map((c) => c.toJSON())
            );
            const usersSheet = XLSX.utils.json_to_sheet(
                users.map((u) => u.toJSON())
            );
            if (
                empresa.tipo_empresa.tipo_servicio_id === 1 ||
                empresa.tipo_empresa.tipo_servicio_id === 3
            ) {
                XLSX.utils.book_append_sheet(
                    workbook,
                    productsSheet,
                    "Productos"
                );
            }

            if (empresa.tipo_empresa.tipo_servicio_id === 2) {
                XLSX.utils.book_append_sheet(
                    workbook,
                    restaurantSheet,
                    "Productos"
                );
            }
            if (empresa.tipo_empresa.tipo_servicio_id === 3) {
                XLSX.utils.book_append_sheet(
                    workbook,
                    serviciosSheet,
                    "Servicios"
                );
            }
            XLSX.utils.book_append_sheet(workbook, clientsSheet, "Clientes");
            XLSX.utils.book_append_sheet(workbook, usersSheet, "Usuarios");

            // Escribir los datos del libro a un buffer
            const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "buffer",
            });

            return excelBuffer;
        } catch (error) {
            throw new BadRequestException("ERROR MESSAGE");
        }
    }
}
