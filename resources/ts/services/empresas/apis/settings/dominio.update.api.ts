import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function settingsDominioUpdateApi() {
    return useMutation<
        {
            success: true;
            host: {
                host: string;
                nameserver_one: string;
                nameserver_two: string;
                time: Date | null;
                enabled: boolean;
            };
        },
        { host: string | null },
        SettingsDominioUpdateApiError
    >(`/empresas/${storageEmpresa!.slug}/dominio`, async (url, body) => {
        const response = await fetch(`/api${url}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
                "access-token": enviroments.VITE_TOKEN_VIGILIO_SERVICES,
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}
export function settingsDominioNameServerUpdateApi() {
    return useMutation<{ success: true; url: string }, unknown, unknown>(
        `/empresas/${storageEmpresa!.slug}/name_servers`,
        async (url) => {
            const response = await fetch(`/api${url}`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                    "access-token": enviroments.VITE_TOKEN_VIGILIO_SERVICES,
                },
            });
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}
export function settingsDominioDeleteServerUpdateApi() {
    return useMutation<{ success: true; url: string }, unknown, unknown>(
        `/empresas/${storageEmpresa!.slug}/dominio`,
        async (url) => {
            const response = await fetch(`/api${url}`, {
                method: "DELETE",
                headers: {
                    "access-token": enviroments.VITE_TOKEN_VIGILIO_SERVICES,
                },
            });
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

interface SettingsDominioUpdateApiError {
    success: true;
    message: string;
    body: keyof { host: string | null };
}
