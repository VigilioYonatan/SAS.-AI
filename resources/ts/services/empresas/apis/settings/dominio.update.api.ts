import { useMutation } from "@vigilio/preact-fetching";

export function settingsDominioUpdateApi() {
    return useMutation<
        {
            success: true;
            host: {
                host: string;
                nameserver_one: string;
                nameserver_two: string;
                time: Date | null;
            };
        },
        { host: string | null },
        SettingsDominioUpdateApiError
    >("/empresas/dominio", async (url, body) => {
        const response = await fetch(`/api${url}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}
export function settingsDominioNameServerUpdateApi() {
    return useMutation<{ success: true; url: string }, unknown, unknown>(
        "/empresas/name_servers",
        async (url) => {
            const response = await fetch(`/api${url}`, {
                method: "PUT",
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

interface SettingsDominioUpdateApiError {
    success: true;
    message: string;
    body: keyof { host: string | null };
}
