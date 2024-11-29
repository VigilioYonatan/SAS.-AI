import { Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { Questions } from "../entities/questions.entity";
import type { QuestionsStoreDto } from "../dtos/questions.store.dto";
import type { Empresas } from "../entities/empresas.entity";
import type { QuestionsUpdateDto } from "../dtos/questions.update.dto";
import cache from "@vigilio/express-core/cache";

@Injectable()
export class QuestionsApiService {
    async index(empresa: Empresas) {
        const data = await Questions.findAll({
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
        const question = await Questions.findOne({
            where: { id, empresa_id: empresa.id },
        });
        if (!question) {
            throw new NotFoundException(
                `No se encontró un questions con el id ${id}`
            );
        }
        return {
            success: true,
            question,
        };
    }

    async store(empresa: Empresas, body: QuestionsStoreDto) {
        const question = new Questions({ ...body, empresa_id: empresa.id });
        cache.delete(`questions-ia:${empresa.slug}`);
        cache.delete(`${empresa.slug}:questions-count`);
        await question.save();
        return {
            success: true,
            question,
        };
    }
    async update(empresa: Empresas, id: number, body: QuestionsUpdateDto) {
        const { question } = await this.show(empresa, id);
        cache.delete(`questions-ia:${empresa.slug}`);
        cache.delete(`${empresa.slug}:questions-count`);
        await question.update(body);
        return {
            success: true,
            question,
        };
    }

    async destroy(empresa: Empresas, id: number) {
        const { question } = await this.show(empresa, id);
        // const questions = await Questions.findByPk(id);
        cache.delete(`questions-ia:${empresa.slug}`);
        cache.delete(`${empresa.slug}:questions-count`);
        await question.destroy();
        return {
            success: true,
            message: "questions eliminado",
        };
    }
}
