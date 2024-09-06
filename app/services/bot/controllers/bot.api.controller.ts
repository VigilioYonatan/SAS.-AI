import {
	Controller,
	Get,
	Params,
	Req,
	NotFoundException,
	Post,
	Body,
	BadRequestException,
} from "@vigilio/express-core";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { buenosDias, gracias, isWhatsappIA } from "../libs/ai";
import enviroments from "~/config/enviroments.config";
import { InformationEntity } from "@/information/entities/information.entity";
import type { Client } from "whatsapp-web.js";
import { randomNumber, terminal } from "~/libs/helpers";
import {
	whatsappRemoveQR,
	whatsappSendFileApi,
	whatsappSendMessageApi,
	whatsappSendTypingApi,
} from "../api";
import { formatTime, NOW } from "~/libs/dayjs";
import { promptReplace, transcribeAudio } from "../libs";
import type WAWebJS from "whatsapp-web.js";
import { openAis } from "@/information/services/information.api.service";
import { BASE_URL } from "@/information/libs";

export const chats: Record<
	string,
	Record<string, ["assistant" | "user", string][]>
> = {};

@Controller("/bot")
export class BotApiController {
	@Post("/whatsapp/ready")
	async whatsappReady(
		@Body() client: Client,
		@Req("information") info: InformationEntity,
	) {
		const information = await InformationEntity.findOne({
			where: { slug: info.slug },
			attributes: ["contacts"],
		});
		if (!information) throw new BadRequestException("Server error");
		if (!information.contacts.length) {
			const contacts = await client.getContacts();
			const mappedcontacts = contacts.map((contact) => ({
				name: contact.name!,
				telephone: contact.id._serialized,
				isFavorite: false,
				ia: true,
			}));
			await information.update({ contacts: mappedcontacts });
		}

		await information?.update({ enabledBot: true });
	}
	@Post("/whatsapp/receive-message")
	async whatsappReceiveMessage(
		@Req("information") info: InformationEntity,
		@Body()
		body: {
			type: string;
			isGroup: boolean;
			content: string | Buffer;
			from: string;
			props: WAWebJS.Message;
		},
	) {
		let content = body.content;
		const userId = body.from;
		const { props } = body;
		try {
			const whatsapp = await isWhatsappIA(info.slug, userId);
			if (!whatsapp) return;
			const { clientVigilio, latestInformationUsage, information } = whatsapp;

			if (body.isGroup) return; //no se admite grupos
			// message.type: chat,sticker,ptt,image,document
			if (!["ptt", "chat"].includes(body.type)) return;

			const random = randomNumber(
				information.inteligenceArtificial.timer.start,
				information.inteligenceArtificial.timer.finish,
			);

			// delay en 5 - 15 segundos
			await whatsappSendTypingApi(information, {
				telephone: userId,
				delay: random,
			});

			//  cuando cierra el restaurante
			const findDay = information.schedule.find(
				(day) => day.id === NOW().day(),
			);
			if (
				NOW().isAfter(formatTime(findDay!.openTime)) &&
				NOW().isBefore(formatTime(findDay!.closeTime))
			) {
			} else {
				return;
			}

			if (body.type === "ptt") {
				const media = body.content as Buffer;
				const audioToTxt = await transcribeAudio(information.slug, media);
				content = audioToTxt.text;
			}
			const buenas = buenosDias(
				content as string,
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				(props as any)._data.notifyName,
				information,
			);
			const thanks = gracias(content as string);
			if (buenas) {
				await whatsappSendMessageApi(information, {
					message: buenas,
					telephone: userId,
					options: { quotedMessageId: props.id.id }, // id del mensaje
				});
				return;
			}
			if (thanks) {
				await whatsappSendMessageApi(information, {
					message: thanks,
					telephone: userId,
					options: { quotedMessageId: props.id.id }, // id del mensaje
				});

				return;
			}

			// imporante que esto este acá
			chats[info.slug][userId] = [
				...(chats[info.slug][userId] ?? []),
				["user", content as string],
			];

			if (chats[info.slug][userId]) {
				const messages = chats[info.slug][userId].map(([role, content]) => ({
					role,
					content,
				}));

				// Si el primer mensaje en lastMessages no es del role

				const prompt = await promptReplace(content as string, information);

				const completion = await openAis[info.slug].chat.completions.create({
					model: clientVigilio
						? clientVigilio.information.modelai
						: enviroments.MODEL_AI,
					max_tokens: 300,
					messages: [
						{
							role: "user",
							content: `${prompt} -  Solo enviamen la imagen ( mandarme la url de la imagen) ${BASE_URL(
								information,
							)}/${
								information.slug
							}/images/products/... , si te pido información de un producto o si te pido una imagen de un producto, por ultimo responde bonito en formato whatsapp`,
						},
						{ role: "assistant", content: "Entendido, Empezemos." }, // getting start
						...messages.slice(-information.inteligenceArtificial.memory), // solos los ultimo 7 mensajes
					],
				});

				// actualizamos uso de tokens
				await information.update({
					...information,
					inteligenceArtificial: {
						...information.inteligenceArtificial,
						usage: {
							...latestInformationUsage,
							input_tokens:
								latestInformationUsage.input_tokens +
								completion.usage!.prompt_tokens,
							output_tokens:
								latestInformationUsage.output_tokens +
								completion.usage!.completion_tokens,
						},
					},
				});

				// get message ai
				const completionText = completion.choices[0].message.content!;
				let removeNote = completionText.replace(/\s*\(.*?\)\s*/g, " ");
				// quitar las imagenes para enviar imagen
				const baseURL = `${BASE_URL(information)}/${information.slug}/${
					information.slug
				}/images/products`;
				const urlPattern = new RegExp(`${baseURL}[^\\s]*`, "g");
				const match = removeNote.match(urlPattern);
				const urlExtraida = match ? match[0] : null;

				if (urlExtraida) {
					removeNote = removeNote.replace(urlPattern, "").trim();
				}

				chats[info.slug][userId] = [
					...(chats[info.slug][userId] || []),
					["assistant", removeNote],
				];
				await whatsappSendMessageApi(information, {
					message: removeNote,
					telephone: userId,
					options: { quotedMessageId: props.id.id }, // id del mensaje
				});
				// enviar imagen
				if (urlExtraida) {
					await whatsappSendFileApi(information, {
						telephone: userId,
						url: urlExtraida,
						option: { sendMediaAsSticker: true },
					});
				}
			}
		} catch (error) {
			chats[info.slug][userId] = [];
		}
	}
	@Post("/whatsapp/disconnected")
	async whatsappDisconnected(information: InformationEntity) {
		await information.update({ enabledBot: false });
	}
	@Post("/whatsapp/restart")
	async whatsappRestart(information: InformationEntity) {
		try {
			await whatsappRemoveQR(information);
			await terminal(`docker container stop ${information.slug}`);
			await terminal(`docker container start ${information.slug}`);
			return {
				success: true,
				message: "Se reinició correctamente.",
			};
		} catch (error) {}
	}

	@Pipe(objectAsync({ name: string() }))
	@Get("/description/:name")
	async description(
		@Params("name") name: string,
		@Req("information") information: InformationEntity,
	) {
		const whatsapp = await isWhatsappIA(information.slug);
		if (!whatsapp)
			throw new NotFoundException(
				"Hubo un problema al usar la ia, Recomiendo fijarse en los limites token",
			);
		const completion = await openAis[information.slug].chat.completions.create({
			model:
				whatsapp.clientVigilio?.information.modelai || enviroments.MODEL_AI,
			max_tokens: 300,
			messages: [
				{
					role: "user",
					// insert custom prompt
					content: `Dame solo la "descripcion" y no otro en formato de tienda virtual de producto de ${name} en español  y no traer fuentes y no menciones otra cosa que no sea la descripción, y sin comillas "" por favor`,
				},
			],
		});
		const completionText = completion.choices[0].message.content;
		const latestInformationUsage = information!.inteligenceArtificial.usage;
		await information.update({
			...information.inteligenceArtificial,
			usage: {
				...latestInformationUsage,
				input_tokens:
					latestInformationUsage.input_tokens + completion.usage!.prompt_tokens,
				output_tokens:
					latestInformationUsage.input_tokens +
					completion.usage!.completion_tokens,
			},
		});

		return {
			success: true,
			description: completionText,
		};
	}
}
