import { exec } from "node:child_process";
import util from "node:util";
import { BadRequestException, Injectable } from "@vigilio/express-core";
import { pathUploads } from "@/uploads/libs/helpers";
import enviroments from "~/config/enviroments.config";
import fs from "node:fs";
import dayjs from "~/libs/dayjs";
import type { InformationEntity } from "../entities/information.entity";
import { productEntity } from "@/products/libs";
import { Clients } from "@/users/entities/clients.entity";
import { Users } from "@/users/entities/users.entity";
import XLSX from "xlsx";

const execAsync = util.promisify(exec);
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
        await execAsync(dumpCommand);

        // Comando para copiar el archivo de backup del contenedor al host
        const copyCommand = `docker cp ${containerName}:${containerBackupPath} ${filesql}`;
        await execAsync(copyCommand);
        const removeCommand = `docker exec ${containerName} rm ${containerBackupPath}`;
        await execAsync(removeCommand);
        return {
            success: true,
            message: "backup finalizado correctamente",
            file: `backup/${nameFile}`,
        };
    }

    async restart() {
        try {
            const dumpCommand = `pm2 restart ${enviroments.PM2_ID}`;
            await execAsync(dumpCommand);
        } catch (error) {
            throw new BadRequestException(
                "error pm2 - comunicarse con empresa."
            );
        }
    }

    async downloadProducts(information: InformationEntity) {
        try {
            const Product = productEntity(information.type_empresa_id);
            const products = await Product.findAll({
                where: {
                    information_id: information.id,
                },
            });

            const clients = await Clients.findAll({
                where: { information_id: information.id },
            });

            const users = await Users.findAll({
                where: { information_id: information.id },
                attributes: { exclude: ["password"] },
            });

            const workbook = XLSX.utils.book_new();

            const productsSheet = XLSX.utils.json_to_sheet(
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                products.map((p: any) => p.toJSON())
            );
            const clientsSheet = XLSX.utils.json_to_sheet(
                clients.map((c) => c.toJSON())
            );
            const usersSheet = XLSX.utils.json_to_sheet(
                users.map((u) => u.toJSON())
            );
            XLSX.utils.book_append_sheet(workbook, productsSheet, "Productos");
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
