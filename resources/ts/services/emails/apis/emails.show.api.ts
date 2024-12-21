import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { EmailsSchemaFromServer } from "../schemas/emails.schema";

export function emailsShowApi(
    id: number
): UseQuery<EmailsShowAPI, EmailsShowErrorAPI> {
    return useQuery<EmailsShowAPI, EmailsShowErrorAPI>(
        `/emails/${id}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface EmailsShowAPI {
    success: boolean;
    email: EmailsSchemaFromServer;
}

export interface EmailsShowErrorAPI {
    success: boolean;
    message: string;
}
