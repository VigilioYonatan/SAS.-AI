import type { Empresas } from "@/empresas/entities/empresas.entity";
import { Injectable, NotFoundException } from "@vigilio/express-core";
import { CategoriesFinanzas } from "../entities/categories.entity";
import type { CategoriesFinanzasStoreDto } from "../dtos/categories.store.dto";
import { TipoFinanza } from "../entities/tipo.entity";

@Injectable()
export class CategoriesFinanzasApiService {
	async index(empresa: Empresas) {
		const data = await TipoFinanza.findAll({
			where: {
				empresa_id: empresa.id,
			},
			include: [CategoriesFinanzas],
			order: [["createdAt", "ASC"]],
		});
		return {
			success: true,
			data,
		};
	}
	async show(empresa: Empresas, code: string) {
		const category_finanza = await CategoriesFinanzas.findOne({
			where: { id: Number(code), empresa_id: empresa.id },
		});

		if (!category_finanza) {
			throw new NotFoundException(`No se encontró un proveedor con ${code}`);
		}
		return {
			success: true,
			category_finanza,
		};
	}

	async store(
		empresa: Empresas,
		categoriesFinanzasStoreDto: CategoriesFinanzasStoreDto,
	) {
		const category_finanza = new CategoriesFinanzas({
			...categoriesFinanzasStoreDto,
			empresa_id: empresa.id,
		});

		await category_finanza.save();
		return {
			success: true,
			category_finanza,
		};
	}
	async update(
		empresa: Empresas,
		id: string,
		categoriesFinanzasStoreDto: CategoriesFinanzasStoreDto,
	) {
		const { category_finanza } = await this.show(empresa, id);
		await category_finanza.update(categoriesFinanzasStoreDto);
		return {
			success: true,
			category_finanza,
		};
	}

	async destroy(empresa: Empresas, id: string) {
		const { category_finanza } = await this.show(empresa, id);

		await category_finanza.destroy();
		return {
			success: true,
			message: `Se eliminó correctamente el proveedor ${id}`,
		};
	}
}
