import { BadRequestException, Injectable } from "@vigilio/express-core";
import { pathUploads } from "@/uploads/libs/helpers";
import enviroments from "~/config/enviroments.config";
import fs from "node:fs";
import dayjs from "~/libs/dayjs";
import { Empresas } from "../entities/empresas.entity";
import { Users } from "@/users/entities/users.entity";
import XLSXSTYLE from "xlsx-style";
import XLSX from "xlsx";
import { delay, terminal } from "~/libs/helpers";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { Op } from "sequelize";
import { ROLES } from "@/users/libs";
import { newVersionVPS } from "../libs/subdominio";

export async function vpsShowApi(): Promise<{
    success: true;
    vps: {
        ip_principal: string;
        name_vps: string;
        enabled: boolean;
        cpu: number;
        max: number;
        port: number;
        disk: number;
        whatsapp_cpu_max: number | null;
        whatsapp_cpu_low: number | null;
        whatsapp_ram: number | null;
    };
}> {
    const response = await fetch(
        `${enviroments.VITE_VIGILIO_WEB}/api/vps/${enviroments.CLIENT}`
    );
    if (!response.ok) throw new BadRequestException("Error: VPS SHOW ");
    const result = await response.json();
    return result;
}

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

    async restartWhatsappVersion() {
        try {
            const emp = await Empresas.findAll({
                attributes: ["slug", "port", "whatsapp_mode"],
            });
            // solo a las empresas que tiene gratis
            const slugs = emp
                .filter((container) => container.whatsapp_mode.type === "FREE")
                .map((container) => container.slug);
            const command1 = `docker rm -f ${slugs.join(" ")} || true`;
            const command2 = slugs
                .map((slug) => `docker volume rm ${slug} || true`)
                .join(" && ");

            await terminal(command1);
            await terminal(command2);
            const result = await vpsShowApi();
            await terminal(
                `docker rmi ${enviroments.DOCKER_IMAGE_WHATSAPP} || true`
            );
            await Promise.all(
                emp.map(async (emp) => {
                    await terminal(
                        `docker volume create ${
                            emp.slug
                        } && docker run -d --name ${
                            emp.slug
                        } -e PORT=5000 -e NODE_ENV=${
                            enviroments.NODE_ENV
                        } -e SESSION_NAME=${
                            emp.slug
                        } -e VITE_TOKEN_VIGILIO_SERVICES=${
                            enviroments.VITE_TOKEN_VIGILIO_SERVICES
                        } --restart always --memory="${
                            result.vps.whatsapp_ram || "1000"
                        }m" --memory-swap="${
                            result.vps.whatsapp_ram || "1000"
                        }m" --cpus="${result.vps.whatsapp_cpu_max || "1"}" -p ${
                            emp.port
                        }:5000 -v ${emp.slug}:/app/data ${
                            enviroments.DOCKER_IMAGE_WHATSAPP
                        }`
                    );
                })
            );
            return {
                success: true,
                message: "OK",
            };
        } catch (error) {
            throw new BadRequestException((error as Error).message);
        }
    }

    async restart() {
        try {
            const dumpCommand = `git checkout HEAD -- app && git checkout HEAD -- resources/ts && pm2 restart ${enviroments.PM2_ID}`;
            await terminal(dumpCommand);
            await delay(15);
            await terminal("rm -rf app && rm -rf resources/ts");
        } catch (error) {
            throw new BadRequestException(
                "error pm2 - comunicarse con empresa."
            );
        }
    }

    async downloadProducts(empresa: Empresas) {
        try {
            const [products, restaurant, servicios, usuarios, clients] =
                await Promise.all([
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
                    Users.findAll({
                        where: {
                            empresa_id: empresa.id,
                            [Op.not]: {
                                role_id: ROLES.user,
                            },
                        },
                        attributes: [
                            "user_code",
                            "username",
                            "name",
                            "lastname",
                            "email",
                            "address",
                            "telephone",
                            "speciality",
                            "enabled",
                            "birthday",
                            "empresa_id",
                            "createdAt",
                        ],
                    }),
                    Users.findAll({
                        where: { empresa_id: empresa.id, role_id: ROLES.user },
                        attributes: [
                            "name",
                            "address",
                            "telephone",
                            "enabled",
                            "empresa_id",
                        ],
                    }),
                ]);
            const wb = XLSX.utils.book_new();
            function dynamicStyle(
                key: string,
                headers: string[],
                values: string[][]
            ) {
                const ws_data = [
                    [
                        `${key}  (${values.length} UND)`,
                        Array.from({ length: headers.length - 1 }).map(
                            () => ""
                        ),
                    ],
                    [],
                    headers, // Encabezados
                    ...values, // Datos
                ];
                const ws = XLSX.utils.aoa_to_sheet(ws_data);

                const abecedarios = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
                // Aplica estilos al título
                ws.A1.s = {
                    font: { bold: true, sz: 14, color: { rgb: "000000" } },
                    alignment: { horizontal: "center" },
                    fill: {
                        fgColor: { rgb: "FFFFFF" }, // Color de fondo para el título
                    },
                };
                // Fusionar celdas A1:G1 para el título
                ws["!merges"] = [
                    { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
                ];
                headers.forEach((_, i) => {
                    ws[`${abecedarios[i as keyof typeof abecedarios]}3`].s = {
                        font: { bold: true, color: { rgb: "FFFFFF" } },
                        fill: {
                            fgColor: {
                                rgb: empresa.setting.bg_color.startsWith("#")
                                    ? empresa.setting.bg_color
                                          .replace("#", "")
                                          .toUpperCase()
                                    : empresa.setting.bg_color.toUpperCase(),
                            },
                        },
                    };
                });

                XLSX.utils.book_append_sheet(wb, ws, key);
            }
            if (products.length) {
                dynamicStyle(
                    "Productos",
                    [
                        "id",
                        "CODIGO",
                        "NOMBRE",
                        "PRECIO",
                        "DESCUENTO",
                        "URL",
                        "DISPONIBLE",
                        "CATEGORIA",
                        "MARCA",
                        "REGISTRADO",
                    ],
                    products.map((prod, i) => [
                        `${i + 1}`,
                        prod.product_code,
                        prod.name,
                        prod.price.toFixed(2),
                        prod.discount.toString(),
                        prod.url,
                        prod.enabled ? "✔" : "❌",
                        prod.category_id.toString(),
                        prod.brand_id ? prod.brand_id.toString() : "❌",
                        dayjs(prod.createdAt).format("DD-MM-YYYY") || "",
                    ])
                );
            }
            if (servicios.length) {
                dynamicStyle(
                    "Servicios",
                    [
                        "id",
                        "CODIGO",
                        "NOMBRE",
                        "PRECIO",
                        "DESCUENTO",
                        "URL",
                        "DISPONIBLE",
                        "CATEGORIA",
                        "REGISTRADO",
                    ],
                    servicios.map((prod, i) => [
                        `${i + 1}`,
                        prod.product_code,
                        prod.name,
                        prod.price.toFixed(2),
                        prod.discount.toString(),
                        prod.url,
                        prod.enabled ? "✔" : "❌",
                        prod.category_id.toString(),
                        dayjs(prod.createdAt).format("DD-MM-YYYY") || "",
                    ])
                );
            }
            if (restaurant.length) {
                dynamicStyle(
                    "Productos",
                    [
                        "id",
                        "CODIGO",
                        "NOMBRE",
                        "PRECIO",
                        "DESCUENTO",
                        "URL",
                        "DISPONIBLE",
                        "CATEGORIA",
                        "REGISTRADO",
                    ],
                    restaurant.map((prod, i) => [
                        `${i + 1}`,
                        prod.product_code,
                        prod.name,
                        prod.price.toFixed(2),
                        prod.discount ? prod.discount.toString() : "0",
                        prod.url ? prod.url : "",
                        prod.enabled ? "✔" : "❌",
                        prod.category_id ? prod.category_id.toString() : "",
                        dayjs(prod.createdAt).format("DD-MM-YYYY") || "",
                    ])
                );
            }
            dynamicStyle(
                "Usuarios",
                [
                    "ID",
                    "CODIGO",
                    "USUARIO",
                    "NOMBRE",
                    "APELLIDOS",
                    "CORREO",
                    "DIRECCION",
                    "TELEFONO",
                    "ESPECIALIDAD",
                    "DISPONIBLE",
                    "NACIMIENTO",
                    "REGISTRADO",
                ],
                usuarios.map((usuario, i) => [
                    `${i + 1}`,
                    usuario.user_code,
                    usuario.username || "",
                    usuario.name || "",
                    usuario.lastname || "",
                    usuario.email || "",
                    usuario.address || "",
                    `+${empresa.dial_code} ${usuario.telephone}` || "",
                    usuario.speciality || "",
                    usuario.enabled ? "✔" : "❌",
                    dayjs(usuario.birthday).format("DD-MM-YYYY") || "",
                    dayjs(usuario.createdAt).format("DD-MM-YYYY") || "",
                ])
            );

            dynamicStyle(
                "Clientes",
                [
                    "ID",
                    "NOMBRE COMPLETO",
                    "TELEFONO",
                    "DIRECCIÓN",
                    "HABILITADO",
                ],
                clients.map((client, i) => [
                    `${i + 1}`,
                    client.name,
                    client.telephone,
                    client.address || "",
                    client.enabled ? "✔" : "❌",
                ])
            );
            const excelBuffer = XLSXSTYLE.write(wb, {
                bookType: "xlsx",
                type: "buffer",
            });

            return excelBuffer;
        } catch (error) {
            throw new BadRequestException("ERROR MESSAGE");
        }
    }

    async newVersion(empresa: Empresas) {
        const response = await fetch(
            `${enviroments.VITE_VIGILIO_WEB}/api/version/by_latest/${empresa.slug}/${empresa.versionamiento}`
        );
        const result: {
            success: boolean;
            commando: string;
            message: string;
            latest_version: {
                id: number;
                versionamiento: string;
                is_latest: boolean;
                description: string;
                sql_command: string;
                changes: string[];
                enabled: boolean;
            };
            vps: {
                ip: string;
                password: string;
            };
        } = await response.json();
        if (!result.success) {
            throw new BadRequestException(result.message);
        }
        await Empresas.update(
            { versionamiento: result.latest_version.versionamiento },
            {
                where: {
                    slug: empresa.slug,
                },
            }
        );

        await newVersionVPS({
            commando: result.commando,
            ip: result.vps.ip,
            password: result.vps.password,
        });
        return {
            success: true,
            message: "new version executed",
        };
    }
}
