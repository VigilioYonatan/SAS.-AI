import { Injectable } from "@vigilio/express-core";
import { Empresas } from "../entities/empresas.entity";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import type { EmpresasUpdateDto } from "../dtos/empresas.update.dto";
import type { EmpresasFacturacionUpdateDto } from "../dtos/empresas.facturacion.store.dto";
import type { EmpresasIAUpdateDto } from "../dtos/empresas.ia.update.dto";
import type {
    ContactsSchema,
    GroupWhatsapp,
    ScheduleSchema,
    Whatsappconfig,
} from "../schemas/empresas.schema";
import type { EmpresasAddressUpdateDto } from "../dtos/empresas.address.update.dto";
import { Address } from "../entities/address.entity";
import { pathUploads, removeFile } from "@/uploads/libs/helpers";
import { Invoices } from "@/orders/entities/invoices.entity";
import fs from "node:fs";
import { Users } from "@/users/entities/users.entity";
import path from "node:path";
import { Notes } from "@/orders/entities/notes.entity";
import { Guides } from "@/orders/entities/guides.entity";
import type { EmpresasStoreDto } from "../dtos/empresas.store.dto";
import type { MetodosPagoUpdateDto } from "../dtos/metodosPago.update.dto";
import { MetodosPago } from "../entities/metodosPago.entity";
import type { PaymentDto } from "@/payments/dtos/payment.dto";
import type { MetodosPagoSchema } from "../schemas/metodosPago.schema";
import { UsersApiService } from "@/users/services/users.api.service";
import { slug } from "@vigilio/express-core/helpers";
import openai from "openai";
import { Regions } from "@/ubigeo/entities/regions.entity";
import { RegionsEmpresa } from "@/ubigeo/entities/regions_empresa.entity";
import { Countries } from "@/ubigeo/entities/countries.entity";
import { Product } from "@/products/libs";
import { BackgroundApiService } from "./background.api.service";
import { BASE_URL } from "../libs";

export let openAis: Record<string, openai> = {};

@Injectable()
export class EmpresasApiService {
    constructor(
        private readonly UsersApiService: UsersApiService,
        private readonly backgroundApiService: BackgroundApiService
    ) {}
    async payment(slug: string) {
        const data = await Empresas.findOne({
            where: { slug },
            attributes: ["payments", "slug", "id"],
        });
        if (!data) throw new NotFoundException(`no se encontró ${slug}`);
        return {
            success: true,
            data,
        };
    }
    async paymentUpdate(slug: string, paymentDto: PaymentDto) {
        const { data } = await this.payment(slug);
        await data.update({ payments: paymentDto });
        return {
            success: true,
            data,
        };
    }

    async show(slug: string) {
        let empresa = null;
        if (!Number.isNaN(Number(slug))) {
            empresa = await Empresas.findByPk(Number(slug), {
                attributes: {
                    exclude: ["company", "groupWhatsapp"],
                },
            });
        } else {
            empresa = await Empresas.findOne({
                where: {
                    slug,
                },
                attributes: {
                    exclude: ["company", "groupWhatsapp"],
                },
            });
        }

        if (!empresa) {
            throw new NotFoundException(
                `No se encontró un informacion con ${slug}`
            );
        }

        return {
            success: true,
            empresa,
        };
    }

    async store(body: EmpresasStoreDto) {
        const { password, fullname, ...rest } = body;
        const empresa = new Empresas({
            ...rest,
            enabled_booster: false,
            enabledBot: true,
            enabledBotWeb: true,
            enabledClientPayComision: true,
            enabled_igv: true,
            isOpen: true,
            enable_sell_country: false,
        });
        await empresa.save();
        await this.backgroundApiService.store(empresa, {
            title: "Los Mejores Precios",
            description: "Bienvenido a nuestra Tienda Online",
            image: [
                {
                    file: `${BASE_URL(
                        empresa
                    )}/images/settings/others/slider.jpg`,
                    dimension: 1000,
                },
            ],
            url: "/",
        });
        const transferencias = {} as Record<
            keyof typeof empresa.bancos,
            { titular: null; dolares: null }
        >;
        for (const banco of empresa.bancos) {
            transferencias[banco.key as keyof typeof empresa.bancos] = {
                titular: null,
                dolares: null,
                [empresa.money.simbolo]: null,
            };
        }
        // como hacer qeu sea {[bank.key]:{titular:null}}
        await empresa.$create("metodos_pago", {
            transferencias,
            enable_efectivo: true,
            mercado_pago: { token: null, enabled: false },
            qrYape: null,
            qrPlin: null,
            paypal: {
                enabled: false,
                paypal_client_id: null,
                paypal_secret_key: null,
            },
        } as Omit<MetodosPagoSchema, "empresa_id">);
        await empresa.$create("address", {
            city_id: 1,
            urbanizacion: "",
            direccion: "",
            codLocal: "",
        });
        await empresa.$create("setting", {
            web: body.web,
            host: null,
            about: "",
            bg_color: "#117ACD",
            bg_color_responsive: "rgb(38, 38, 39)",
            type_border: "square",
            type_cart: "far fa-shopping-cart",
            icon: null,
            logo: null,
            photo: null,
        });
        const username = `${fullname}${Math.random().toString(32).slice(3, 4)}`;
        const name = fullname.split(" ");
        await this.UsersApiService.store(empresa, {
            name: name[0],
            lastname: name[1] ?? "",
            email: null,
            password,
            telephone: empresa.telephoneFirst,
            username,
            enabled: true,
            address: null,
            birthday: new Date(),
            slug: slug(username),
            role_id: 1,
            empresa_id: empresa.id,
        });
        const openAiClient = new openai.OpenAI({
            apiKey: empresa.credentials.open_ai,
        });

        openAis = { ...openAis, [empresa.slug]: openAiClient };

        const regions = await Regions.findAll({
            include: [
                {
                    model: Countries,
                    where: {
                        code: empresa.dial_code,
                    },
                    required: true,
                },
            ],
        });
        await Promise.all(
            regions.map(async (region) => {
                await RegionsEmpresa.create({
                    region_id: region.id,
                    empresa_id: empresa.id,
                    days: 3,
                    enabled: true,
                    priceShipping: 0,
                });
            })
        );

        // crear whatsapp contenedor
        // await terminal(
        //     `docker volume create ${empresas.slug} && docker run -d --name ${empresas.slug} -e PORT=5000 -e NODE_ENV=${enviroments.NODE_ENV} -e SESSION_NAME=${empresas.slug} -e VITE_TOKEN_VIGILIO_SERVICES=${enviroments.VITE_TOKEN_VIGILIO_SERVICES} --memory="250m" --cpus="0.05" -p ${empresas.port}:5000 -v ${empresas.slug}:/app/data ${enviroments.DOCKER_IMAGE_WHATSAPP}`
        // );
        return {
            success: true,
            message: "Nuevo información agregado correctamente.",
        };
    }
    async private(slug: string) {
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: {
                exclude: ["groupWhatsapp"],
            },
        });

        if (!empresa) {
            // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
            throw new NotFoundException(`No se encontró un informacion`);
        }
        return {
            success: true,
            empresa,
        };
    }
    async metodos_pago(empresa: Empresas) {
        const metodo = await MetodosPago.findOne({
            where: {
                empresa_id: empresa.id,
            },
        });

        if (!metodo)
            throw new BadRequestException("No se encontró metodo de pago");
        return {
            success: true,
            metodo,
        };
    }
    async metodospago(empresa: Empresas, body: MetodosPagoUpdateDto) {
        const { metodo } = await this.metodos_pago(empresa);
        const data = Object.entries(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            body.transferencias as any
        ).map(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (body) => Object.values((body as any)[1]).filter((val) => val)
        );

        // aca si  esta vacio entonces que sea null
        body.transferencias =
            data[0].length || data[1].length || data[2].length
                ? body.transferencias
                : null;

        await metodo.update(body);
        return {
            success: true,
            message: "Editado correctamente",
        };
    }
    async update(empresa: Empresas, empresasUpdateDto: EmpresasUpdateDto) {
        await empresa.update(empresasUpdateDto);
        return {
            success: true,
            empresa,
        };
    }
    async whatsappConfigUpdate(slug: string, whatsappconfig: Whatsappconfig) {
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: ["id", "whatsappconfig"],
        });
        if (!empresa) throw new NotFoundException("Error empresas.");
        await empresa.update({ whatsappconfig });
        return {
            success: true,
            message: "Se actualizó correctamente los mensajes de whatsapp",
        };
    }
    async company(
        empresa: Empresas,
        companyStoreDto: EmpresasFacturacionUpdateDto
    ) {
        // to reutilize if company no update certificado
        await empresa.update({
            company: companyStoreDto,
        });
        return {
            success: true,
            empresa,
        };
    }
    async inteligenceArtificial(
        slug: string,
        empresasIAUpdateDto: EmpresasIAUpdateDto
    ) {
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: ["inteligenceArtificial", "id"],
        });
        if (!empresa) throw new BadRequestException("No informacion");
        // to reutilize if company no update certificado
        await empresa.update({
            inteligenceArtificial: empresasIAUpdateDto.inteligenceArtificial,
        });
        return {
            success: true,
            message:
                "Se modificó correctamente el prompt de tu inteligencia Artificial.",
        };
    }
    async all(slug: string) {
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!empresa) throw new NotFoundException("Error empresas.");
        return { success: true, data: empresa.contacts };
    }
    async favorites(slug: string) {
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!empresa) throw new NotFoundException("Error empresas.");
        // to reutilize if company no update certificado
        const favorites = empresa.contacts.filter(
            (empresa) => empresa.isFavorite
        );
        return { success: true, favorites };
    }

    async address(empresa: Empresas, body: EmpresasAddressUpdateDto) {
        const address = (await empresa.$get("address")) as Address;
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
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!empresa) throw new NotFoundException("Error empresas.");
        if (!empresa.contacts || !empresa.contacts.length)
            throw new BadRequestException("No hay contactos");

        const newChanges = empresa.contacts.map((contacto) => {
            if (contacto.telephone === telephone) {
                return { ...contacto, ...body };
            }
            return contacto;
        });
        await empresa.update({
            contacts: newChanges,
        });
        return {
            success: true,
            message: "Se realizo correctamente los cambios",
        };
    }
    async searchContact(slug: string, name: string) {
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!empresa) throw new NotFoundException("Error empresas.");
        const findByNameContacts = empresa.contacts
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
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!empresa) throw new NotFoundException("Error empresas.");
        const existNumero = empresa.contacts.find((cont) =>
            cont.telephone.includes(contactsSchema.telephone)
        );
        if (existNumero)
            throw new BadRequestException(
                "Este numero ya existe en tu contacto",
                {
                    body: "telephone",
                }
            );
        await empresa.update({
            contacts: [
                ...empresa.contacts,
                {
                    ...contactsSchema,
                    telephone: `${empresa.dial_code}${contactsSchema.telephone}@c.us`,
                },
            ],
        });
        return {
            success: true,
            message: "Se agregó nuevo contacto correctamente",
        };
    }
    async contactDestroy(slug: string, telephone: string) {
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!empresa) throw new NotFoundException("Error empresas.");
        const existNumero = empresa.contacts.find((cont) =>
            cont.telephone.includes(telephone)
        );
        if (!existNumero)
            throw new BadRequestException("Este numero no existe");
        const filtered = empresa.contacts.filter(
            (num) => num.telephone !== telephone
        );
        await empresa.update({
            contacts: filtered,
        });
        return {
            success: true,
            message: "Se agregó nuevo contacto correctamente",
        };
    }
    async scheduleUpdate(
        empresa: Empresas,
        body: { schedule: ScheduleSchema[] }
    ) {
        await empresa.update({ schedule: body.schedule });
        return {
            success: true,
            message: "Se edito horario de atención correctamente",
        };
    }
    async whatsappGroupIndex(slug: string) {
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id"],
        });
        if (!empresa) return;
        return { success: true, data: empresa.groupWhatsapp };
    }
    async whatsappGroupShow(slug: string, name: string) {
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id"],
        });
        if (!empresa) throw new BadRequestException("No informacion");
        const group = empresa.groupWhatsapp.find(
            (group) => group.name === name
        );
        if (!group) throw new BadRequestException("No se encontró ese grupo");
        const getEmpresas = empresa.contacts
            .map((contact) =>
                group.members.includes(contact.telephone) ? contact : null
            )
            .filter((contact) => contact);

        return { success: true, group: { ...group, members: getEmpresas } };
    }
    async whatsappGroupStore(slug: string, body: GroupWhatsapp) {
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id"],
        });
        if (!empresa) throw new BadRequestException("No informacion");
        const findGroup = empresa.groupWhatsapp?.find(
            (group) => group.name === body.name
        );
        if (findGroup)
            throw new BadRequestException(
                `Ya existe grupo con el nombre ${body.name}`,
                { body: "name" }
            );
        const groupWhatsapp = [...(empresa.groupWhatsapp || []), body];
        await empresa.update({ groupWhatsapp });
        return {
            success: true,
            message: "Se agregó nuevo grupo whatsapp",
        };
    }

    async whatsappGroupUpdate(slug: string, body: GroupWhatsapp) {
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id"],
        });
        if (!empresa) throw new BadRequestException("No informacion");
        const findGroup = empresa.groupWhatsapp?.find(
            (group) => group.name === body.name
        );
        if (!findGroup)
            throw new BadRequestException(`No existe este grupo ${body.name}`);
        const groupWhatsapp = empresa.groupWhatsapp.map((group) =>
            group.name === body.name
                ? { name: body.name, members: body.members }
                : group
        );
        await empresa.update({ groupWhatsapp });
        return {
            success: true,
            message: "Se edito los miembros de whatsapp whatsapp",
        };
    }
    async whatsappGroupDestroy(slug: string, group: string) {
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!empresa) throw new NotFoundException("Error empresas.");
        const groupWhatsapp = empresa!.groupWhatsapp.filter(
            (gro) => gro.name !== group
        );

        await empresa.update({ groupWhatsapp });
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
        const empresa = await Empresas.findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id", "slug"],
        });
        if (!empresa) throw new BadRequestException("No informacion");
        const group = empresa.groupWhatsapp.find(
            (group) => group.name === name
        );
        if (!group) throw new BadRequestException("No se encontró ese grupo");

        const filterGroup = group.members.filter(
            (member) => member !== telephone
        );
        const groupWhatsapp = empresa.groupWhatsapp.map((group) => {
            if (group.name === name) {
                return { ...group, members: filterGroup };
            }
            return group;
        });

        await empresa!.update({ groupWhatsapp });
        return {
            success: true,
            message: `Se eliminó telephone del grupo ${name}  correctamente`,
        };
    }

    async destroy(id: string) {
        const { empresa } = await this.show(id);
        const [products, users, invoices, notes, guides] = await Promise.all([
            Product(empresa).findAll({
                where: { empresa_id: empresa.id },
                attributes: ["images", "empresa_id"],
            }),
            Users.findAll({
                where: { empresa_id: empresa.id },
                attributes: ["photo", "empresa_id"],
            }),
            Invoices.findAll({
                where: {
                    empresa_id: empresa.id,
                },
                attributes: ["empresa_id", "cdr_path", "xml_path"],
            }),
            Notes.findAll({
                where: {
                    empresa_id: empresa.id,
                },
                attributes: ["empresa_id", "cdr_path", "xml_path"],
            }),
            Guides.findAll({
                where: {
                    empresa_id: empresa.id,
                },
                attributes: ["empresa_id", "cdr_path", "xml_path"],
            }),
        ]);
        for (const product of products) {
            removeFile(empresa.slug, product.images);
        }
        for (const user of users) {
            if (user.photo) {
                removeFile(empresa.slug, user.photo);
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
        // delete clientsWhatsapp[empresas.slug];
        // delete clientsTelegram[empresas.slug];
        delete openAis[empresa.slug];
        const qr = `${pathUploads()}/${empresa.slug}/qr/${empresa.slug}-qr.png`;
        const whatsappauth = path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            "..",
            ".wwebjs_auth",
            `session-${empresa.slug}`
        );

        if (fs.existsSync(qr)) {
            fs.unlinkSync(qr);
        }
        if (fs.existsSync(whatsappauth)) {
            fs.rmSync(whatsappauth, { force: true, recursive: true });
        }
        await empresa.destroy();
        return { success: true, message: "Eliminado correctamente" };
    }
}
