import { SettingsUpdateDto } from "@/empresas/dtos/settings.update.dto";
import { useMutation } from "@vigilio/preact-fetching";

export function settingsUpdateApi() {
    return useMutation<
        SettingsUpdateAPI,
        SettingsUpdateDto,
        SettingsUpdateApiError
    >("/settings", async (url, body) => {
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

interface SettingsUpdateAPI {
    success: true;
    message: string;
}

interface SettingsUpdateApiError {
    success: true;
    message: string;
    body: keyof SettingsUpdateDto;
}
