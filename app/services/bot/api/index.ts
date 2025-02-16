import type { Empresas } from "@/empresas/entities/empresas.entity";
import { InternalServerErrorException } from "@vigilio/express-core";
import type WAWebJS from "whatsapp-web.js";
import type { MessageSendOptions } from "whatsapp-web.js";
import enviroments from "~/config/enviroments.config";
import { chats } from "../controllers/whatsapp.api.controller";
export function BASE_URL_WHATSAPP(empresa: Empresas, name: string) {
    return enviroments.NODE_ENV === "production"
        ? `https://www.${empresa.slug}.${name}.vigilio-services.com`
        : "https://1cae-201-218-157-99.ngrok-free.app";
}
export async function whatsappSendMessageApi(
    empresa: Empresas,
    name: string,
    body: {
        telephone: string;
        message: string;
        options?: WAWebJS.MessageSendOptions;
        delay: number;
    }
): Promise<{ success: boolean; message: string }> {
    const { telephone, ...rest } = body;

    const response = await fetch(
        `${BASE_URL_WHATSAPP(
            empresa,
            name
        )}/api/whatsapp/send-message?telephone=${telephone}`,
        {
            method: "POST",
            body: JSON.stringify(rest),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
            },
        }
    );
    const result = await response.json();
    if (!response.ok) throw new InternalServerErrorException(result.message);
    return result;
}
export interface WhatsappSendFileApi {
    telephone: string;
    url?: string | null;
    file?: File | null;
    name?: string | null;
    options?: MessageSendOptions | null;
    delay: number;
}
export async function whatsappSendFileApi(
    empresa: Empresas,
    name: string,
    body: WhatsappSendFileApi
): Promise<{ success: boolean; message: string }> {
    const { telephone, ...rest } = body;
    const formdata = new FormData();
    if (rest.name) {
        formdata.append("name", rest.name);
    }
    if (rest.file) {
        // const fileStream = fs.createReadStream(file.filepath);
        formdata.append("file", rest.file);
    }
    if (rest.url) {
        formdata.append("url", rest.url);
    }
    if (rest.delay) {
        formdata.append("delay", String(rest.delay));
    }
    if (rest.options) {
        formdata.append(
            "options",
            JSON.stringify(JSON.stringify(rest.options))
        );
    }
    const response = await fetch(
        `${BASE_URL_WHATSAPP(
            empresa,
            name
        )}/api/whatsapp/send-file?telephone=${telephone}`,
        {
            method: "POST",
            body: formdata,
            headers: {
                Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
            },
        }
    );
    const result = await response.json();
    if (!response.ok) throw new InternalServerErrorException(result.message);
    return result;
}

export async function whatsappSendSeenApi(
    empresa: Empresas,
    name: string,
    body: {
        telephone: string;
    }
): Promise<{ success: boolean; message: string }> {
    const { telephone } = body;
    const response = await fetch(
        `${BASE_URL_WHATSAPP(
            empresa,
            name
        )}/api/whatsapp/send-seen?telephone=${telephone}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
            },
        }
    );
    const result = await response.json();
    return result;
}
export async function whatsappSendTypingApi(
    empresa: Empresas,
    name: string,
    body: {
        telephone: string;
        delay: number;
    }
): Promise<{ success: boolean; message: string }> {
    const { telephone } = body;
    const response = await fetch(
        `${BASE_URL_WHATSAPP(
            empresa,
            name
        )}/api/whatsapp/send-typing?telephone=${telephone}`,

        {
            method: "POST",
            body: JSON.stringify({ delay: body.delay }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
            },
        }
    );
    const result = await response.json();

    return result;
}
export async function whatsappGetQrApi(empresa: Empresas, name: string) {
    const response = await fetch(
        `${BASE_URL_WHATSAPP(empresa, name)}/api/whatsapp/qr`,
        {
            headers: {
                Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
            },
        }
    );
    const result = await response.arrayBuffer();
    return result;
}
export async function whatsappLogout(empresa: Empresas, name: string) {
    const response = await fetch(
        `${BASE_URL_WHATSAPP(empresa, name)}/api/whatsapp/logout`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
            },
        }
    );
    const result = await response.json();
    return result;
}
export async function whatsappRemoveQR(empresa: Empresas, name: string) {
    const response = await fetch(
        `${BASE_URL_WHATSAPP(empresa, name)}/api/whatsapp/remove-qr`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
            },
        }
    );
    const result = await response.json();
    return result;
}
