import { useQuery } from "@vigilio/preact-fetching";
import type { GroupWhatsapp } from "@/empresas/schemas/empresas.schema";

export function groupWhatsappIndexApi() {
    return useQuery<GroupWhatsappIndexAPI, unknown>(
        "/empresas/group-whatsapp",
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface GroupWhatsappIndexAPI {
    success: boolean;
    data: GroupWhatsapp[];
}
