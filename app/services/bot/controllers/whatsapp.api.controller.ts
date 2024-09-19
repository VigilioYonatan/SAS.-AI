import { Empresas } from "@/empresas/entities/empresas.entity";
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
} from "@vigilio/express-core";
import type WAWebJS from "whatsapp-web.js";
import {
	whatsappGetQrApi,
	whatsappLogout,
	whatsappRemoveQR,
	whatsappSendFileApi,
	whatsappSendMessageApi,
	whatsappSendSeenApi,
	whatsappSendTypingApi,
	type WhatsappSendFileApi,
} from "../api";
import { delay, randomNumber, terminal } from "~/libs/helpers";
import { buenosDias, featuresIA, gracias, isWhatsappIA } from "../libs/ai";
import { formatTime, NOW } from "~/libs/dayjs";
import { promptReplace, transcribeAudio } from "../libs";
import { openAis } from "@/empresas/services/empresas.api.service";
import { BASE_URL } from "@/empresas/libs";
import formidable from "formidable";
import type { RequestVigilio } from "~/config/types";
import fs from "node:fs";
import cron from "node-cron";
import type { Response } from "express";
export let chats: Record<
	string,
	Record<string, ["assistant" | "user", string][]>
> = {};

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
			attributes: ["contacts"],
		});
		if (!empresa) throw new BadRequestException("Server error");
		if (!empresa.contacts.length) {
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
			props: WAWebJS.Message;
		},
	) {
		let content = body.content;
		const userId = body.from;
		const { props } = body;
		try {
			const whatsapp = await isWhatsappIA(info.slug, userId);
			if (!whatsapp) return;
			const { clientVigilio, latestEmpresaUsage, empresa } = whatsapp;

			if (body.isGroup) return; //no se admite grupos
			// message.type: chat,sticker,ptt,image,document
			if (!["ptt", "chat"].includes(body.type)) return;

			const random = randomNumber(
				empresa.inteligenceArtificial.timer.start,
				empresa.inteligenceArtificial.timer.finish,
			);

			// delay en 5 - 15 segundos
			await whatsappSendTypingApi(empresa, {
				telephone: userId,
				delay: random,
			});

			//  cuando cierra el restaurante
			const findDay = empresa.schedule.find(
				(day) => day.id === NOW(empresa).day(),
			);
			if (
				NOW(empresa).isAfter(formatTime(empresa, findDay!.openTime)) &&
				NOW(empresa).isBefore(formatTime(empresa, findDay!.closeTime))
			) {
			} else {
				return;
			}

			if (body.type === "ptt") {
				const media = body.content as Buffer;
				const audioToTxt = await transcribeAudio(empresa.slug, media);
				content = audioToTxt.text;
			}
			const buenas = buenosDias(
				content as string,
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				(props as any)._data.notifyName,
				empresa,
			);
			const thanks = gracias(content as string);
			if (buenas) {
				await whatsappSendMessageApi(empresa, {
					message: buenas,
					telephone: userId,
					options: { quotedMessageId: props.id.id }, // id del mensaje
				});
				return;
			}
			if (thanks) {
				await whatsappSendMessageApi(empresa, {
					message: thanks,
					telephone: userId,
					options: { quotedMessageId: props.id.id }, // id del mensaje
				});

				return;
			}

			// imporante que esto este acá
			(chats[info.slug] ?? [])[userId] = [
				...((chats[info.slug] ?? [])[userId] ?? []),
				["user", content as string],
			];

			if (chats[info.slug][userId]) {
				const messages = chats[info.slug][userId].map(([role, content]) => ({
					role,
					content,
				}));

				// Si el primer mensaje en lastMessages no es del role

				const prompt = await promptReplace(content as string, empresa);

				const completion = await openAis[info.slug].chat.completions.create({
					model: clientVigilio
						? clientVigilio.information.modelai
						: "gpt-4o-mini",
					max_tokens: empresa.inteligenceArtificial.max_length,
					messages: [
						{
							role: "user",
							content: `${prompt} -  Solo enviamen la imagen ( mandarme la url de la imagen) ${BASE_URL(
								empresa,
							)}/${
								empresa.slug
							}/images/products/... , si te pido información de un producto o si te pido una imagen de un producto, por ultimo responde bonito en formato whatsapp`,
						},
						{ role: "assistant", content: "Entendido, Empezemos." }, // getting start
						...messages.slice(-empresa.inteligenceArtificial.memory), // solos los ultimo 7 mensajes
					],
				});

				// actualizamos uso de tokens
				await empresa.update({
					...empresa.toJSON(),
					inteligenceArtificial: {
						...empresa.inteligenceArtificial,
						usage: {
							...latestEmpresaUsage,
							input_tokens:
								latestEmpresaUsage.input_tokens +
								completion.usage!.prompt_tokens,
							output_tokens:
								latestEmpresaUsage.output_tokens +
								completion.usage!.completion_tokens,
						},
					},
					payments: {
						...empresa.payments,
						tokens: {
							tokens:
								empresa.payments.tokens.tokens -
								completion.usage!.completion_tokens,
						},
					},
				});

				// get message ai
				const completionText = completion.choices[0].message.content!;
				const [removeNote, urlExtraidas] = await featuresIA(
					empresa,
					completionText,
				);

				chats[info.slug][userId] = [
					...(chats[info.slug][userId] || []),
					["assistant", removeNote],
				];
				await whatsappSendMessageApi(empresa, {
					message: removeNote,
					telephone: userId,
					options: { quotedMessageId: props.id.id }, // id del mensaje
				});
				// enviar imagen
				if (urlExtraidas.length) {
					await delay(3);
					for (const url of urlExtraidas) {
						await whatsappSendFileApi(empresa, {
							telephone: userId,
							url: url,
							option: { sendMediaAsSticker: true },
						});
						await delay(3);
					}
				}
			}
		} catch (error) {
			chats[info.slug][userId] = [];
		}
	}
	@Post("/send-message")
	async sendMessage(
		@Req("empresa") empresa: Empresas,
		@Body()
		body: {
			telephone: string;
			message: string;
			options?: WAWebJS.MessageSendOptions;
		},
	) {
		const result = await whatsappSendMessageApi(empresa, body);
		return result;
	}

	@Post("/send-file")
	async sendFile(@Req() req: RequestVigilio) {
		const form = formidable({});
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
			telephone: fields.telephone![0],
			name: fields.name ? fields.name![0] : null,
			option: fields.option ? JSON.parse(fields.option![0]) : null,
			url: fields.url ? JSON.parse(fields.url[0]) : null,
		};
		const result = await whatsappSendFileApi(empresa, data);
		return result;
	}

	// send-seen

	@Post("/send-seen")
	async sendSeen(
		@Req("empresa") empresa: Empresas,
		@Body()
		body: {
			telephone: string;
		},
	) {
		const result = await whatsappSendSeenApi(empresa, body);
		return result;
	}
	@Post("/send-typing")
	async sendTyping(
		@Req("empresa") empresa: Empresas,
		@Body()
		body: {
			telephone: string;
			delay: number;
		},
	) {
		const result = await whatsappSendTypingApi(empresa, body);
		return result;
	}
	@Post("/disconnected")
	async disconnected(@Req("empresa") empresa: Empresas) {
		await empresa.update({ enabledwhatsapp: false });
	}
	@Post("/restart")
	async restart(@Req("empresa") empresa: Empresas) {
		await empresa.update({
			timeWhatsapp: NOW(empresa).add(5, "minute").toDate(),
		});
		await whatsappRemoveQR(empresa);
		await terminal(`docker container stop ${empresa.slug}`);
		await delay(3);
		await terminal(`docker container start ${empresa.slug}`);

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
		const result = await whatsappLogout(empresa);
		return result;
	}
}
// cada 24 horas
cron.schedule("0 0 * * *", () => {
	chats = {};
});
