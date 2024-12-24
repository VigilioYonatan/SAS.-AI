import type { EmailsStoreDto } from "../dtos/emails.store.dto";
import { Emails } from "../entities/emails.entity";
import {
    BadRequestException,
    NotFoundException,
    Injectable,
} from "@vigilio/express-core";
import { Users } from "@/users/entities/users.entity";
import type { EmailsSendAllDto } from "../dtos/emails.send-all.dto";
import { customEmailHTML } from "../libs";
import { emailsAccountAPI, emailsAccountsAPI } from "../apis/email.send.api";
import { EmailsPromociones } from "../entities/emails_offers.entity";
import { ROLES } from "@/users/libs";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { sendMail } from "~/libs/mailer";

@Injectable()
export class EmailsApiService {
    async store(empresa: Empresas, emailsStoreDto: EmailsStoreDto) {
        try {
            if (empresa.enabled_zoho_mail) {
                if (!empresa.email || !empresa.zoho.email) {
                    throw new BadRequestException(
                        "Necesitas un correo electrónico Zoho"
                    );
                }
                if (!empresa.zoho.password) {
                    throw new BadRequestException(
                        "No se encontró contraseña zoho"
                    );
                }
                await sendMail(
                    {
                        email: empresa.zoho.email,
                        password: empresa.zoho.password,
                    },
                    {
                        from: emailsStoreDto.email,
                        to: empresa.zoho.email,
                        subject: emailsStoreDto.subject,
                        text: emailsStoreDto.content,
                    }
                );
            }

            await Emails.create({ ...emailsStoreDto, empresa_id: empresa.id });
            return {
                success: true,
                message: "Se envió correo correctamente",
            };
        } catch (error) {
            throw new BadRequestException((error as Error).message);
        }
    }

    async show(id: string) {
        const email = await Emails.findByPk(id);
        if (!email) throw new NotFoundException("No se encontró email");
        return { success: true, email };
    }

    async sendAllUsers(empresa: Empresas, emailsSendAllDto: EmailsSendAllDto) {
        if (!empresa.zoho.email || !empresa.zoho.password || !empresa.logo) {
            throw new BadRequestException(
                "No se encontró zoho mail o contraseña zoho mail o logo de tu web"
            );
        }

        try {
            // Enviar solo a clientes
            const users = await Users.unscoped().findAll({
                attributes: ["email", "username", "name", "lastname"],
                where: { role_id: ROLES.user },
            });

            const emailsPromociones = await EmailsPromociones.findAll();
            await Promise.all(
                users.map(async (user) => {
                    if (user.enabledEmailsOffers) {
                        const html = customEmailHTML({
                            empresa,
                            namecomplete: `${user.username} - ${user.name} ${
                                user.lastname ? user.lastname : ""
                            }`,
                            content: emailsSendAllDto.content,
                            title: emailsSendAllDto.title,
                        });
                        await sendMail(
                            {
                                email: empresa.zoho.email!,
                                password: empresa.zoho.password!,
                            },
                            {
                                from: empresa.zoho.email!,
                                to: user.email!,
                                subject: emailsSendAllDto.subject,
                                html,
                            }
                        );
                    }
                })
            );
            await Promise.all(
                emailsPromociones.map(async (email) => {
                    const html = customEmailHTML({
                        empresa,
                        namecomplete: email.email,
                        content: emailsSendAllDto.content,
                        title: emailsSendAllDto.title,
                    });
                    await sendMail(
                        {
                            email: empresa.zoho.email!,
                            password: empresa.zoho.password!,
                        },
                        {
                            from: empresa.zoho.email!,
                            to: email.email,
                            subject: emailsSendAllDto.subject,
                            html,
                        }
                    );
                })
            );
            return {
                success: true,
                message: "Se envio los correo electrónicos correctamente.",
            };
        } catch (error) {
            throw new BadRequestException((error as Error).message);
        }
    }
    async accounts(empresa: Empresas) {
        const result = await emailsAccountsAPI(empresa);
        return result;
    }

    async account(empresa: Empresas, account_id: string) {
        const result = await emailsAccountAPI(empresa, account_id);
        return result;
    }
}
