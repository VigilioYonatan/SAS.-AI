import {
	Injectable,
	InternalServerErrorException,
} from "@vigilio/express-core";
import { Empresas } from "../entities/empresas.entity";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import type { EmpresasUpdateDto } from "../dtos/empresas.update.dto";
import type { EmpresasFacturacionUpdateDto } from "../dtos/empresas.facturacion.store.dto";
import type { EmpresasIAUpdateDto } from "../dtos/empresas.ia.update.dto";
import type {
	ContactsSchema,
	GroupWhatsapp,
	Payments,
	ScheduleSchema,
	Whatsappconfig,
} from "../schemas/empresas.schema";
import type { EmpresasAddressUpdateDto } from "../dtos/empresas.address.update.dto";
import { Address } from "../entities/address.entity";
import { pathUploads } from "@/uploads/libs/helpers";
import fs from "node:fs";
import type { EmpresasStoreDto } from "../dtos/empresas.store.dto";
import type { MetodosPagoUpdateDto } from "../dtos/metodosPago.update.dto";
import { MetodosPago } from "../entities/metodosPago.entity";
import type { MetodosPagoSchema } from "../schemas/metodosPago.schema";
import { UsersApiService } from "@/users/services/users.api.service";
import { generateId, slug } from "@vigilio/express-core/helpers";
import openai from "openai";
import { Regions } from "@/ubigeo/entities/regions.entity";
import { RegionsEmpresa } from "@/ubigeo/entities/regions_empresa.entity";
import { Countries } from "@/ubigeo/entities/countries.entity";
import { BackgroundApiService } from "./background.api.service";
import { BASE_URL } from "../libs";
import { mesasSeeder } from "../seeders/mesas.seeder";
import { Floors } from "@/orders/entities/floors.entity";
import { terminal } from "~/libs/helpers";
import enviroments from "~/config/enviroments.config";
import { Settings } from "../entities/settings.entity";
import type { SettingsSchema } from "../schemas/settings.schema";
import { NOW, restarDays } from "~/libs/dayjs";
import { initializeBot } from "@/bot/libs/ai";
import { vpsShowApi } from "./backup.api.service";

export let openAis: Record<string, openai> = {};
export async function initial() {
	const empresas = await Empresas.findAll({
		attributes: ["slug", "credentials", "payments", "telegram_token"],
	});
	for (const empresa of empresas) {
		const openAiClient = new openai.OpenAI({
			apiKey: empresa.credentials.open_ai,
		});
		if (empresa.telegram_token) {
			await initializeBot(empresa, empresa.telegram_token);
		}

		openAis = { ...openAis, [empresa.slug]: openAiClient };
	}
}

@Injectable()
export class EmpresasApiService {
	constructor(
		private readonly UsersApiService: UsersApiService,
		private readonly backgroundApiService: BackgroundApiService,
	) {}
	async payment(slug: string) {
		const data = await Empresas.findOne({
			where: { slug },
			attributes: ["payments", "slug", "id", "credentials"],
		});
		if (!data) throw new NotFoundException(`no se encontró ${slug}`);
		return {
			success: true,
			data,
		};
	}
	async paymentUpdate(slug: string, paymentDto: Payments & { token: string }) {
		const { data } = await this.payment(slug);
		await data.update({
			payments: paymentDto,
			credentials: { ...data.credentials, open_ai: paymentDto.token },
		});
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
			throw new NotFoundException(`No se encontró un informacion con ${slug}`);
		}

		return {
			success: true,
			empresa,
		};
	}

	async store(body: EmpresasStoreDto) {
		try {
			const { password, fullname, ...rest } = body;
			const existingEmpresa = await Empresas.findOne({
				where: { slug: body.slug },
			});
			if (existingEmpresa) {
				// Maneja el caso donde el slug ya existe
				throw new Error("El slug ya está en uso");
			}
			const empresa = new Empresas({
				...rest,
				enabled_booster: false,
				enabledBot: true,
				enabledBotWeb: true,
				enabledClientPayComision: false,
				enabled_igv: true,
				isOpen: true,
				enabledAnimation: false,
				enabled_catalogo: true,
				enable_sell_country: false,
				token: `${body.slug}-${generateId().slice(4, 12)}`,
			});
			await empresa.save();
			if (body.servicio_id === 2) {
				await Promise.all(
					mesasSeeder.map(async (floor) => {
						const newFloor = await Floors.create({
							name: floor.name,
							empresa_id: empresa.id,
						});
						await Promise.all(
							floor.mesas.map(async (mesa) => {
								await newFloor.$create("mesa", {
									mesa_code: mesa.mesa_code,
									empresa_id: empresa.id,
								});
							}),
						);
					}),
				);
			}
			await this.backgroundApiService.store(empresa, {
				title: "Los Mejores Precios",
				description: "Bienvenido a nuestra Tienda Online",
				image: [
					{
						file: `${BASE_URL(empresa)}/images/settings/others/slider.jpg`,
						dimension: 1000,
					},
				],
				url: `${BASE_URL(empresa)}/`,
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
			await Promise.all([
				empresa.$create("metodos_pago", {
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
				} as Omit<MetodosPagoSchema, "empresa_id">),
				await empresa.$create("address", {
					city_id: 1,
					urbanizacion: "",
					direccion: "",
					codLocal: "",
				}),
				await empresa.$create("setting", {
					web: body.web,
					host: {
						host: null,
						nameserver_one: null,
						nameserver_two: null,
						time: null,
					},
					about: "",
					bg_color: "rgb(28,141,227)",
					bg_color_responsive: "#1F2025",
					type_border: "square",
					type_cart: "fas fa-shopping-cart",
					icon: null,
					logo: null,
					photo: [
						{
							file: `${BASE_URL(
								empresa,
							)}/images/settings/others/restaurant.jpg`,
							dimension: 800,
						},
					],
					isCoverImage: true,
					isDark: false,
					isScrolling: true,
					hamburger: "fas fa-bars",
					isLogoImage: false,
				} as Omit<SettingsSchema, "id" | "empresa_id">),
			]);
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
				speciality: "",
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
				}),
			);

			if (enviroments.NODE_ENV === "production") {
				const result = await vpsShowApi();
				// crear whatsapp contenedor
				await terminal(
					`docker volume create ${empresa.slug} && docker run -d --name ${
						empresa.slug
					} -e PORT=5000 -e NODE_ENV=${enviroments.NODE_ENV} -e SESSION_NAME=${
						empresa.slug
					} -e VITE_TOKEN_VIGILIO_SERVICES=${
						enviroments.VITE_TOKEN_VIGILIO_SERVICES
					} --restart on-failure:5 --memory="${
						result.vps.whatsapp_ram ?? "500"
					}m" --cpus="0.${
						result.vps.whatsapp_cpu_max ?? "0.4"
					}" -p ${empresa.port}:5000 -v ${empresa.slug}:/app/data ${
						enviroments.DOCKER_IMAGE_WHATSAPP
					}`,
				);
			}

			return {
				success: true,
				message: "Nuevo información agregado correctamente.",
			};
		} catch (error) {
			// biome-ignore lint/suspicious/noConsoleLog: <explanation>
			console.log((error as Error).message);
			throw new InternalServerErrorException("Error al agregar empresa");
		}
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

		if (!metodo) throw new BadRequestException("No se encontró metodo de pago");
		return {
			success: true,
			metodo,
		};
	}
	async metodospago(empresa: Empresas, body: MetodosPagoUpdateDto) {
		const { metodo } = await this.metodos_pago(empresa);
		const data = Object.entries(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			body.transferencias as any,
		).map(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			(body) => Object.values((body as any)[1]).filter((val) => val),
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
		try {
			if (
				empresasUpdateDto.telegram_token &&
				empresasUpdateDto.telegram_token !== empresa.telegram_token &&
				empresa.payments.telegram.enabled &&
				restarDays(
					NOW(empresa).toDate(),
					empresa.payments.telegram.date as Date,
				) > 0
			) {
				await initializeBot(empresa, empresasUpdateDto.telegram_token);
			}

			await empresa.update(empresasUpdateDto);
			return {
				success: true,
				empresa,
			};
		} catch (error) {
			throw new InternalServerErrorException((error as Error).message);
		}
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
		companyStoreDto: EmpresasFacturacionUpdateDto,
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
		empresasIAUpdateDto: EmpresasIAUpdateDto,
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
		const favorites = empresa.contacts.filter((empresa) => empresa.isFavorite);
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
		body: { ia: boolean; isFavorite: boolean },
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
					.startsWith(name.toLowerCase()),
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
			attributes: ["id", "contacts", "groupWhatsapp", "dial_code"],
		});
		if (!empresa) throw new NotFoundException("Error empresas.");
		const existNumero = empresa.contacts.find((cont) =>
			cont.telephone.includes(contactsSchema.telephone),
		);
		if (existNumero)
			throw new BadRequestException("Este numero ya existe en tu contacto", {
				body: "telephone",
			});
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
			cont.telephone.includes(telephone),
		);
		if (!existNumero) throw new BadRequestException("Este numero no existe");
		const filtered = empresa.contacts.filter(
			(num) => num.telephone !== telephone,
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
		body: { schedule: ScheduleSchema[] },
	) {
		await empresa.update({ schedule: body.schedule });
		return {
			success: true,
			message: "Se edito horario de atención correctamente",
		};
	}

	async dominio(empresa: Empresas, body: { host: string | null }) {
		const response = await fetch(
			`${enviroments.VITE_VIGILIO_WEB}/api/empresas/domain/${empresa.slug}`,
			{
				method: "POST",
				body: JSON.stringify({ dominio: body.host }),
				headers: {
					"Content-Type": "application/json",
					"access-token": enviroments.VITE_TOKEN_VIGILIO_SERVICES,
				},
			},
		);
		const result = await response.json();
		if (!result.success) {
			if (result.body) {
				throw new BadRequestException(result.message, { body: "host" });
			}
			throw new InternalServerErrorException(result.message);
		}
		const setting = await Settings.findOne({
			where: {
				empresa_id: empresa.id,
			},
		});
		const time = NOW(empresa).add(1, "minute");
		await setting?.update({
			host: {
				host: body.host,
				nameserver_one: result.name_servers[0],
				nameserver_two: result.name_servers[1],
				time,
			},
		});
		return {
			success: true,
			host: {
				host: body.host,
				nameserver_one: result.name_servers[0],
				nameserver_two: result.name_servers[1],
				time,
			},
		};
	}
	async name_servers(empresa: Empresas) {
		const response = await fetch(
			`${enviroments.VITE_VIGILIO_WEB}/api/empresas/name_servers/${empresa.slug}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "appliation/json",
					"access-token": enviroments.VITE_TOKEN_VIGILIO_SERVICES,
				},
			},
		);
		const result = await response.json();
		if (!result.success) {
			throw new InternalServerErrorException(result.message);
		}
		return result;
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
		const group = empresa.groupWhatsapp.find((group) => group.name === name);
		if (!group) throw new BadRequestException("No se encontró ese grupo");
		const getEmpresas = empresa.contacts
			.map((contact) =>
				group.members.includes(contact.telephone) ? contact : null,
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
			(group) => group.name === body.name,
		);
		if (findGroup)
			throw new BadRequestException(
				`Ya existe grupo con el nombre ${body.name}`,
				{ body: "name" },
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
			(group) => group.name === body.name,
		);
		if (!findGroup)
			throw new BadRequestException(`No existe este grupo ${body.name}`);
		const groupWhatsapp = empresa.groupWhatsapp.map((group) =>
			group.name === body.name
				? { name: body.name, members: body.members }
				: group,
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
			(gro) => gro.name !== group,
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
		telephone: string,
	) {
		const empresa = await Empresas.findOne({
			where: { slug },
			attributes: ["contacts", "groupWhatsapp", "id", "slug"],
		});
		if (!empresa) throw new BadRequestException("No informacion");
		const group = empresa.groupWhatsapp.find((group) => group.name === name);
		if (!group) throw new BadRequestException("No se encontró ese grupo");

		const filterGroup = group.members.filter((member) => member !== telephone);
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
		try {
			const { empresa } = await this.show(id);

			const dir = `${pathUploads()}/${empresa.slug}`;
			if (fs.existsSync(dir)) {
				fs.rmdirSync(dir, { recursive: true });
			}

			await empresa.destroy();
			await terminal(`docker container stop ${empresa.slug}`);
			await terminal(`docker container rm -f ${empresa.slug}`);
			delete openAis[empresa.slug];
			return { success: true, message: "Eliminado correctamente" };
		} catch (error) {
			throw new InternalServerErrorException("Error al eliminar");
		}
	}
}
