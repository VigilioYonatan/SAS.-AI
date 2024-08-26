import { Injectable } from "@vigilio/express-core";
import { TipoServicio } from "../entities/tipo_servicio.entity";
import { TipoEmpresa } from "../entities/tipo_empresa.entity";

@Injectable()
export class ServicioApiService {
    async index() {
        const data = await TipoServicio.findAll();
        return {
            success: true,
            data,
        };
    }

    async empresas(id: string) {
        const data = await TipoEmpresa.findAll({
            where: {
                tipo_servicio_id: id,
            },
        });
        return {
            success: true,
            data,
        };
    }
}
