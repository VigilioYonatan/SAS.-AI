import { Injectable } from "@vigilio/express-core";
import { Suppliers } from "../entities/suppliers.entity";
import { NotFoundException } from "@vigilio/express-core";
import type { SuppliersStoreDto } from "../dtos/suppliers.store.dto";
import { type SuppliersUpdateDto } from "../dtos/suppliers.update.dto";
import { removeFile } from "@/uploads/libs/helpers";
import { generateCodeEntity } from "~/libs/helpers";
import { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
export class SuppliersApiService {
    async index(empresa: Empresas) {
        const data = await Suppliers.findAll({
            where: {
                empresa_id: empresa.id,
            },
        });
        return {
            success: true,
            data,
        };
    }
    async show(empresa: Empresas, code: string) {
        let supplier = null;
        if (!Number.isNaN(Number(code))) {
            supplier = await Suppliers.findOne({
                where: { id: Number(code), empresa_id: empresa.id },
            });
        } else {
            supplier = await Suppliers.findOne({
                where: {
                    supplier_code: code,
                    empresa_id: empresa.id,
                },
            });
        }
        if (!supplier) {
            throw new NotFoundException(
                `No se encontró un proveedor con ${code}`
            );
        }
        return {
            success: true,
            supplier,
        };
    }

    async store(empresa: Empresas, suppliersStoreDto: SuppliersStoreDto) {
        const supplier = new Suppliers(suppliersStoreDto);
        supplier.supplier_code = await generateCodeEntity(
            Suppliers,
            "supplier_code" as keyof Suppliers,
            "PROV",
            empresa
        );
        await supplier.save();
        return {
            success: true,
            supplier,
        };
    }
    async update(
        empresa: Empresas,
        id: string,
        suppliersUpdateDto: SuppliersUpdateDto
    ) {
        const { supplier } = await this.show(empresa, id);
        await supplier.update(suppliersUpdateDto);
        return {
            success: true,
            supplier,
        };
    }

    async destroy(empresa: Empresas, id: string) {
        const { supplier } = await this.show(empresa, id);
        if (supplier.logo) {
            await removeFile(empresa.slug, supplier.logo);
        }
        await supplier.destroy();
        return {
            success: true,
            message: `Se eliminó correctamente el proveedor ${id}`,
        };
    }
}
