import { Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { Complaints } from "../entities/complaints.entity";
import type { ComplaintsStoreDto } from "../dtos/complaints.store.dto";
import type { Empresas } from "../entities/empresas.entity";

@Injectable()
export class ComplaintsApiService {
    async index(empresa: Empresas) {
        const data = await Complaints.findAll({
            where: {
                empresa_id: empresa.id,
            },
        });
        return {
            success: true,
            data,
        };
    }

    async show(empresa: Empresas, id: number) {
        const complaint = await Complaints.findOne({
            where: { id, empresa_id: empresa.id },
        });
        if (!complaint) {
            throw new NotFoundException(
                `No se encontró un reclamo con el id ${id}`
            );
        }
        return {
            success: true,
            complaint,
        };
    }

    async store(empresa: Empresas, body: ComplaintsStoreDto) {
        const complaint = new Complaints({
            ...body,
            empresa_id: empresa.id,
        });
        await complaint.save();
        return {
            success: true,
            complaint,
        };
    }

    async destroy(empresa: Empresas, id: number) {
        const { complaint } = await this.show(empresa, id);
        // const complaint = await Complaints.findByPk(id);
        await complaint.destroy();
        return {
            success: true,
            message: "Reclamo eliminado",
        };
    }
}
