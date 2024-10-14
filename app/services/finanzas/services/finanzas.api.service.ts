import type { Empresas } from "@/empresas/entities/empresas.entity";
import { Injectable, NotFoundException } from "@vigilio/express-core";
import { Finanzas } from "../entities/finanzas.entity";
import type { FinanzasStoreDto } from "../dtos/finanzas.store.dto";
import { TipoFinanza } from "../entities/tipo.entity";

@Injectable()
export class FinanzasApiService {
    async index(empresa: Empresas) {
        const data = await Finanzas.findAll({
            where: {
                empresa_id: empresa.id,
            },
        });

        return {
            success: true,
            data,
        };
    }
    async tipos(empresa: Empresas) {
        const data = await TipoFinanza.findAll({
            where: { empresa_id: empresa.id },
        });
        return {
            success: true,
            data,
        };
    }
    async show(empresa: Empresas, code: string) {
        const finanza = await Finanzas.findOne({
            where: { id: Number(code), empresa_id: empresa.id },
        });

        if (!finanza) {
            throw new NotFoundException(
                `No se encontró un proveedor con ${code}`
            );
        }
        return {
            success: true,
            finanza,
        };
    }

    async store(empresa: Empresas, finanzasStoreDto: FinanzasStoreDto) {
        const finanza = new Finanzas({
            ...finanzasStoreDto,
            empresa_id: empresa.id,
        });

        await finanza.save();
        return {
            success: true,
            finanza,
        };
    }
    async update(
        empresa: Empresas,
        id: string,
        finanzasStoreDto: FinanzasStoreDto
    ) {
        const { finanza } = await this.show(empresa, id);
        await finanza.update(finanzasStoreDto);
        return {
            success: true,
            finanza,
        };
    }

    async destroy(empresa: Empresas, id: string) {
        const { finanza } = await this.show(empresa, id);

        await finanza.destroy();
        return {
            success: true,
            message: `Se eliminó correctamente el proveedor ${id}`,
        };
    }
}
