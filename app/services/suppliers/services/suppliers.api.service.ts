import { Injectable } from "@vigilio/express-core";
import { Suppliers } from "../entities/suppliers.entity";
import { NotFoundException } from "@vigilio/express-core";
import type { SuppliersStoreDto } from "../dtos/suppliers.store.dto";
import { type SuppliersUpdateDto } from "../dtos/suppliers.update.dto";
import { removeFile } from "@/uploads/libs/helpers";
import { generateCodeEntity } from "~/libs/helpers";
import { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
export class SuppliersApiService {
	async index(information: InformationEntity) {
		const data = await Suppliers.findAll({
			where: {
				information_id: information.id,
			},
		});
		return {
			success: true,
			data,
		};
	}
	async show(information: InformationEntity, code: string) {
		let supplier = null;
		if (!Number.isNaN(Number(code))) {
			supplier = await Suppliers.findOne({
				where: { id: Number(code), information_id: information.id },
			});
		} else {
			supplier = await Suppliers.findOne({
				where: {
					supplier_code: code,
					information_id: information.id,
				},
			});
		}
		if (!supplier) {
			throw new NotFoundException(`No se encontró un proveedor con ${code}`);
		}
		return {
			success: true,
			supplier,
		};
	}

	async store(
		information: InformationEntity,
		suppliersStoreDto: SuppliersStoreDto,
	) {
		const supplier = new Suppliers(suppliersStoreDto);
		supplier.supplier_code = await generateCodeEntity(
			Suppliers,
			"supplier_code" as keyof Suppliers,
			"PROV",
			information,
		);
		await supplier.save();
		return {
			success: true,
			supplier,
		};
	}
	async update(
		information: InformationEntity,
		id: string,
		suppliersUpdateDto: SuppliersUpdateDto,
	) {
		const { supplier } = await this.show(information, id);
		await supplier.update(suppliersUpdateDto);
		return {
			success: true,
			supplier,
		};
	}

	async destroy(information: InformationEntity, id: string) {
		const { supplier } = await this.show(information, id);
		if (supplier.logo) {
			removeFile(information.slug, supplier.logo);
		}
		await supplier.destroy();
		return {
			success: true,
			message: `Se eliminó correctamente el proveedor ${id}`,
		};
	}
}
