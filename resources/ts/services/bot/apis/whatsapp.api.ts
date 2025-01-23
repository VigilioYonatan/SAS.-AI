import { Signal } from "@preact/signals";
import { useMutation, useQuery } from "@vigilio/preact-fetching";
import type { MessageSendOptions } from "whatsapp-web.js";
import WAWebJS from "whatsapp-web.js";
import enviroments from "~/config";
export const BASE_URL_WHATSAPP = "";
export function whatsappSendMessageApi(name: Signal<string>) {
    return useMutation<
        { success: boolean; message: string },
        {
            telephone: string;
            message: string;
            options?: WAWebJS.MessageSendOptions;
        },
        { success: false; message: string }
    >(`/whatsapp/send-message/${name.value}`, async (url, body) => {
        const { telephone, ...rest } = body;
        const response = await fetch(
            `${BASE_URL_WHATSAPP}/api${url}?telephone=${telephone}`,
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
    });
}
export function whatsappSendFileApi(name: Signal<string>) {
    return useMutation<
        { success: boolean; message: string },
        {
            telephone: string;
            url?: string;
            file?: File;
            name?: string;
            option?: MessageSendOptions;
        },
        { success: boolean; message: string }
    >(`/whatsapp/send-file/${name.value}`, async (url, body) => {
        const { telephone, ...rest } = body;
        const formdata = new FormData();
        if (rest.name) {
            formdata.append("name", rest.name);
        }
        if (rest.file) {
            formdata.append("file", rest.file);
        }
        if (rest.url) {
            formdata.append("url", rest.url);
        }
        if (rest.option) {
            formdata.append("option", JSON.stringify(rest.option));
        }

        const response = await fetch(
            `${BASE_URL_WHATSAPP}/api${url}?telephone=${telephone}`,
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
    });
}

export function whatsappSendSeenApi(name: Signal<string>) {
    return useMutation<
        { success: boolean; message: string },
        { telephone: string },
        { success: boolean; message: string }
    >(`/whatsapp/send-seen/${name.value}`, async (url, body) => {
        const { telephone } = body;
        const response = await fetch(
            `${BASE_URL_WHATSAPP}/api${url}?telephone=${telephone}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
                },
            }
        );
        const result = await response.json();
        return result;
    });
}
export function whatsappSendTypingApi(name: Signal<string>) {
    return useMutation<
        { success: boolean; message: string },
        { telephone: string; delay: number },
        { success: boolean; message: string }
    >(`/whatsapp/send-typing/${name.value}`, async (url, body) => {
        const { telephone } = body;
        const response = await fetch(
            `${BASE_URL_WHATSAPP}/api${url}?telephone=${telephone}&delay=${body.delay}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
                },
            }
        );
        const result = await response.json();
        return result;
    });
}

export function whatsappGetQrApi(name: Signal<string>) {
    return useQuery(`/whatsapp/qr/${name.value}`, async (url) => {
        const response = await fetch(`/api${url}`, {
            headers: {
                Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
            },
        });
        if (!response.ok) {
            throw new Error("Error al obtener la imagen del QR");
        }
        const result = await response.blob();
        return result;
    });
}
export function whatsappLogout(name: Signal<string>) {
    return useMutation(`/whatsapp/logout/${name.value}`, async (url) => {
        const response = await fetch(`${BASE_URL_WHATSAPP}/api${url}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
            },
        });
        const result = await response.blob();
        return result;
    });
}
export function whatsappRestart(name: Signal<string>) {
    return useMutation<{ success: true; message: string }, unknown, unknown>(
        `/whatsapp/restart/${name.value}`,
        async (url) => {
            const response = await fetch(`/api${url}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
                },
            });
            const result = await response.json();
            return result;
        }
    );
}
export function whatsappStop(name: Signal<string>) {
    return useMutation<{ success: true; message: string }, unknown, unknown>(
        `/whatsapp/stop/${name.value}`,
        async (url) => {
            const response = await fetch(`${BASE_URL_WHATSAPP}/api${url}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
                },
            });
            const result = await response.json();
            return result;
        }
    );
}
export function whatsappStart(name: Signal<string>) {
    return useMutation<{ success: true; message: string }, unknown, unknown>(
        `/whatsapp/start/${name.value}`,
        async (url) => {
            const response = await fetch(`${BASE_URL_WHATSAPP}/api${url}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${enviroments.VITE_TOKEN_VIGILIO_SERVICES}`,
                },
            });
            const result = await response.json();
            return result;
        }
    );
}
