import {
	Args,
	Connect,
	SocketController,
	Disconnect,
	Event,
	IO,
	Socket,
} from "@vigilio/express-core";
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import * as socket from "socket.io";
import { WebsocketsService } from "../services/websockets.service";
import {
	chatAssistant,
	cloudeAi,
	chatAssistantWeb,
	cloudeAiWeb,
} from "@/bot/libs/ai";
import { Injectable } from "@vigilio/express-core";

let usersInWeb: Record<string, string[]> = {};

@Injectable()
@SocketController("/")
export class WebsocketsController {
	constructor(private readonly websocketsService: WebsocketsService) {}

	@Disconnect()
	async disconnect(@Socket() socket: socket.Socket, @IO() io: socket.Socket) {
		const token = (socket.handshake.query?.["x-token"] as string) ?? "null";
		const empresa = (socket.handshake.query?.["x-empresa"] as string) ?? "null";

		if (!token || empresa === "null") return;

		usersInWeb = {
			...usersInWeb,
			[empresa]: (usersInWeb[empresa] ?? []).filter((user) => user !== token),
		};
		io.emit("users-count:index", usersInWeb.length);
		const user = await this.websocketsService.index(
			socket.handshake.query?.["x-user"] as string,
		);
		if (user?.isOnline) {
			// update user
			await user.update({ isOnline: false });
		}
	}

	@Connect()
	async index(@Socket() socket: socket.Socket, @IO() io: socket.Socket) {
		// token localstorage
		const token = (socket.handshake.query?.["x-token"] as string) ?? "null";
		const empresa = (socket.handshake.query?.["x-empresa"] as string) ?? "null";

		if (!token || empresa === "null") return;
		if (!chatAssistantWeb[token]?.length) {
			chatAssistantWeb[token] = [
				[
					"assistant",
					"Hola, Soy tu asistente virtual 😀. ¿En que le podriamos ayudar?",
				],
			];
		}
		io.to(token).emit("chat:ai", chatAssistantWeb[token]);
		// user - user auth
		const user = await this.websocketsService.index(
			socket.handshake.query?.["x-user"] as string,
		);
		// unir en la sala
		socket.join(token);
		if (user) {
			// update user
			if (!user.isOnline) {
				await user.update({ isOnline: true });
			}
			const floors = await this.websocketsService.floorsMesas(empresa, user);

			if (floors) {
				io.emit("floors_mesas:index", floors);
			}
			socket.join(user.id);
			if (!(chatAssistant[empresa] ?? [])[user.id]?.length) {
				(chatAssistant[empresa] ?? [])[user.id] = [
					[
						"assistant",
						`Hola ${user.username}, Soy tu asistente virtual 😀. ¿En que  podriamos ayudarte?`,
						Date.now(),
					],
				];
			}
			io.to(user.id).emit("chat-assistant:ai", chatAssistant[user.id]);
		}
		const existUserInWeb = (usersInWeb[empresa] ?? []).find(
			(user) => user === token,
		);
		if (!existUserInWeb) {
			// si no existe usuari con el mismo token que ya no agregre
			usersInWeb = {
				...usersInWeb,
				[empresa]: [...(usersInWeb[empresa] ?? []), token],
			}; // add user
		}

		io.emit("users-count:index", usersInWeb.length);
	}

	@Event("notifications:order-store")
	async orderStore(
		@Args()
		body: {
			client_id: number;
			order_code: string;
			total: number;
		},
		@IO() io: socket.Socket,
		@Socket() socket: socket.Socket,
	) {
		const empresa = (socket.handshake.query?.["x-empresa"] as string) ?? "null";

		if (empresa === "null") return;
		const result = await this.websocketsService.orderStore(empresa, body);
		io.emit("notifications:store", result);
	}
	@Event("chat:send-message")
	async sendMessage(
		@Args() args: { message: string },
		@Socket() socket: socket.Socket,
		@IO() io: socket.Socket,
	) {
		const token = socket.handshake.query["x-token"] as string;
		const empresa = (socket.handshake.query?.["x-empresa"] as string) ?? "null";

		if (empresa === "null") return;
		const message = await cloudeAiWeb(empresa, token, args.message);
		io.to(token).emit("chat:send-message", ["assistant", message, Date.now()]);
	}
	@Event("chat-assistant:send-message")
	async sendAssistantMessage(
		@Args() args: { message: string },
		@Socket() socket: socket.Socket,
		@IO() io: socket.Socket,
	) {
		const token = (socket.handshake.query?.["x-token"] as string) ?? "null";
		if (!token) return;
		// user - user auth
		const user = await this.websocketsService.index(
			socket.handshake.query?.["x-user"] as string,
		);
		if (!user) return;
		const message = await cloudeAi(
			user!.information.slug,
			user.id,
			args.message,
		);
		io.to(token).emit("chat-assistant:send-message", [
			"assistant",
			message,
			Date.now(),
		]);
	}
	@Event("floors_mesas:index")
	async floorsChange(@Socket() socket: socket.Socket, @IO() io: socket.Socket) {
		const user = await this.websocketsService.index(
			socket.handshake.query?.["x-user"] as string,
		);
		const empresa = (socket.handshake.query?.["x-empresa"] as string) ?? "null";

		if (empresa === "null") return;
		if (user) {
			const floors = await this.websocketsService.floorsMesas(empresa, user);

			if (floors) {
				io.emit("floors_mesas:index", floors);
			}
		}
	}
}
