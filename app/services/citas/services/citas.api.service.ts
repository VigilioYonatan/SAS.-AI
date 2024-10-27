import { BadRequestException, Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { Citas } from "../entities/citas.entities";
import type { CitasStoreDto } from "../dtos/citas.store.dto";
import type { CitasUpdateDto } from "../dtos/citas.update.dto";
import { CitasSettings } from "../entities/citas_settings.entity";
import type { CitasSettingSchema } from "../schemas/citas_settings.schema";
import dayjs from "~/libs/dayjs";
import { Op } from "sequelize";

@Injectable()
export class CitasApiService {
    async index(empresa: Empresas) {
        const data = await Citas.findAll({
            where: {
                empresa_id: empresa.id,
            },
        });
        return {
            success: true,
            data,
        };
    }

    async settingUpdate(
        empresa: Empresas,
        body: Omit<CitasSettingSchema, "id" | "empresa_id">
    ) {
        const citaSetting = await CitasSettings.findOne({
            where: {
                empresa_id: empresa.id,
            },
        });
        if (!citaSetting) throw new BadRequestException("No setting");

        await citaSetting.update(body);
        return {
            success: true,
            message: "Editado correctamente.",
        };
    }

    async show(empresa: Empresas, slug: string) {
        const cita = await Citas.findOne({
            where: { id: slug, empresa_id: empresa.id },
        });
        if (!cita) {
            throw new NotFoundException(`No se encontró una cita con ${slug}`);
        }
        return {
            success: true,
            cita,
        };
    }
    async day(empresa: Empresas, time: string) {
        const day = dayjs(time);
        const startOfDay = day.startOf("day").utc().format();
        const endOfDay = day.endOf("day").utc().format();
        const citas = await Citas.unscoped().findAll({
            where: {
                empresa_id: empresa.id,
                time: {
                    [Op.between]: [startOfDay, endOfDay],
                },
            },
            raw: true,
        });
        const empresasContacts = await Empresas.unscoped().findOne({
            where: { slug: empresa.slug },
            attributes: ["id", "contacts"],
        });
        if (!empresasContacts) throw new NotFoundException("Error empresas.");

        return {
            success: true,
            citas: citas.map((cita) => {
                const contact = empresasContacts.contacts.find(
                    (contact) => contact.telephone === cita.telephone
                );
                return {
                    ...cita,
                    contact,
                };
            }),
        };
    }

    async store(empresa: Empresas, citasStoreDto: CitasStoreDto) {
        const cita = new Citas({
            ...citasStoreDto,
            telephone: `${empresa.dial_code}${citasStoreDto.telephone}@c.us`,
            empresa_id: empresa.id,
        });

        await cita.save();
        return {
            success: true,
            cita,
        };
    }

    async update(
        empresa: Empresas,
        id: string,
        citasUpdateDto: CitasUpdateDto
    ) {
        const { cita } = await this.show(empresa, id);
        await cita.update(citasUpdateDto);
        return {
            success: true,
            cita,
        };
    }

    async destroy(empresa: Empresas, id: string) {
        const { cita } = await this.show(empresa, id);
        await cita.destroy();
        return {
            success: true,
            message: `La cita con el id: ${id} fue eliminado`,
        };
    }
}
