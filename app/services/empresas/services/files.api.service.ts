import { Injectable, NotFoundException } from "@vigilio/express-core";
import type { Empresas } from "../entities/empresas.entity";
import { FileSchema } from "../entities/file.entity";
import { removeFile } from "@/uploads/libs/helpers";

@Injectable()
export class FilesApiService {
	async index(empresa: Empresas) {
		const files = await FileSchema.findAll({
			where: { empresa_id: empresa.id },
		});
		return {
			success: true,
			files,
		};
	}
	async store(empresa: Empresas, body: Pick<FileSchema, "file">) {
		const file = new FileSchema({
			file: body.file,
			empresa_id: empresa.id,
		});
		await file.save();
		return {
			success: true,
			file,
		};
	}
	async show(empresa: Empresas, id: string) {
		const file = await FileSchema.findOne({
			where: {
				id,
				empresa_id: empresa.id,
			},
		});
		if (!file) {
			throw new NotFoundException(`No se encontró un archivo con el id ${id}`);
		}
		return {
			success: true,
			file,
		};
	}
	async destroy(empresa: Empresas, id: string) {
		const { file } = await this.show(empresa, id);
		if (file.file) {
			removeFile(empresa.slug, file.file);
		}
		await file.destroy();
		return {
			success: true,
			message: "Eliminado Correctamente.",
		};
	}
}
