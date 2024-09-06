import { Injectable } from "@vigilio/express-core";
import { Background } from "../entities/background.entity";
import { NotFoundException } from "@vigilio/express-core";
import type { BackgroundStoreDto } from "../dtos/background.store.dto";
import type { BackgroundUpdateDto } from "../dtos/background.update.dto";
import { removeFile } from "@/uploads/libs/helpers";
import { Empresas } from "../entities/empresas.entity";

@Injectable()
export class BackgroundApiService {
    async index(empresa: Empresas) {
        const data = await Background.findAll({
            where: {
                empresa_id: empresa.id,
            },
        });
        return {
            success: true,
            data,
        };
    }
    async show(empresa: Empresas, id: string) {
        const background = await Background.findOne({
            where: {
                id,
                empresa_id: empresa.id,
            },
        });
        if (!background) {
            throw new NotFoundException(
                `No se encontró un reclamo con el id ${id}`
            );
        }
        return {
            success: true,
            background,
        };
    }

    async store(empresa: Empresas, body: BackgroundStoreDto) {
        const background = new Background({
            ...body,
            empresa_id: empresa.id,
        });
        await background.save();
        return {
            success: true,
            background,
        };
    }

    async update(empresa: Empresas, id: string, body: BackgroundUpdateDto) {
        const { background } = await this.show(empresa, id);
        await background.update({ ...body, empresa_id: empresa.id });
        return {
            success: true,
            message: "Editado correctamente background",
        };
    }

    async destroy(empresa: Empresas, id: string) {
        const { background } = await this.show(empresa, id);
        await background.destroy();
        removeFile(empresa.slug, background.image);
        return {
            success: true,
            message: "Background eliminado",
        };
    }
}
