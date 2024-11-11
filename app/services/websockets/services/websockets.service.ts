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
import { ROLES } from "@/users/libs";
import { Op } from "sequelize";
import { ProductsApiService } from "@/products/services/products.api.service";

@Injectable()
export class WebsocketsService {
    constructor(
        private readonly notificationsApiService: NotificationsApiService,
        private readonly productsApiService: ProductsApiService
    ) {}
    async index(token: string) {
        if (token === "null") return null;
        const user = await Users.findByPk(token, {
            attributes: ["id", "username", "role_id", "isOnline", "empresa_id"],
            include: [Empresas],
        });
        return user;
    }
    async authRegister(
        empresa: string,
        body: {
            user_id: number;
            username: string;
            slug: string;
        }
    ) {
        const emp = await Empresas.unscoped().findOne({
            where: { id: empresa },
            attributes: ["id", "logo", "money", "slug"],
        });
        if (!emp) return;
        const content = `Nuevo usuario registrado <b>${body.username}</b>`;
        const payload = {
            title: "Nuevo usuario registrado",
            message: removeTextHTML(content), // Asegúrate de que content sea el mensaje que quieres enviar
            url: `${BASE_URL(emp)}/admin/usuarios/${body.slug}`, // URL dinámica
            logo: emp.logo
                ? printFileWithDimension(emp)(emp.logo!, 100)[0]
                : "",
            tag: "nuevo-usuario",
        };
        const notification = await this.notificationsApiService.store({
            type: "register",
            url: `/admin/usuarios/${body.slug}`,
            content,
            user_id: body.user_id,
            empresa_id: emp.id,
        });
        // solo admins pueden ver las personas registradas y enviar notificationes solo a ellos
        const admins = await Users.findAll({
            where: {
                role_id: ROLES.admin,
            },
        });
        await Promise.all(
            admins.map(async (user) => {
                const noti = new NotificationsUser({
                    user_id: user.id,
                    notification_id: notification.notification.id,
                    isRead: false,
                    empresa_id: emp.id,
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
        return { ...notification, roles: [ROLES.admin] };
    }

    async orderStore(
        empresa: string,
        body: {
            order_code: string;
            total: number;
            user_id: number | null;
        }
    ) {
        const emp = await Empresas.unscoped().findOne({
            where: { id: empresa },
            attributes: ["id", "logo", "money", "slug"],
        });
        if (!emp) return;
        const content = `Se registró una nueva orden registrado <b>${formatMoney(
            emp,
            body.total,
            emp.money.money
        )}</b>`;
        const payload = {
            title: `Nueva orden registrada ${body.order_code}`,
            message: removeTextHTML(content), // Asegúrate de que content sea el mensaje que quieres enviar
            url: `${BASE_URL(emp)}/admin/orders/${body.order_code}`, // URL dinámica
            logo: emp.logo
                ? printFileWithDimension(emp)(emp.logo!, 100)[0]
                : "",
            tag: "nueva-orden",
        };
        const notification = await this.notificationsApiService.store({
            type: "order",
            url: `/admin/orders/${body.order_code}`,
            content,
            empresa_id: emp.id,
            user_id: body.user_id ?? null,
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
                        JSON.stringify(payload)
                    );
                }
            })
        );

        return notification;
    }

    async commentStore(
        empresa: string,
        token: string,
        body: { product_id: number; user_id: number; isService: boolean }
    ) {
        const emp = await Empresas.findOne({
            where: { id: empresa },
            attributes: ["id", "logo", "money", "slug"],
        });
        if (!emp) return;
        const user = await this.index(token);
        if (user) {
            const { product } = await this.productsApiService.show(
                emp,
                String(body.product_id),
                body.isService,
                false,
                null,
                false
            );
            const content = `Se agregó un nuevo comentario en el producto <b>${product.name}</b>`;
            const payload = {
                title: `Nueva comentario ${product.name}`,
                message: removeTextHTML(content), // Asegúrate de que content sea el mensaje que quieres enviar
                url: body.isService
                    ? `${BASE_URL(emp)}/servicios/${product.slug}`
                    : `${BASE_URL(emp)}/${product.slug}`, // URL dinámica
                logo: emp.logo
                    ? printFileWithDimension(emp)(emp.logo!, 100)[0]
                    : "",
                tag: "nuevo-commentario",
            };
            const notification = await this.notificationsApiService.store({
                type: "comment",
                url: body.isService
                    ? `/servicios/${product.slug}`
                    : `/${product.slug}`,
                content,
                user_id: body.user_id,
                empresa_id: emp.id,
            });
            // solo admin,
            const userPermises = await Users.findAll({
                where: {
                    role_id: ROLES.admin,
                    id: {
                        [Op.not]: user.id,
                    },
                },
            });

            await Promise.all(
                userPermises.map(async (user) => {
                    const noti = new NotificationsUser({
                        user_id: user.id,
                        notification_id: notification.notification.id,
                        isRead: false,
                        empresa_id: emp.id,
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
            return { ...notification, roles: [1, 2, 3] };
        }
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
                empresa_id: empresa,
            },
        });

        return { success: true, floors };
    }
}
