import { Injectable } from "@vigilio/express-core";
import { Background } from "../entities/background.entity";
import { NotFoundException } from "@vigilio/express-core";
import type { BackgroundStoreDto } from "../dtos/background.store.dto";
import type { BackgroundUpdateDto } from "../dtos/background.update.dto";
import { removeFile } from "@/uploads/libs/helpers";
import { InformationEntity } from "../entities/information.entity";

@Injectable()
export class BackgroundApiService {
    async index(information: InformationEntity) {
        const data = await Background.findAll({
            where: {
                information_id: information.id,
            },
        });
        return {
            success: true,
            data,
        };
    }
    async show(information: InformationEntity, id: string) {
        const background = await Background.findOne({
            where: {
                id,
                information_id: information.id,
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

    async store(information: InformationEntity, body: BackgroundStoreDto) {
        const background = new Background({
            ...body,
            where: {
                information_id: information.id,
            },
        });
        await background.save();
        return {
            success: true,
            background,
        };
    }

    async update(
        information: InformationEntity,
        id: string,
        body: BackgroundUpdateDto
    ) {
        const { background } = await this.show(information, id);
        await background.update({ ...body, information_id: information.id });
        return {
            success: true,
            message: "Editado correctamente background",
        };
    }

    async destroy(information: InformationEntity, id: string) {
        const { background } = await this.show(information, id);
        await background.destroy();
        removeFile(information.slug, background.image);
        return {
            success: true,
            message: "Background eliminado",
        };
    }
}
