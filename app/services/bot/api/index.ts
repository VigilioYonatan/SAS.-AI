import type { Empresas } from "@/empresas/entities/empresas.entity";
import type WAWebJS from "whatsapp-web.js";
import type { MessageSendOptions } from "whatsapp-web.js";
import enviroments from "~/config/enviroments.config";
export function BASE_URL_WHATSAPP(empresa: Empresas) {
    return enviroments.NODE_ENV === "production"
        ? `https://www.${empresa.slug}.docker.vigilio-services.com`
        : "https://3655-201-218-157-99.ngrok-free.app";
}
export async function whatsappSendMessageApi(
    empresa: Empresas,
    body: {
        telephone: string;
        message: string;
        options?: WAWebJS.MessageSendOptions;
    }
): Promise<{ success: boolean; message: string }> {
    const { telephone, ...rest } = body;
    const response = await fetch(
        `${BASE_URL_WHATSAPP(
            empresa
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
    return result;
}
export interface WhatsappSendFileApi {
    telephone: string;
    url?: string | null;
    file?: File | null;
    name?: string | null;
    option?: MessageSendOptions | null;
}
export async function whatsappSendFileApi(
    empresa: Empresas,
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
    if (rest.option) {
        formdata.append("option", JSON.stringify(rest.option));
    }
    const response = await fetch(
        `${BASE_URL_WHATSAPP(
            empresa
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
    return result;
}

export async function whatsappSendSeenApi(
    empresa: Empresas,
    body: {
        telephone: string;
    }
): Promise<{ success: boolean; message: string }> {
    const { telephone } = body;
    const response = await fetch(
        `${BASE_URL_WHATSAPP(
            empresa
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
    body: {
        telephone: string;
        delay: number;
    }
): Promise<{ success: boolean; message: string }> {
    const { telephone } = body;
    const response = await fetch(
        `${BASE_URL_WHATSAPP(
            empresa
        )}/api/whatsapp/send-typing?telephone=${telephone}&delay=${body.delay}`,

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
export async function whatsappGetQrApi(empresa: Empresas) {
    const response = await fetch(
        `${BASE_URL_WHATSAPP(empresa)}/api/whatsapp/qr`,
        {
            headers: {
                Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
            },
        }
    );
    const result = await response.arrayBuffer();
    return result;
}
export async function whatsappLogout(empresa: Empresas) {
    const response = await fetch(
        `${BASE_URL_WHATSAPP(empresa)}/api/whatsapp/logout`,
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
export async function whatsappRemoveQR(empresa: Empresas) {
    const response = await fetch(
        `${BASE_URL_WHATSAPP(empresa)}/api/whatsapp/remove-qr`,
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
