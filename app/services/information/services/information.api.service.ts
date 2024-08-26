import { Injectable } from "@vigilio/express-core";
import { InformationEntity } from "../entities/information.entity";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import type { InformationUpdateDto } from "../dtos/information.update.dto";
import type { InformationFacturacionUpdateDto } from "../dtos/information.facturacion.store.dto";
import type { InformationIAUpdateDto } from "../dtos/information.ia.update.dto";
import type {
    ContactsSchema,
    GroupWhatsapp,
    ScheduleSchema,
    Whatsappconfig,
} from "../schemas/information.schema";
import type { InformationAddressUpdateDto } from "../dtos/information.address.update.dto";
import { Address } from "../entities/address.entity";
import { productEntity } from "@/products/libs";
import { pathUploads, removeFile } from "@/uploads/libs/helpers";
import { Invoices } from "@/orders/entities/invoices.entity";
import fs from "node:fs";
import { Users } from "@/users/entities/users.entity";
import { clients, openAis } from "@/bot/libs/ai";
import path from "node:path";
import { Notes } from "@/orders/entities/notes.entity";
import { Guides } from "@/orders/entities/guides.entity";
import type { InformationStoreDto } from "../dtos/information.store.dto";

@Injectable()
export class InformationApiService {
    async showVigilio(slug: string) {
        const data = await InformationEntity.findOne({
            where: { slug },
            attributes: ["groupWhatsapp", "company"],
        });
        return {
            success: true,
            data,
        };
    }

    async show(slug: string) {
        let information = null;
        if (!Number.isNaN(Number(slug))) {
            information = await InformationEntity.findByPk(Number(slug), {
                attributes: {
                    exclude: ["company", "groupWhatsapp"],
                },
            });
        } else {
            information = await InformationEntity.findOne({
                where: {
                    slug,
                },
                attributes: {
                    exclude: ["company", "groupWhatsapp"],
                },
            });
        }

        if (!information) {
            throw new NotFoundException(
                `No se encontró un informacion con ${slug}`
            );
        }

        return {
            success: true,
            information,
        };
    }

    async store(body: InformationStoreDto) {
        const information = new InformationEntity(body);
        await information.save();
        return {
            success: true,
            message: "Nuevo información agregado correctamente.",
        };
    }
    async private(slug: string) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: {
                exclude: ["groupWhatsapp"],
            },
        });

        if (!information) {
            // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
            throw new NotFoundException(`No se encontró un informacion`);
        }
        return {
            success: true,
            information,
        };
    }

    async update(
        information: InformationEntity,
        informationUpdateDto: InformationUpdateDto
    ) {
        const data = Object.entries(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            informationUpdateDto.transferencias as any
        ).map(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (body) => Object.values((body as any)[1]).filter((val) => val)
        );
        // aca si  esta vacio entonces que sea null
        informationUpdateDto.transferencias =
            data[0].length || data[1].length || data[2].length
                ? informationUpdateDto.transferencias
                : null;

        await information.update(informationUpdateDto);
        return {
            success: true,
            information,
        };
    }
    async whatsappConfigUpdate(slug: string, whatsappconfig: Whatsappconfig) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["id", "whatsappconfig"],
        });
        if (!information) throw new NotFoundException("Error information.");
        await information.update({ whatsappconfig });
        return {
            success: true,
            message: "Se actualizó correctamente los mensajes de whatsapp",
        };
    }
    async company(
        information: InformationEntity,
        companyStoreDto: InformationFacturacionUpdateDto
    ) {
        // to reutilize if company no update certificado
        await information.update({
            company: companyStoreDto,
        });
        return {
            success: true,
            information,
        };
    }
    async inteligenceArtificial(
        slug: string,
        informationIAUpdateDto: InformationIAUpdateDto
    ) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["inteligenceArtificial", "id"],
        });
        if (!information) throw new BadRequestException("No informacion");
        // to reutilize if company no update certificado
        await information.update({
            inteligenceArtificial: informationIAUpdateDto.inteligenceArtificial,
        });
        return {
            success: true,
            message:
                "Se modificó correctamente el prompt de tu inteligencia Artificial.",
        };
    }
    async all(slug: string) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!information) throw new NotFoundException("Error information.");
        return { success: true, data: information.contacts };
    }
    async favorites(slug: string) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!information) throw new NotFoundException("Error information.");
        // to reutilize if company no update certificado
        const favorites = information.contacts.filter(
            (contact) => contact.isFavorite
        );
        return { success: true, favorites };
    }

    async address(
        information: InformationEntity,
        body: InformationAddressUpdateDto
    ) {
        const address = (await information.$get("address")) as Address;
        await address.update(body);
        return {
            success: true,
            message: "Se realizo correctamente los cambios",
        };
    }

    async contacts(
        slug: string,
        telephone: string,
        body: { ia: boolean; isFavorite: boolean }
    ) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!information) throw new NotFoundException("Error information.");
        if (!information.contacts || !information.contacts.length)
            throw new BadRequestException("No hay contactos");

        const newChanges = information.contacts.map((contacto) => {
            if (contacto.telephone === telephone) {
                return { ...contacto, ...body };
            }
            return contacto;
        });
        await information.update({
            contacts: newChanges,
        });
        return {
            success: true,
            message: "Se realizo correctamente los cambios",
        };
    }
    async searchContact(slug: string, name: string) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!information) throw new NotFoundException("Error information.");
        const findByNameContacts = information.contacts
            .filter((contact) =>
                (contact.telephone ?? contact.name ?? "")
                    .toLowerCase()
                    .startsWith(name.toLowerCase())
            )
            .slice(0, 10);
        return {
            success: true,
            data: findByNameContacts,
        };
    }

    async contactStore(slug: string, contactsSchema: ContactsSchema) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!information) throw new NotFoundException("Error information.");
        const existNumero = information.contacts.find((cont) =>
            cont.telephone.includes(contactsSchema.telephone)
        );
        if (existNumero)
            throw new BadRequestException(
                "Este numero ya existe en tu contacto",
                {
                    body: "telephone",
                }
            );
        await information.update({
            contacts: [
                ...information.contacts,
                {
                    ...contactsSchema,
                    telephone: `51${contactsSchema.telephone}@c.us`,
                },
            ],
        });
        return {
            success: true,
            message: "Se agregó nuevo contacto correctamente",
        };
    }
    async contactDestroy(slug: string, telephone: string) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!information) throw new NotFoundException("Error information.");
        const existNumero = information.contacts.find((cont) =>
            cont.telephone.includes(telephone)
        );
        if (!existNumero)
            throw new BadRequestException("Este numero no existe");
        const filtered = information.contacts.filter(
            (num) => num.telephone !== telephone
        );
        await information.update({
            contacts: filtered,
        });
        return {
            success: true,
            message: "Se agregó nuevo contacto correctamente",
        };
    }
    async scheduleUpdate(
        information: InformationEntity,
        body: { schedule: ScheduleSchema[] }
    ) {
        await information.update({ schedule: body.schedule });
        return {
            success: true,
            message: "Se edito horario de atención correctamente",
        };
    }
    async whatsappGroupIndex(slug: string) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id"],
        });
        if (!information) return;
        return { success: true, data: information.groupWhatsapp };
    }
    async whatsappGroupShow(slug: string, name: string) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id"],
        });
        if (!information) throw new BadRequestException("No informacion");
        const group = information.groupWhatsapp.find(
            (group) => group.name === name
        );
        if (!group) throw new BadRequestException("No se encontró ese grupo");
        const getInformation = information.contacts
            .map((contact) =>
                group.members.includes(contact.telephone) ? contact : null
            )
            .filter((contact) => contact);

        return { success: true, group: { ...group, members: getInformation } };
    }
    async whatsappGroupStore(slug: string, body: GroupWhatsapp) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id"],
        });
        if (!information) throw new BadRequestException("No informacion");
        const findGroup = information.groupWhatsapp?.find(
            (group) => group.name === body.name
        );
        if (findGroup)
            throw new BadRequestException(
                `Ya existe grupo con el nombre ${body.name}`,
                { body: "name" }
            );
        const groupWhatsapp = [...(information.groupWhatsapp || []), body];
        await information.update({ groupWhatsapp });
        return {
            success: true,
            message: "Se agregó nuevo grupo whatsapp",
        };
    }

    async whatsappGroupUpdate(slug: string, body: GroupWhatsapp) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id"],
        });
        if (!information) throw new BadRequestException("No informacion");
        const findGroup = information.groupWhatsapp?.find(
            (group) => group.name === body.name
        );
        if (!findGroup)
            throw new BadRequestException(`No existe este grupo ${body.name}`);
        const groupWhatsapp = information.groupWhatsapp.map((group) =>
            group.name === body.name
                ? { name: body.name, members: body.members }
                : group
        );
        await information.update({ groupWhatsapp });
        return {
            success: true,
            message: "Se edito los miembros de whatsapp whatsapp",
        };
    }
    async whatsappGroupDestroy(slug: string, group: string) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!information) throw new NotFoundException("Error information.");
        const groupWhatsapp = information!.groupWhatsapp.filter(
            (gro) => gro.name !== group
        );

        await information.update({ groupWhatsapp });
        return {
            success: true,
            message: "Se eliminó grupo de whatsapp correctamente",
        };
    }
    async whatsappGroupTelephoneDestroy(
        slug: string,
        name: string,
        telephone: string
    ) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id", "slug"],
        });
        if (!information) throw new BadRequestException("No informacion");
        const group = information.groupWhatsapp.find(
            (group) => group.name === name
        );
        if (!group) throw new BadRequestException("No se encontró ese grupo");

        const filterGroup = group.members.filter(
            (member) => member !== telephone
        );
        const groupWhatsapp = information.groupWhatsapp.map((group) => {
            if (group.name === name) {
                return { ...group, members: filterGroup };
            }
            return group;
        });

        await information!.update({ groupWhatsapp });
        return {
            success: true,
            message: `Se eliminó telephone del grupo ${name}  correctamente`,
        };
    }

    async destroy(id: string) {
        const { information } = await this.show(id);
        const Product = productEntity(information.type_empresa_id);
        const [products, users, invoices, notes, guides] = await Promise.all([
            Product.findAll({
                where: { information_id: information.id },
                attributes: ["images", "information_id"],
            }),
            Users.findAll({
                where: { information_id: information.id },
                attributes: ["photo", "information_id"],
            }),
            Invoices.findAll({
                where: {
                    information_id: information.id,
                },
                attributes: ["information_id", "cdr_path", "xml_path"],
            }),
            Notes.findAll({
                where: {
                    information_id: information.id,
                },
                attributes: ["information_id", "cdr_path", "xml_path"],
            }),
            Guides.findAll({
                where: {
                    information_id: information.id,
                },
                attributes: ["information_id", "cdr_path", "xml_path"],
            }),
        ]);
        for (const product of products) {
            removeFile(information.slug, product.images);
        }
        for (const user of users) {
            if (user.photo) {
                removeFile(information.slug, user.photo);
            }
        }
        for (const invoice of invoices) {
            const filecdr = `${pathUploads()}/${invoice.cdr_path}`;
            const filexml = `${pathUploads()}/${invoice.xml_path}`;
            if (fs.existsSync(filecdr)) {
                fs.unlinkSync(filecdr);
            }
            if (fs.existsSync(filexml)) {
                fs.unlinkSync(filexml);
            }
        }
        for (const note of notes) {
            const filecdr = `${pathUploads()}/${note.cdr_path}`;
            const filexml = `${pathUploads()}/${note.xml_path}`;
            if (fs.existsSync(filecdr)) {
                fs.unlinkSync(filecdr);
            }
            if (fs.existsSync(filexml)) {
                fs.unlinkSync(filexml);
            }
        }
        for (const guide of guides) {
            const filecdr = `${pathUploads()}/${guide.cdr_path}`;
            const filexml = `${pathUploads()}/${guide.xml_path}`;
            if (fs.existsSync(filecdr)) {
                fs.unlinkSync(filecdr);
            }
            if (fs.existsSync(filexml)) {
                fs.unlinkSync(filexml);
            }
        }
        delete clients[information.slug];
        delete openAis[information.slug];
        const qr = `${pathUploads()}/${information.slug}/qr/${
            information.slug
        }-qr.png`;
        const whatsappauth = path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            "..",
            ".wwebjs_auth",
            `session-${information.slug}`
        );

        if (fs.existsSync(qr)) {
            fs.unlinkSync(qr);
        }
        if (fs.existsSync(whatsappauth)) {
            fs.rmSync(whatsappauth, { force: true, recursive: true });
        }
        await information.destroy();
    }
}
