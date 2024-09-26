import { Injectable } from "@vigilio/express-core";
import { Users } from "@/users/entities/users.entity";
import { NotificationsApiService } from "@/notificactions/services/notifications.api.service";
import { NotificationsUser } from "@/notificactions/entities/notifications_user.entity";
import webpush from "@/notificactions/libs/webpush";
import { removeTextHTML } from "~/libs/helpers";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { printFileWithDimension } from "@/uploads/libs/helpers";
import { BASE_URL } from "@/empresas/libs";
import { formatMoney } from "@/cart/libs/helpers";
import { Orders } from "@/orders/entities/orders.entity";
import { Mesas } from "@/orders/entities/mesas.entity";
import { Floors } from "@/orders/entities/floors.entity";
import { StatusOrders } from "@/orders/entities/status_orders.entity";
import { STATUSORDER } from "@/orders/libs";
import type { OrdersSchema } from "@/orders/schemas/orders.schema";

@Injectable()
export class WebsocketsService {
	constructor(
		private readonly notificationsApiService: NotificationsApiService,
	) {}
	async index(token: string) {
		if (token === "null") return null;
		const user = await Users.findByPk(token, {
			attributes: ["id", "username", "role_id", "isOnline", "empresa_id"],
			include: [Empresas],
		});
		return user;
	}

	async orderStore(
		empresa: string,
		body: {
			order_code: string;
			total: number;
			client_id: number | null;
		},
	) {
		const emp = await Empresas.findOne({
			where: { id: empresa },
			attributes: ["id", "logo", "money", "slug"],
		});
		if (!emp) return;
		const content = `Se registró una nueva orden registrado <b>${formatMoney(
			emp,
			body.total,
			emp.money.money,
		)}</b>`;
		const payload = {
			title: `Nueva orden registrada ${body.order_code}`,
			message: removeTextHTML(content), // Asegúrate de que content sea el mensaje que quieres enviar
			url: `${BASE_URL(emp)}/admin/orders/${body.order_code}`, // URL dinámica
			logo: emp.logo ? printFileWithDimension(emp)(emp.logo!, 100)[0] : "",
			tag: "nueva-orden",
		};
		const notification = await this.notificationsApiService.store({
			type: "order",
			url: `/admin/orders/${body.order_code}`,
			content,
			empresa_id: emp.id,
			client_id: body.client_id ?? null,
		});
		const users = await Users.findAll({
			where: { empresa_id: emp.id },
		});

		await Promise.all(
			users.map(async (user) => {
				const noti = new NotificationsUser({
					user_id: user.id,
					notification_id: notification.notification.id,
					empresa_id: emp.id,
					isRead: false,
				});
				await noti.save();
				if (user.subscription && user.enabledNotification) {
					await webpush.sendNotification(
						user.subscription,
						JSON.stringify(payload),
					);
				}
			}),
		);

		return notification;
	}
	async floorsMesas(empresa: string, user: Users) {
		// solo modificadores,trabajadores y admin

		if (!user) return null;
		const floors = await Floors.findAll({
			include: [
				{
					model: Mesas,
					include: [
						{
							model: Orders,
							include: [
								{
									model: StatusOrders,
									where: {
										id: [STATUSORDER.confirmado, STATUSORDER.preparado], //solo los que estan confirmados y preparados
									},
								},
							],
							attributes: [
								"id",
								"order_code",
								"status_order_id",
							] as (keyof OrdersSchema)[],
						},
					],
					order: [["createdAt", "ASC"]],
				},
			],
			where: {
				empresa_id: empresa,
			},
		});

		return { success: true, floors };
	}
}
