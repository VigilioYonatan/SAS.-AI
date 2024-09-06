import { Injectable } from "@vigilio/express-core";
import { Users } from "@/users/entities/users.entity";
import { NotificationsApiService } from "@/notificactions/services/notifications.api.service";
import { NotificationsUser } from "@/notificactions/entities/notifications_user.entity";
import webpush from "@/notificactions/libs/webpush";
import { removeTextHTML } from "~/libs/helpers";
import { InformationEntity } from "@/information/entities/information.entity";
import { printFileWithDimension } from "@/uploads/libs/helpers";
import { BASE_URL } from "@/information/libs";
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
        private readonly notificationsApiService: NotificationsApiService
    ) {}
    async index(token: string) {
        const tkn = JSON.parse(token ?? "null");
        if (!tkn) return;
        const user = await Users.unscoped().findByPk(tkn, {
            attributes: ["id", "username", "role_id", "isOnline"],
        });
        return user;
    }

    async orderStore(
        empresa: string,
        body: {
            order_code: string;
            total: number;
            client_id: number | null;
        }
    ) {
        const information = await InformationEntity.findOne({
            where: { id: empresa },
            attributes: ["id", "logo", "money", "slug", "money"],
        });
        if (!information) return;
        const content = `Se registró una nueva orden registrado <b>${formatMoney(
            information,
            body.total,
            information.money.money
        )}</b>`;
        const payload = {
            title: `Nueva orden registrada ${body.order_code}`,
            message: removeTextHTML(content), // Asegúrate de que content sea el mensaje que quieres enviar
            url: `${BASE_URL(information)}/admin/orders/${body.order_code}`, // URL dinámica
            logo: information.logo
                ? printFileWithDimension(information)(information.logo!, 100)[0]
                : "",
            tag: "nueva-orden",
        };
        const notification = await this.notificationsApiService.store({
            type: "order",
            url: `/admin/orders/${body.order_code}`,
            content,
            information_id: information.id,
            client_id: body.client_id ?? null,
        });
        const users = await Users.findAll({
            where: { information_id: information.id },
        });

        await Promise.all(
            users.map(async (user) => {
                const noti = new NotificationsUser({
                    user_id: user.id,
                    notification_id: notification.notification.id,
                    information_id: information.id,
                    isRead: false,
                });
                await noti.save();
                if (user.subscription && user.enabledNotification) {
                    await webpush.sendNotification(
                        user.subscription,
                        JSON.stringify(payload)
                    );
                }
            })
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
                                        id: [
                                            STATUSORDER.confirmado,
                                            STATUSORDER.preparado,
                                        ], //solo los que estan confirmados y preparados
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
                information_id: empresa,
            },
        });

        return { success: true, floors };
    }
}
