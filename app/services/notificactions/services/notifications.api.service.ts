import { Injectable } from "@vigilio/express-core";
import { Notifications } from "../entities/notifications.entity";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import { Users } from "@/users/entities/users.entity";
import { NotificationsUser } from "../entities/notifications_user.entity";
import type { NotificationsSchema } from "../schemas/notifications.schema";
import type { Subscription } from "@/users/schemas/users.schema";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { NotificationMessageDto } from "../dtos/notification_message.dto";
import { printFileWithDimension } from "@/uploads/libs/helpers";
import { ROLES } from "@/users/libs";
import webpush from "../libs/webpush";
import cron from "node-cron";

@Injectable()
export class NotificationsApiService {
    async count(empresa: Empresas, user: Users) {
        const data = await NotificationsUser.count({
            where: {
                user_id: user.id,
                isRead: false,
                empresa_id: empresa.id,
            },
        }); // only notifications that no read
        return {
            success: true,
            data,
        };
    }
    async clean(empresa: Empresas, user: Users) {
        const notifications = await NotificationsUser.findAll({
            where: {
                user_id: user.id,
                isRead: false,
                empresa_id: empresa.id,
            },
        });
        for (const notification of notifications) {
            await notification.update({ isRead: true });
        }
        return {
            success: true,
            message: "Se limpiaron todas tus notificaiones",
        };
    }
    async show(empresa: Empresas, id: string) {
        let notification = null;
        if (!Number.isNaN(Number(id))) {
            notification = await Notifications.findOne({
                where: { empresa_id: empresa.id, id },
            });
        }
        if (!notification) {
            throw new NotFoundException(
                `No se encontró una notificación con ${id}`
            );
        }
        return {
            success: true,
            notification,
        };
    }
    async register(user: Users, subscription: Subscription) {
        await user.update({ subscription });
        return {
            success: true,
            id: user.id,
        };
    }
    async store(notificationsStoreDto: Omit<NotificationsSchema, "id">) {
        const notification = new Notifications(notificationsStoreDto);
        await notification.save();
        const use = await notification.$get("use");
        return {
            success: true,
            notification: { ...notification.toJSON(), use },
        };
    }

    async update(
        empresa: Empresas,
        user: Users,
        body: {
            notification_id: number;
            isRead: boolean;
        }
    ) {
        const notification = await NotificationsUser.findOne({
            where: {
                notification_id: body.notification_id,
                user_id: user.id,
                empresa_id: empresa.id,
            },
        });
        if (!notification)
            throw new BadRequestException("No se encontró notificación");
        await notification.update({ isRead: body.isRead });
        return {
            success: true,
            notification,
        };
    }

    async destroy(empresa: Empresas, id: string) {
        const { notification } = await this.show(empresa, id);
        await notification.destroy();
        return {
            success: true,
            message: `La notificación con el id: ${id} fue eliminado`,
        };
    }

    async sendNotification(empresa: Empresas, body: NotificationMessageDto) {
        const intervaloHoras = Math.floor(24 / body.again); // Redondeamos para evitar decimales
        const payload = {
            title: body.title,
            message: body.message, // Asegúrate de que content sea el mensaje que quieres enviar
            url: body.url, // URL dinámica
            logo: empresa.icon
                ? printFileWithDimension(empresa)(empresa.icon!, 100)[0]
                : "",
            tag: "notification",
        };

        async function sendMessage() {
            const users = await Users.unscoped().findAll({
                where: {
                    empresa_id: empresa.id,
                    role_id: ROLES.user,
                    enabledNotification: true,
                },
                attributes: [
                    "id",
                    "subscription",
                    "role_id",
                    "empresa_id",
                    "enabledNotification",
                ],
            });

            for (const user of users) {
                if (user.subscription && user.enabledNotification) {
                    try {
                        await webpush.sendNotification(
                            user.subscription,
                            JSON.stringify(payload)
                        );
                    } catch (error) {}
                }
            }
        }
        for (let i = 0; i < body.again; i++) {
            const hora = (i * intervaloHoras) % 24; // Distribuye uniformemente
            await sendMessage();
            if (body.days > 1) {
                cron.schedule(`0 ${hora} */${body.days} * *`, async () => {
                    await sendMessage();
                });
            }
        }

        return {
            success: true,
            message: "Enviado correctamente",
        };
    }
}
