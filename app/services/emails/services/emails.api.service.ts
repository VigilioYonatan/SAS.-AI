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
        if (!empresa.email || !empresa.email_zoho) {
            throw new BadRequestException(
                "Necesitas un correo electrónico Zoho"
            );
        }
        if (!empresa.password_zoho) {
            throw new BadRequestException("No se encontró contraseña zoho");
        }
        try {
            await sendMail(
                {
                    email: empresa.email,
                    password: empresa.password_zoho,
                },
                {
                    from: emailsStoreDto.email,
                    to: empresa.email,
                    subject: emailsStoreDto.subject,
                    text: emailsStoreDto.content,
                }
            );

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
        if (!empresa.email_zoho || !empresa.password_zoho || empresa.email) {
            throw new BadRequestException(
                "No se encontró zoho mail o contraaseña zoho mail"
            );
        }
        try {
            // Enviar solo a clientes
            const users = await Users.unscoped().findAll({
                attributes: ["email", "username", "name", "father_lastname"],
                where: { role_id: ROLES.user },
            });

            const emailsPromociones = await EmailsPromociones.findAll();
            await Promise.all(
                users.map(async (user) => {
                    if (user.enabledEmailsOffers) {
                        const html = await customEmailHTML({
                            empresa,
                            namecomplete: `${user.username} - ${user.name} ${
                                user.lastname ? user.lastname : ""
                            }`,
                            content: emailsSendAllDto.content,
                            title: emailsSendAllDto.title,
                        });
                        await sendMail(
                            {
                                email: empresa.email_zoho!,
                                password: empresa.password_zoho!,
                            },
                            {
                                from: empresa.email!,
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
                    const html = await customEmailHTML({
                        empresa,
                        namecomplete: email.email,
                        content: emailsSendAllDto.content,
                        title: emailsSendAllDto.title,
                    });
                    await sendMail(
                        {
                            email: empresa.email!,
                            password: empresa.email_zoho!,
                        },
                        {
                            from: empresa.email!,
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
    async accounts() {
        const result = await emailsAccountsAPI();
        return result;
    }

    async account(account_id: string) {
        const result = await emailsAccountAPI(account_id);
        return result;
    }
}
