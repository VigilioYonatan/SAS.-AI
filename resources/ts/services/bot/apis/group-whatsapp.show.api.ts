import { useQuery } from "@vigilio/preact-fetching";
import type { ContactsSchema } from "@/empresas/schemas/empresas.schema";

export function groupWhatsappShowApi(name: string) {
    return useQuery<GroupWhatsappShowAPI, unknown>(
        `/empresas/group-whatsapp/${name}`,
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface GroupWhatsappShowAPI {
    success: boolean;
    group: { name: string; members: ContactsSchema[] };
}
