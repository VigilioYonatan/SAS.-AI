import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { EmailsSchemaFromServer } from "../schemas/emails.schema";

export function emailsAccountApi(
    id: string
): UseQuery<EmailsAccountsAPI, EmailsAccountsErrorAPI> {
    return useQuery<EmailsAccountsAPI, EmailsAccountsErrorAPI>(
        `/emails/accounts/${id}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!response.ok) throw result;
            return result;
        }
    );
}

export interface EmailsAccountsAPI {
    success: boolean;
    email: EmailsSchemaFromServer;
}

export interface EmailsAccountsErrorAPI {
    success: boolean;
    message: string;
}
