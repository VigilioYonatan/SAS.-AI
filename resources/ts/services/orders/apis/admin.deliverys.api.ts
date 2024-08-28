import { useQuery } from "@vigilio/preact-fetching";

export function adminDeliverysApi() {
    return useQuery<AdminDeliverysAPI, unknown>(
        "/admin/deliverys",
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}
interface AdminDeliverysAPI {
    success: true;
    count: {
        deliverys: number;
        confirmado: number;
        pagados: number;
        problema: number;
    };
}
