import {
	Controller,
	Params,
	Post,
	Injectable,
	Res,
	InternalServerErrorException,
	Req,
	Get,
} from "@vigilio/express-core";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync } from "valibot";
import { BackupApiService } from "../services/backup.api.service";
import { custom, string } from "@vigilio/valibot";
import type { Response } from "express";
import archiver from "archiver";
import { pathUploads } from "@/uploads/libs/helpers";
import type { Empresas } from "../entities/empresas.entity";
import fs from "node:fs";
import { VigilioServicesGuard } from "../guards/vigilioservices.guard";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import enviroments from "~/config/enviroments.config";

@Injectable()
@Controller("/backup")
export class BackupApiController {
	constructor(private readonly backupsApiService: BackupApiService) {}

	@VigilioServicesGuard()
	@Pipe(
		objectAsync({
			type: string([
				custom(
					(val) => ["backup", "files", "restart"].includes(val),
					"type error: backup,files,restart ",
				),
			]),
		}),
	)
	@Post("/vigilio/:type")
	async vigilio(
		@Params("type") type: "backup" | "files" | "restart",
		@Res() res: Response,
	) {
		switch (type) {
			case "backup": {
				const result = await this.backupsApiService.backup();
				if (fs.existsSync(`${pathUploads()}/${result.file}`)) {
					res.download(
						`${pathUploads()}/${result.file}`,
						result.file.split("/").at(-1) ?? "backup.sql",
						(err) => {
							if (err) {
								console.error("Error al enviar el archivo:", err);
								res.status(500).send("Error al enviar el archivo");
							}
						},
					);
				} else {
					res.status(404).send("Archivo no encontrado");
				}
				break;
			}
			case "restart": {
				const result = await this.backupsApiService.restart();
				return result;
			}
			case "files": {
				res.setHeader(
					"Content-Disposition",
					`attachment; filename=${enviroments.CLIENT}-archivos.zip`,
				);
				res.setHeader("Content-Type", "application/zip");
				const archive = archiver("zip", {
					zlib: { level: 9 }, // Nivel de compresión
				});
				archive.on("error", (err) => {
					throw new InternalServerErrorException(err.message);
				});
				archive.pipe(res);
				archive.directory(pathUploads(), false);
				archive.finalize();
				break;
			}

			default:
				break;
		}
	}

	@VigilioServicesGuard()
	@Post("/restart-whatsapp")
	async restartWhatsappVersion() {
		const result = await this.backupsApiService.restartWhatsappVersion();
		return result;
	}

	@PermissionAdmin()
	@Get("/")
	async download(@Req("empresa") empresa: Empresas, @Res() res: Response) {
		try {
			const result = await this.backupsApiService.downloadProducts(empresa);
			res.setHeader(
				"Content-Disposition",
				`attachment; filename="backup_empresa_${empresa.slug}.xlsx"`,
			);
			res.setHeader(
				"Content-Type",
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			);
			// Enviar el archivo Excel directamente al cliente
			res.send(result);
		} catch (error) {
			throw new InternalServerErrorException(
				"Error al descargar, comunicarse con empresa, o conexion de internet",
			);
		}
	}
	@PermissionAdmin()
	@Get("/files")
	async downloadFiles(@Req("empresa") empresa: Empresas, @Res() res: Response) {
		try {
			res.setHeader(
				"Content-Disposition",
				`attachment; filename=${empresa.name_empresa}-archivos.zip`,
			);
			res.setHeader("Content-Type", "application/zip");
			const archive = archiver("zip", {
				zlib: { level: 9 }, // Nivel de compresión
			});
			archive.on("error", (err) => {
				throw new InternalServerErrorException(err.message);
			});
			archive.pipe(res);
			archive.directory(`${pathUploads()}/${empresa.slug}`, false);
			archive.finalize();
		} catch (error) {
			throw new InternalServerErrorException(
				"Error al descargar, comunicarse con empresa, o conexion de internet",
			);
		}
	}
}
