import { useMutation } from "@vigilio/preact-fetching";
import type { EmailsStoreDto } from "../dtos/emails.store.dto";

export function emailsStoreApi() {
    return useMutation<EmailsStoreAPI, EmailsStoreDto, EmailsStoreErrorAPI>(
        "/emails",
        async (url, body) => {
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
        }
    );
}

export interface EmailsStoreAPI {
    success: boolean;
    message: string;
}

export interface EmailsStoreErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
