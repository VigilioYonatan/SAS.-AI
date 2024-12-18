import { Injectable } from "@vigilio/express-core";
import { Users } from "@/users/entities/users.entity";
import { NotificationsApiService } from "@/notificactions/services/notifications.api.service";
import { NotificationsUser } from "@/notificactions/entities/notifications_user.entity";
import webpush from "@/notificactions/libs/webpush";
import { removeTextHTML } from "~/libs/helpers";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { printFileWithDimension } from "@/uploads/libs/helpers";
import { BASE_URL, type Money } from "@/empresas/libs";
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
import { SubcommentsApiService } from "@/polymorphism/services/subcomments.api.service";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { featuresIA, isWhatsappTelegramIA } from "@/bot/libs/ai";
import { chatgpt, promptReplace, questionGPT } from "@/bot/libs";
import {} from "@/bot/libs/prompt";
import { openAis } from "@/empresas/services/empresas.api.service";
import { HTMLPROMPT } from "../controllers/websockets.controller";
import { Subcomments } from "@/polymorphism/entities/subcomments.entity";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { TipoEmpresa } from "@/empresas/entities/tipo_empresa.entity";
import cache from "@vigilio/express-core/cache";

@Injectable()
export class WebsocketsService {
    constructor(
        private readonly notificationsApiService: NotificationsApiService,
        private readonly productsApiService: ProductsApiService,
        private readonly subcommentsApiService: SubcommentsApiService
    ) {}
    async index(token: string) {
        if (token === "null") return null;
        const user = await Users.unscoped().findByPk(token, {
            attributes: ["id", "username", "role_id", "isOnline", "empresa_id"],
            include: [
                {
                    model: Empresas.unscoped(),
                    attributes: ["name_empresa", "slug", "id"],
                },
            ],
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
            where: { slug: empresa },
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
        const userPermises = await Users.findAll({
            where: {
                role_id: ROLES.admin,
                empresa_id: emp.id,
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
                // if (user.subscription && user.enabledNotification) {
                //     await webpush.sendNotification(
                //         user.subscription,
                //         JSON.stringify(payload)
                //     );
                // }
            })
        );
        return {
            ...notification,
            users_permission: userPermises.map((user) => user.id),
        };
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
            where: { slug: empresa },
            attributes: ["id", "logo", "money", "slug"],
        });
        if (!emp) return;
        const content = `Se registró una nueva orden registrado <b>${formatMoney(
            emp,
            body.total,
            emp.money.money as Money
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
        const userPermises = await Users.unscoped().findAll({
            where: {
                empresa_id: emp.id,
                [Op.not]: {
                    role_id: ROLES.user,
                },
            },
            attributes: [
                "role_id",
                "id",
                "enabledNotification",
                "subscription",
            ],
        });

        await Promise.all(
            userPermises.map(async (user) => {
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

        return {
            ...notification,
            users_permission: userPermises.map((user) => user.id),
        };
    }

    async commentStore(
        empresa: string,
        token: string,
        body: {
            product_id: number;
            user_id: number;
            isService: boolean;
            comment_id: number;
            content: string;
        }
    ) {
        const emp = await Empresas.findOne({
            where: { slug: empresa },
            attributes: [
                "id",
                "logo",
                "money",
                "slug",
                "enabled_commentario_ia",
            ],
        });
        if (!emp) return;

        const user = await this.index(token);
        if (user) {
            const { product } = await this.productsApiService.show(
                emp,
                String(body.product_id),
                body.isService,
                true,
                null,
                false
            );
            const content = `Se agregó un nuevo comentario en el producto <b>${product.name}</b>`;
            // const payload = {
            //     title: `Nueva comentario ${product.name}`,
            //     message: removeTextHTML(content), // Asegúrate de que content sea el mensaje que quieres enviar
            //     url: body.isService
            //         ? `${BASE_URL(emp)}/servicio/${product.slug}`
            //         : `${BASE_URL(emp)}/${product.slug}`, // URL dinámica
            //     logo: emp.logo
            //         ? printFileWithDimension(emp)(emp.logo!, 100)[0]
            //         : "",
            //     tag: "nuevo-commentario",
            // };

            // solo admin,
            const userPermises = await Users.unscoped().findAll({
                where: {
                    role_id: ROLES.admin,
                    id: {
                        [Op.not]: user.id,
                    },
                    empresa_id: emp.id,
                },
                attributes: [
                    "role_id",
                    "id",
                    "enabledNotification",
                    "subscription",
                ],
            });
            const notification = await this.notificationsApiService.store({
                type: "comment",
                url: body.isService
                    ? `/servicio/${product.slug}?comment=${body.comment_id}`
                    : `/${product.slug}?comment=${body.comment_id}`,
                content,
                user_id: body.user_id,
                empresa_id: emp.id,
            });
            await Promise.all(
                userPermises.map(async (user) => {
                    const noti = new NotificationsUser({
                        user_id: user.id,
                        notification_id: notification.notification.id,
                        isRead: emp.enabled_commentario_ia,
                        empresa_id: emp.id,
                    });
                    await noti.save();
                })
            );

            if (emp.enabled_commentario_ia) {
                // await delay(60);
                const type =
                    product instanceof ProductsNormal
                        ? "ProductsNormals"
                        : product instanceof ProductsRestaurant
                        ? "ProductsRestaurants"
                        : "ProductsServicios";
                // await delay(60);
                const whatsapp = await isWhatsappTelegramIA(emp.slug);

                if (!whatsapp) return;
                const message = await questionGPT(
                    whatsapp,
                    body.content,
                    "agradecimiento, elogio o satisfacción"
                );
                let userBot = await Users.findOne({
                    where: { isBot: true, empresa_id: emp.id },
                });
                if (!userBot) {
                    userBot = await Users.findOne({
                        where: { empresa_id: emp.id, role_id: ROLES.admin },
                    });
                }
                let content = null;
                if (message) {
                    content = await chatgpt(
                        whatsapp,
                        `'${body.content}', Solo agradece. muy corto y usa emojis.`
                    );
                } else {
                    const contenido = `${product.name} <- estamos en ese producto/servicio, No vendas solo responde la pregunta y ingoralo: .\n${body.content}`;
                    const prompt = await promptReplace(
                        whatsapp,
                        contenido,
                        whatsapp.empresa!
                    );

                    const completion = await openAis[
                        emp.slug
                    ].chat.completions.create({
                        model: whatsapp.clientVigilio
                            ? whatsapp.clientVigilio.information.modelai
                            : "gpt-4o-mini",
                        max_tokens: 255,
                        messages: [
                            {
                                role: "user",
                                content: `${prompt} . ${HTMLPROMPT(
                                    whatsapp.empresa
                                )} `,
                            },
                            {
                                role: "assistant",
                                content: "Entendido, Empezemos.",
                            },
                            {
                                role: "user",
                                content: contenido,
                            },
                        ],
                    });
                    const completionText =
                        completion.choices[0].message.content!;

                    const [removeNote] = await featuresIA(
                        emp,
                        completionText,
                        false
                    );
                    content = removeNote;
                }
                await this.subcommentsApiService.store(
                    whatsapp.empresa,
                    type,
                    String(body.product_id),
                    String(body.comment_id),
                    { content: content! },
                    userBot!.id
                );
                const contentido = `Se respondió un comentario en el producto <b>${product.name}</b>`;
                const notification = await this.notificationsApiService.store({
                    type: "comment",
                    url: body.isService
                        ? `/servicio/${product.slug}?comment=${body.comment_id}`
                        : `/${product.slug}?comment=${body.comment_id}`,
                    content: contentido,
                    user_id: userBot!.id,
                    empresa_id: emp.id,
                });

                const noti = new NotificationsUser({
                    user_id: user.id,
                    notification_id: notification.notification.id,
                    isRead: false,
                    empresa_id: emp.id,
                });
                await noti.save();

                return {
                    ...notification,
                    users_permission: [body.user_id],
                };
            }

            return {
                ...notification,
                users_permission: userPermises.map((user) => user.id),
            };
        }
    }
    async subcommentStore(
        empresa: string,
        token: string,
        body: {
            product_id: number;
            user_id: number;
            receptores: number[];
            isService: boolean;
            comment_id: number;
            content: string;
        }
    ) {
        const emp = await Empresas.findOne({
            where: { slug: empresa },
            attributes: [
                "id",
                "logo",
                "money",
                "slug",
                "enabled_commentario_ia",
            ],
        });
        if (!emp) return;

        const user = await this.index(token);
        if (!user) return;
        const { product } = await this.productsApiService.show(
            emp,
            String(body.product_id),
            body.isService,
            true,
            null,
            false
        );
        const content = `Se respondió un comentario en el producto <b>${product.name}</b>`;
        // const payload = {
        //     title: `Nueva comentario ${product.name}`,
        //     message: removeTextHTML(content), // Asegúrate de que content sea el mensaje que quieres enviar
        //     url: body.isService
        //         ? `${BASE_URL(emp)}/servicio/${product.slug}`
        //         : `${BASE_URL(emp)}/${product.slug}`, // URL dinámica
        //     logo: emp.logo
        //         ? printFileWithDimension(emp)(emp.logo!, 100)[0]
        //         : "",
        //     tag: "nuevo-commentario",
        // };
        const notification = await this.notificationsApiService.store({
            type: "comment",
            url: body.isService
                ? `/servicio/${product.slug}?comment=${body.comment_id}`
                : `/${product.slug}?comment=${body.comment_id}`,
            content,
            user_id: body.user_id,
            empresa_id: emp.id,
        });

        // solo los que comentarios,
        const userPermises = await Users.unscoped().findAll({
            where: {
                id: body.receptores,
                empresa_id: emp.id,
            },
            attributes: [
                "role_id",
                "id",
                "enabledNotification",
                "subscription",
            ],
        });
        const noti = userPermises.map((user) => ({
            user_id: user.id,
            notification_id: notification.notification.id,
            isRead: false,
            empresa_id: emp.id,
        }));

        await NotificationsUser.bulkCreate(noti);
        if (emp.enabled_commentario_ia) {
            const type =
                product instanceof ProductsNormal
                    ? "ProductsNormals"
                    : product instanceof ProductsRestaurant
                    ? "ProductsRestaurants"
                    : "ProductsServicios";
            // await delay(60);
            const whatsapp = await isWhatsappTelegramIA(emp.slug);

            const subcomentarios = await Subcomments.findAll({
                where: {
                    comment_id: String(body.comment_id),
                    subcommentsable_id: String(body.product_id),
                    subcommentsable_type: type,
                    empresa_id: emp.id,
                },
            });
            if (!whatsapp) return;

            const message = await questionGPT(
                whatsapp,
                body.content,
                "agradecimiento, elogio o satisfacción"
            );
            let userBot = await Users.findOne({
                where: { isBot: true, empresa_id: emp.id },
            });
            if (!userBot) {
                userBot = await Users.findOne({
                    where: { empresa_id: emp.id, role_id: ROLES.admin },
                });
            }
            let content = null;
            if (message) {
                content = await chatgpt(
                    whatsapp,
                    `'${body.content}', Solo agradece. muy corto y usa emojis.`
                );
            } else {
                const contenido = `${product.name} <- estamos en ese producto/servicio y Ignora: .\n${body.content}`;
                const prompt = await promptReplace(
                    whatsapp,
                    contenido,
                    whatsapp.empresa!
                );

                const messages: ChatCompletionMessageParam[] =
                    subcomentarios.map((sub) => {
                        return {
                            role: sub.id !== userBot!.id ? "user" : "assistant",
                            content: `${sub.content}. 'en html y no mkdown'`,
                        };
                    });
                const completion = await openAis[
                    emp.slug
                ].chat.completions.create({
                    model: whatsapp.clientVigilio
                        ? whatsapp.clientVigilio.information.modelai
                        : "gpt-4o-mini",
                    max_tokens: 255,
                    messages: [
                        {
                            role: "user",
                            content: `${prompt} . ${HTMLPROMPT(
                                whatsapp.empresa
                            )}`,
                        },
                        {
                            role: "assistant",
                            content: "Entendido, Empezemos.",
                        },
                        ...messages.slice(
                            -(whatsapp.empresa.inteligenceArtificial.memory - 1)
                        ),
                        {
                            role: "user",
                            content: contenido,
                        },
                    ],
                });
                const completionText = completion.choices[0].message.content!;

                const [removeNote] = await featuresIA(
                    emp,
                    completionText,
                    false
                );
                content = removeNote;
            }
            await this.subcommentsApiService.store(
                whatsapp.empresa,
                type,
                String(body.product_id),
                String(body.comment_id),
                { content: content! },
                userBot!.id
            );
            const contentido = `Se respondió un comentario en el producto <b>${product.name}</b>`;
            const notification = await this.notificationsApiService.store({
                type: "comment",
                url: body.isService
                    ? `/servicio/${product.slug}?comment=${body.comment_id}`
                    : `/${product.slug}?comment=${body.comment_id}`,
                content: contentido,
                user_id: userBot!.id,
                empresa_id: emp.id,
            });
            const users_permission = [
                body.user_id,
                ...userPermises.map((user) => user.id),
            ].filter((val) => val !== userBot!.id);
            await NotificationsUser.bulkCreate(
                users_permission.map((id) => ({
                    user_id: id,
                    notification_id: notification.notification.id,
                    isRead: false,
                    empresa_id: emp.id,
                }))
            );

            return {
                ...notification,
                users_permission,
            };
        }
        return {
            ...notification,
            users_permission: userPermises.map((user) => user.id),
        };
    }

    async floorsMesas(empresa: string, user: Users) {
        // solo modificadores,trabajadores y admin

        if (!user) return null;
        let isEmpresaRestaurant = JSON.parse(
            cache.get(`isRestaurant:${empresa}`) || "null"
        );
        if (!isEmpresaRestaurant) {
            const empresas = await Empresas.unscoped().findOne({
                where: { slug: empresa },
                include: [TipoEmpresa.unscoped()],
            });
            isEmpresaRestaurant = empresas;
            cache.set(`isRestaurant:${empresa}`, JSON.stringify(empresas));
        }

        if (isEmpresaRestaurant?.tipo_empresa.tipo_servicio_id !== 2)
            return null;
        if (![ROLES.trabajador, ROLES.admin].includes(user.role_id))
            return null;
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
                {
                    model: Empresas,
                    where: {
                        slug: empresa,
                    },
                    required: true,
                },
            ],
        });

        return { success: true, floors };
    }
}
