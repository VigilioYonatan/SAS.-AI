import { useMutation } from "@vigilio/preact-fetching";
import type { EmailsSendAllDto } from "../dtos/emails.send-all.dto";

export function emailsSendAllApi() {
    return useMutation<
        EmailsSendAllAPI,
        EmailsSendAllDto,
        EmailsSendAllErrorAPI
    >("/emails/send-all", async (url, body) => {
        const response = await fetch(`/api${url}`, {
            body: JSON.stringify(body),
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface EmailsSendAllAPI {
    success: boolean;
    message: string;
}

export interface EmailsSendAllErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
