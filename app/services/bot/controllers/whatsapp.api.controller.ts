import { Empresas } from "@/empresas/entities/empresas.entity";
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	Query,
	Req,
	Res,
} from "@vigilio/express-core";
import type WAWebJS from "whatsapp-web.js";
import {
	whatsappGetQrApi,
	whatsappSendFileApi,
	whatsappSendMessageApi,
	whatsappSendSeenApi,
	whatsappSendTypingApi,
	type WhatsappSendFileApi,
} from "../api";
import { delay, randomNumber, terminal } from "~/libs/helpers";
import {
	buenosDias,
	featuresIA,
	gracias,
	isWhatsappTelegramIA,
	updateTokensEmpresa,
} from "../libs/ai";
import { NOW } from "~/libs/dayjs";
import { interpretarImagen, promptReplace, transcribeAudio } from "../libs";
import { openAis } from "@/empresas/services/empresas.api.service";
import formidable from "formidable";
import type { RequestVigilio } from "~/config/types";
import fs from "node:fs";
import cron from "node-cron";
import type { Response } from "express";
import { NodeSSH } from "node-ssh";
import { vpsShowApi } from "@/empresas/services/backup.api.service";
import enviroments from "~/config/enviroments.config";
import { Citas } from "@/citas/entities/citas.entities";
import cache from "@vigilio/express-core/cache";
import { Op } from "sequelize";
export let chats: Record<string, ["assistant" | "user", string][]> = {};
export const chatsWait: Record<string, string[]> = {};

@Controller("/whatsapp")
export class whatsappApiController {
	@Post("/ready")
	async ready(
		@Body()
		client: { contacts: { name: string; id: { _serialized: string } }[] },
		@Req("empresa") info: Empresas,
	) {
		const empresa = await Empresas.findOne({
			where: { slug: info.slug },
			attributes: ["id", "contacts", "slug"],
		});
		if (!empresa) throw new BadRequestException("Server error");
		if (!empresa.contacts.length || empresa.contacts.length < 10) {
			const contacts = client.contacts;
			const mappedcontacts = contacts.map((contact) => ({
				name: contact.name!,
				telephone: contact.id._serialized,
				isFavorite: false,
				ia: true,
			}));
			await empresa.update({ contacts: mappedcontacts });
		}
		await empresa?.update({ enabledBot: true });

		return {
			success: true,
			message: "OK",
		};
	}

	@Post("/receive-message")
	async receiveMessage(
		@Req("empresa") info: Empresas,
		@Body()
		body: {
			type: string;
			isGroup: boolean;
			content: string | Buffer;
			from: string;
			notifyName: string;
			quotedMessageId: string;
		},
	) {
		let content = body.content;
		const userId = body.from;
		try {
			const whatsapp = await isWhatsappTelegramIA(info.slug, userId);

			if (!whatsapp) throw new BadRequestException("whatsapp no permited");
			if (!info?.enabledBot)
				throw new BadRequestException("whatsapp desabilitado");

			const { clientVigilio, latestEmpresaUsage, empresa } = whatsapp;

			if (body.isGroup) throw new BadRequestException("whatsapp no permited"); //no se admite grupos
			// message.type: chat,sticker,ptt,image,document
			if (!["ptt", "chat", "image"].includes(body.type)) return;
			const opt: WAWebJS.MessageSendOptions =
				Math.random() < 0.5
					? {
							quotedMessageId: body.quotedMessageId,
						}
					: {};
			if (body.type === "ptt") {
				const audioToTxt = await transcribeAudio(
					empresa.slug,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					Buffer.from((content as any).data),
				);
				content = audioToTxt.text;
			}
			if (body.type === "image") {
				const imageText = await interpretarImagen(
					whatsapp,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					Buffer.from((content as any).data),
				);
				if (imageText === "null") {
					await whatsappSendMessageApi(empresa, {
						message: "No se pudo analizar esta imagen o no se encontró 😢.",
						telephone: userId,
						options: opt,
						delay: 3,
					});
					return {
						success: true,
						message: "executed",
					};
				}
				content = `Buscame en la BASE DE DATOS SI HAY '${imageText}'`;
			}

			const existNumber = empresa.contacts.find(
				(contact) => contact.telephone === userId,
			);
			if (!existNumber) {
				const mappedcontacts = [
					...empresa.contacts,
					{
						name: body.notifyName,
						telephone: userId,
						isFavorite: false,
						ia: true,
					},
				];
				await empresa.update({ contacts: mappedcontacts });
				cache.delete(`EMPRESA:${empresa.id}`);
				cache.delete(`EMPRESA:${empresa.slug}`);
			}
			const random = randomNumber(
				empresa.inteligenceArtificial.timer.start,
				empresa.inteligenceArtificial.timer.finish,
			);
			// imporante que esto este acá
			chats[`${info.slug}:${userId}`] = [
				...(chats[`${info.slug}:${userId}`] ?? []),
				["user", content as string],
			];
			chatsWait[`${info.slug}:${userId}`] = [
				...(chatsWait[`${info.slug}:${userId}`] ?? []),
				content as string,
			];
			await delay(random);

			const isSimilar = chatsWait[`${info.slug}:${userId}`].at(-1) === content;

			if (!isSimilar) {
				chats[`${info.slug}:${userId}`] = chats[
					`${info.slug}:${userId}`
				].filter(([assistant, val]) => assistant === "user" && val !== content);
				return { success: true, message: "executed" };
			}
			chats[`${info.slug}:${userId}`] = chats[`${info.slug}:${userId}`].map(
				([assistant, val]) => {
					if (assistant === "user" && val === content) {
						return [assistant, chatsWait[`${info.slug}:${userId}`].join(", ")];
					}
					return [assistant, val];
				},
			);

			chatsWait[`${info.slug}:${userId}`] = [];

			// delay en 5 - 15 segundos
			// await whatsappSendTypingApi(empresa, {
			//     telephone: userId,
			//     delay: random,
			// });
			//  cuando cierra el restaurante
			// const findDay = empresa.schedule.find(
			//     (day) => day.id === NOW(empresa).day()
			// );
			// if (
			//     NOW(empresa).isAfter(formatTime(empresa, findDay!.openTime)) &&
			//     NOW(empresa).isBefore(formatTime(empresa, findDay!.closeTime))
			// ) {
			// } else {
			//     throw new BadRequestException("cerrado");
			// }

			const buenas = buenosDias(content as string, body.notifyName, empresa);
			const thanks = gracias(content as string);

			if (buenas) {
				// aveces que responda reply

				await whatsappSendMessageApi(empresa, {
					message: buenas,
					telephone: userId,
					options: opt,
					delay: 3,
				});
				return {
					success: true,
					message: "OK",
				};
			}
			if (thanks) {
				await whatsappSendMessageApi(empresa, {
					message: thanks,
					telephone: userId,
					options: opt,
					delay: 3,
				});

				return {
					success: true,
					message: "OK",
				};
			}

			if (chats[`${info.slug}:${userId}`]) {
				const messages = chats[`${info.slug}:${userId}`].map(
					([role, content]) => ({
						role,
						content,
					}),
				);

				// Si el primer mensaje en lastMessages no es del role

				const prompt = await promptReplace(content as string, empresa);
				const settingsCitas = empresa.citasSetting;

				let citas: Citas[] = JSON.parse(
					cache.get(`citas:${empresa.slug}`) ?? "null",
				);
				const now = NOW(empresa).utc().format();
				const after = NOW(empresa)
					.add(settingsCitas.max_days, "days")
					.utc()
					.format();
				if (!citas) {
					citas = await Citas.unscoped().findAll({
						where: {
							empresa_id: empresa.id,
							date: {
								[Op.between]: [now, after],
							},
						},
						attributes: { exclude: ["createdAt", "updatedAt"] },
					});
					cache.set(
						`citas:${empresa.slug}`,
						JSON.stringify(citas),
						60 * 1000 * 2,
					);
				}

				const citasJSON = settingsCitas.enabled
					? `***** CITAS/REUNION ******
                            --- BASE DE DATOS DE CITAS---
                            ${JSON.stringify(
															citas.map((c) => ({
																...c,
																telefono: c.telephone,
															})),
														)} 
                            .
                            - REVISA LA BASE DE DATOS DE CITAS, antes de hacerme las preguntas.
                            - ANTES DE HACERMES LAS PREGUNTAS VERIFICA LA BASE DE DATOS DE HORARIO,MAXIMO DE CITAS POR TELEFONO: ${
															settingsCitas.maxCitas
														}, MAXIMO DE CITA POR HORA DE SEPARACION: ${
															settingsCitas.maxCitasForHour
														}.
                            - ----- HORARIO PARA CITAS ---: ${JSON.stringify(
															settingsCitas.horario,
														)}. si está enabled false, quiere decir que no está disponible ese dia.  te pase las horas de abrir y cerrar para crear citas y los dias y está separado por  ${
															settingsCitas.max_minutes
														} minutos, ejemplo "si es 45 minutos de separacion y inicia a las 8am mostra los horarios 8:, 8:45,9:30,...etc", OJO ${
															settingsCitas.max_minutes
														} MINUTOS DE SEPARACIÓN, psdt no me traigas todo el horario completo, solo recomiendame una hora y la cercana y temprana nomas y no me digas lo que acabo de decir y cuando mandas la hora usa AM Y PM .
                          -  OJO no realizar citas, de horas que no estan entre  el horario ejemplo openTime es a las 8 am, y cierra a las 10pm , solo creame citas en esas horas.
                            - IMPORTANTE: MÁXIMO ${
															settingsCitas.maxCitas
														} CITAS PARA CREAR cita por telefono ${userId} EN LA BASE DE DATOS DE CITA:  citas, ASI evitar que se cree muchas citas con mismo telefono ${userId}.
                          - 
                            - Si mandas listas o opciones algo asi, por favor hazlo bonito en formato whatsapp, separado bonito.
                            Ojo cuando te digo que  quiero una cita. debes hacermes estas preguntas antes de crear una cita, OJO no inventes preguntas:
                            Preguntas:
                            - ${JSON.stringify(settingsCitas.questions)}.
                            Recuerda que algunas preguntas tienen opciones, las opciones deben estar correctas segun la pregunta con sus opciones y no inventes preguntas que no te dije porfavor.
                            - IMPORTANTE: Recuerda que no debo crear más de ${
															settingsCitas.maxCitasForHour
														} citas por hora, eso quiere decir que si ya hay más de ${
															settingsCitas.maxCitasForHour
														} citas en la hora que te dije. ya no crees.
                            -  Despues de las preguntas, pasa la lista de dia de hoy de las horas disponible, claro buscas de la base de dato las horas disponible, si te pido de mañana o de otro dia me lo das tambien.,
                            - Desde la fecha actual ${NOW(empresa).format(
															"YYYY-MM-DD hh:mm A",
														)} - maximo ${
															settingsCitas.max_days
														} dias desde la fecha de hoy, ${
															settingsCitas.isNextDay
																? "que no sea desde el mismo dia. tiene que ser un dia despues, y que no sea afuera de la hora . ni ayer ni hoy. para el dia siguiente la cita"
																: "Puedes crear cita desde hoy. claro despues de las horas de ahorita"
														} .
                            - Por favor ${
															settingsCitas.sendQuestionChunk
																? "Hazme las preguntas de uno a uno"
																: "Hazme las preguntas de una sola, y no uno por uno."
														}.
                            -IMPORTANTE: despues de hacerme todas las preguntas , hazme confirmar para crear cita .
                            - Cuando tengas todos mis datos para crear cita con mis datos EJEMPLO. DI ESTO [[DATOS_CONFIRMADOS:{"la pregunta completa y original que me hiciste de lo que te mande que digas, menos la fecha y hora":"respuesta de que te dije"}]]", . tambien agregame  "date" y "hour" en el json, con [[DATOS_CONFIRMADOS:{"pregunta":"respuesta","hour":" "hora" que "te" en el JSON dije ejemplo:08:00, 12:00,22:00 sin el AM Y PM","date":"fecha formato utc para guardar en base de datos"} ]], porfavor que el json este limpio para usarlo con JSON.parse() . 
                            - Solo dime es [[DATOS_CONFIRMADOS:{...]] en el primer parrafo y en el segundo parrafo, ahi si dime, te esperamos pronto " más la fecha y hora que fue creado la cita", ${
															settingsCitas.sendAlert > 0
																? `En el 3er parrafo, dime "Se te enviará un mensaje ${settingsCitas.sendAlert} horas antes de tu cita para notificarte de tu cita."`
																: ""
														}  .
                            - No seas tecnico al responderme
                            - Si quiero cancelar CITA, busca este telefono ${userId} en base de datos de citas. dile que no se encontró cita. y si hay preguntame. Estas seguro de cancelar cita a las (la hora de base de datos de la cita encontrada)?- y si digo si. dí esto [[CANCELADO_CITA]]".
                            - no me preguntes mi telefono cual es por que este es mi telefono ${userId}.
                            - NO DIGAS QUE VAS A VERIFICAR SI TENGO UNA CITA
                            **** FORMATO DEL TEXTO ****
                            -IMPORTANTE: RESPONDEME EN FORMATO DE TEXTO WHATSAPP.
                            - EN LAS PREGUNTAS O PALABRAS IMPORTANTES QUE DIGAS USA *, EJEMPLO: *PREGUNTA_O_PALABRA_IMPORTANTE*, menos los que estan en [[EJEMPLO:{json}]].
                            `
					: "";

				const completion = await openAis[info.slug].chat.completions.create({
					model: clientVigilio
						? clientVigilio.information.modelai
						: "gpt-4o-mini",
					max_tokens: empresa.inteligenceArtificial.max_length,
					messages: [
						{
							role: "user",
							content: `${prompt}.
                                ${citasJSON}
                                por ultimo responde bonito en formato whatsapp y cuando mandes listas separalos en \n format whatsapp para que se vea bien y separados y no se vea todo junto el texto. gracias.`,
						},
						{
							role: "assistant",
							content: "Entendido, Empezemos.",
						}, // getting start
						...messages.slice(-empresa.inteligenceArtificial.memory), // solos los ultimo 7 mensajes
					],
				});

				// actualizamos uso de tokens
				await updateTokensEmpresa(empresa, latestEmpresaUsage, completion);
				// get message ai
				const completionText = completion.choices[0].message.content!;

				const regex2 = /\[\{CANCELADO_CITA\}\}/;
				const match2 = completionText.match(regex2);
				if (match2) {
					const findCita = await Citas.findOne({
						where: {
							telefono: userId,
						},
					});
					if (findCita) {
						await findCita.destroy();
						await whatsappSendMessageApi(empresa, {
							message: "Se canceló la cita correctamente.",
							telephone: userId,
							options: opt,
							delay: 3,
						});
						return;
					}
				}
				const regex = /\[\[DATOS_CONFIRMADOS:(.*?)\]\]/;
				const match = completionText.match(regex);
				if (match) {
					const { hour, date, ...rest } = JSON.parse(match[1]);
					const citas = await Citas.findAll({
						where: {
							date: {
								[Op.between]: [now, after],
							},
							telephone: userId,
						},
						attributes: {
							exclude: ["createdAt", "updatedAt"],
						},
					});
					if (citas.length > settingsCitas.maxCitas) {
						const message =
							"Ops, Al parecer ya pasaste el limite para crear citas. Quieres cancelar una cita?";
						chats[`${empresa.slug}:${userId}`] = [
							...(chats[`${empresa.slug}:${userId}`] || []),
							["assistant", message],
						];
						await whatsappSendMessageApi(empresa, {
							message: message,
							telephone: userId,
							options: opt,
							delay: 3,
						});
						return {
							success: true,
							message: "Enviado correctamente",
						};
					}

					await Citas.create({
						telephone: userId,
						date,
						hour,
						answers: rest,
						empresa_id: empresa.id,
					});

					// if (settingsCitas.sendAlert > 0) {
					//     const fechaUTC5 = new Date(time);
					//     fechaUTC5.setHours(
					//         fechaUTC5.getHours() - settingsCitas.sendAlert
					//     );
					//     sendMessageCron({
					//         empresa,
					//         userId,
					//         date: fechaUTC5,
					//         name: body.notifyName,
					//     });
					// }
					const message = completionText
						.replace(regex, "")
						.replace(/\s{2,}/g, "\n");
					await whatsappSendMessageApi(empresa, {
						message: message,
						telephone: userId,
						options: opt,
						delay: 3,
					});
					return {
						success: true,
						message: "Enviado correctamente",
					};
				}
				const [removeNote, urlExtraidas] = await featuresIA(
					empresa,
					completionText,
					true,
				);

				chats[`${info.slug}:${userId}`] = [
					...(chats[`${info.slug}:${userId}`] || []),
					["assistant", removeNote],
				];

				if (empresa.inteligenceArtificial.isChunk) {
					const chunks = removeNote.split(/(?<!\d)\.\s+/g);
					for (const chunk of chunks) {
						await whatsappSendMessageApi(empresa, {
							message: chunk,
							telephone: userId,
							options: opt,
							delay: 3,
						});
					}
				} else {
					await whatsappSendMessageApi(empresa, {
						message: removeNote,
						telephone: userId,
						options: opt,
						delay: 3,
					});
				}

				// enviar imagen
				if (urlExtraidas.length) {
					for (const url of urlExtraidas) {
						const options = {
							sendMediaAsSticker: true,
						};
						await whatsappSendFileApi(empresa, {
							telephone: userId,
							url,
							options,
							delay: 3,
						});
					}
				}
			}

			return {
				success: true,
				message: "OK",
			};
		} catch (error) {
			chats[`${info.slug}:${userId}`] = [];
		}
	}
	@Post("/send-message")
	async sendMessage(
		@Req("empresa") empresa: Empresas,
		@Query("telephone") telephone: string,
		@Body()
		body: {
			message: string;
			options?: WAWebJS.MessageSendOptions;
		},
	) {
		try {
			const result = await whatsappSendMessageApi(empresa, {
				...body,
				telephone,
				delay: 0,
			});
			return result;
		} catch (error) {
			throw new BadRequestException("POSIBLE ERROR: conectar a Whatsapp");
		}
	}

	@Post("/send-file")
	async sendFile(@Req() req: RequestVigilio) {
		const form = formidable();
		const [fields, files] = await form.parse(req);
		const empresa = req.empresa;
		const file = files.file
			? new File(
					[await fs.promises.readFile(files.file[0].filepath)],
					files.file[0].originalFilename ?? "archivo",
					{
						type: files.file[0].mimetype!,
					},
				)
			: null;
		const data: WhatsappSendFileApi = {
			file,
			telephone: (req.query as { telephone: string }).telephone,
			name: fields.name ? fields.name![0] : null,
			options: fields.option ? JSON.parse(fields.option![0]) : null,
			url: fields.url ? JSON.parse(fields.url[0]) : null,
			delay: 0,
		};
		const result = await whatsappSendFileApi(empresa, data);
		return result;
	}

	// send-seen

	@Post("/send-seen")
	async sendSeen(
		@Req("empresa") empresa: Empresas,
		@Query("telephone") telephone: string,
	) {
		const result = await whatsappSendSeenApi(empresa, { telephone });
		return result;
	}
	@Post("/send-typing")
	async sendTyping(
		@Req("empresa") empresa: Empresas,
		@Body()
		body: {
			delay: number;
		},
		@Query("telephone") telephone: string,
	) {
		const result = await whatsappSendTypingApi(empresa, {
			...body,
			telephone,
		});
		return result;
	}
	@Post("/disconnected")
	async disconnected(@Req("empresa") emp: Empresas) {
		await Empresas.update({ enabledBot: false }, { where: { slug: emp.slug } });
		return {
			success: true,
			message: "OK",
		};
	}
	@Post("/restart")
	async restart(@Req("empresa") empresa: Empresas) {
		await Empresas.update(
			{ timeWhatsapp: NOW(empresa).add(1, "minute").format() },
			{ where: { slug: empresa.slug } },
		);
		if (empresa.whatsapp_mode.type === "VPS") {
			function onSSH() {
				return new Promise((res, _) => {
					const ssh = new NodeSSH();
					// Función para conectar por SSH
					ssh
						.connect({
							host: empresa.whatsapp_mode.ip!,
							username: "root",
							password: empresa.whatsapp_mode.password!,
						})
						.then(() => {
							// biome-ignore lint/suspicious/noConsoleLog: <explanation>
							console.log("Conectado correctamente a vps");
							const commands = `docker exec ${empresa.slug} sh -c "rm -rf ${empresa.slug}-qr.png && rm -rf .wwebjs_auth && rm -rf .wwebjs_cache" && docker restart ${empresa.slug} `;
							return ssh.execCommand(commands);
						})
						.then((result) => {
							// biome-ignore lint/suspicious/noConsoleLog: <explanation>
							console.log(`STDOUT: ${result.stdout}`);
							console.error(`STDERR: ${result.stderr}`);
							res(true);
						})
						.catch(() => {
							res(true);
						})
						.finally(() => {
							ssh.dispose();
						});
				});
			}
			await onSSH();
		} else {
			const comando = `docker exec ${empresa.slug} sh -c "rm -rf ${empresa.slug}-qr.png && rm -rf .wwebjs_auth && rm -rf .wwebjs_cache" && docker restart ${empresa.slug} `;
			// biome-ignore lint/suspicious/noConsoleLog: <explanation>
			console.log(`Ejecutando comando: ${comando}`);
			await terminal(comando, true);
			// biome-ignore lint/suspicious/noConsoleLog: <explanation>
			console.log("Ejecutó correctamente");
		}

		return {
			success: true,
			message: "Se reinició correctamente.",
		};
	}
	@Post("/update")
	async update(@Req("empresa") empresa: Empresas) {
		if (empresa.whatsapp_mode.type === "VPS") {
			function onSSH() {
				return new Promise((res, _) => {
					const ssh = new NodeSSH();
					// Función para conectar por SSH
					ssh
						.connect({
							host: empresa.whatsapp_mode.ip!,
							username: "root",
							password: empresa.whatsapp_mode.password!,
						})
						.then(async () => {
							// biome-ignore lint/suspicious/noConsoleLog: <explanation>
							console.log("Conectado correctamente a vps");
							const command1 = `docker rm -f ${empresa.slug} || true`;
							const command2 = `docker volume rm ${empresa.slug} || true`;

							// Ejecutar los comandos en el servidor SSH
							await ssh.execCommand(command1);
							await ssh.execCommand(command2);

							// Obtener información de la API
							const result = await vpsShowApi();

							// Eliminar la imagen de Docker
							await ssh.execCommand(
								`docker rmi ${enviroments.DOCKER_IMAGE_WHATSAPP} || true`,
							);

							// Crear el volumen y ejecutar el contenedor Docker
							await ssh.execCommand(
								`docker volume create ${empresa.slug} && docker run -d --name ${
									empresa.slug
								} -e PORT=5000 -e NODE_ENV=${
									enviroments.NODE_ENV
								} -e SESSION_NAME=${
									empresa.slug
								} -e VITE_TOKEN_VIGILIO_SERVICES=${
									enviroments.VITE_TOKEN_VIGILIO_SERVICES
								} --restart always --memory="${
									result.vps.whatsapp_ram || "1000"
								}m" --memory-swap="${
									result.vps.whatsapp_ram || "1000"
								}m" --cpus="${
									result.vps.whatsapp_cpu_max || "1"
								}" -p ${empresa.port}:5000 -v ${empresa.slug}:/app/data ${
									enviroments.DOCKER_IMAGE_WHATSAPP
								}`,
							);
						})
						.then(() => {
							// biome-ignore lint/suspicious/noConsoleLog: <explanation>
							console.log("STDOUT:error bash a la hora de reiniciar");
							console.error("STDERR: error bash a la hora de reiniciar");
							res(true);
						})
						.catch(() => {
							res(true);
						})
						.finally(() => {
							ssh.dispose();
						});
				});
			}
			await onSSH();
		} else {
			const command1 = `docker rm -f ${empresa.slug} || true`;
			const command2 = `docker volume rm ${empresa.slug}  || true`;

			await terminal(command1, true);
			await terminal(command2, true);
			const result = await vpsShowApi();
			await terminal(
				`docker rmi ${enviroments.DOCKER_IMAGE_WHATSAPP} || true`,
				true,
			);
			await terminal(
				`docker volume create ${empresa.slug} && docker run -d --name ${
					empresa.slug
				} -e PORT=5000 -e NODE_ENV=${enviroments.NODE_ENV} -e SESSION_NAME=${
					empresa.slug
				} -e VITE_TOKEN_VIGILIO_SERVICES=${
					enviroments.VITE_TOKEN_VIGILIO_SERVICES
				} --restart always --memory="${
					result.vps.whatsapp_ram || "1000"
				}m" --memory-swap="${
					result.vps.whatsapp_ram || "1000"
				}m" --cpus="${result.vps.whatsapp_cpu_max || "1"}" -p ${
					empresa.port
				}:5000 -v ${empresa.slug}:/app/data ${
					enviroments.DOCKER_IMAGE_WHATSAPP
				}`,
			);
		}
		await Empresas.update(
			{
				timeWhatsapp: NOW(empresa).add(3, "minute").format(),
			},
			{
				where: {
					slug: empresa.slug,
				},
			},
		);
		return {
			success: true,
			message: "Se reinició correctamente.",
		};
	}

	@Get("/qr")
	async qr(@Req("empresa") empresa: Empresas, @Res() res: Response) {
		const result = await whatsappGetQrApi(empresa);
		res.setHeader("Content-Type", "image/png");
		res.send(Buffer.from(result));
	}

	@Post("/logout")
	async logout(@Req("empresa") empresa: Empresas) {
		let comando = "";
		if (empresa.whatsapp_mode.type === "VPS") {
			function onSSH() {
				return new Promise((res, _) => {
					const ssh = new NodeSSH();
					// Función para conectar por SSH
					ssh
						.connect({
							host: empresa.whatsapp_mode.ip!,
							username: "root",
							password: empresa.whatsapp_mode.password!,
						})
						.then(async () => {
							let command = "";
							// biome-ignore lint/suspicious/noConsoleLog: <explanation>
							console.log("Conectado correctamente a vps");
							if (empresa.enabledBot) {
								command = `docker stop ${empresa.slug}`;
								await Empresas.update(
									{ enabledBot: false },
									{
										where: {
											slug: empresa.slug,
										},
									},
								);
							} else {
								comando = `docker start ${empresa.slug}`;
								await Empresas.update(
									{ enabledBot: true },
									{
										where: {
											slug: empresa.slug,
										},
									},
								);
							}
							return ssh.execCommand(command);
						})
						.then((result) => {
							// biome-ignore lint/suspicious/noConsoleLog: <explanation>
							console.log(`STDOUT: ${result.stdout}`);
							console.error(`STDERR: ${result.stderr}`);
							res(true);
						})
						.catch(() => {
							res(true);
						})
						.finally(() => {
							ssh.dispose();
						});
				});
			}
			await onSSH();
		} else {
			if (empresa.enabledBot) {
				comando = `docker stop ${empresa.slug}`;
				await terminal(comando);
				await Empresas.update(
					{ enabledBot: false },
					{
						where: {
							slug: empresa.slug,
						},
					},
				);
			} else {
				comando = `docker start ${empresa.slug}`;
				await terminal(comando);
				await Empresas.update(
					{ enabledBot: true },
					{
						where: {
							slug: empresa.slug,
						},
					},
				);
			}
		}

		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		console.log(`Ejecutando comando: ${comando}`);
		return {
			success: true,
			message: "Se reinició correctamente.",
		};
	}
}
// cada 24 horas
cron.schedule("0 0 * * *", () => {
	chats = {};
});
