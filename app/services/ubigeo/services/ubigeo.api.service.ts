import { Injectable, NotFoundException } from "@vigilio/express-core";

import type { DepartmentsUpdateDto } from "../dtos/departments.update.dto";
import { Regions } from "../entities/regions.entity";
import { Cities } from "../entities/cities.entity";

@Injectable()
export class UbigeoApiService {
    async regions() {
        const data = await Regions.findAll();
        return {
            success: true,
            data,
        };
    }
    async regionsShow(id: string) {
        const region = await Regions.findByPk(id);
        if (!region) throw new NotFoundException("No se encontró region.");
        return {
            success: true,
            region,
        };
    }
    async regionsUpdate(id: string, body: DepartmentsUpdateDto) {
        const { region } = await this.regionsShow(id);
        await region.update(body);
        return {
            success: true,
            message: "Se actualizó departamento correctamente.",
        };
    }

    async cities() {
        const data = await Cities.findAll();
        return {
            success: true,
            data,
        };
    }
    async citiesShow(id: number) {
        const data = await Cities.findByPk(id);
        if (!data) throw new NotFoundException(`No se encontró ciudad ${id}`);
        return {
            success: true,
            data,
        };
    }
}
