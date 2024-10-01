import {
    SettingsIconUpdateDto,
    SettingsPhotoUpdateDto,
    SettingsUpdateDto,
} from "@/empresas/dtos/settings.update.dto";
import { useMutation } from "@vigilio/preact-fetching";
import { ResultApiImages, uploadApi } from "~/libs/upload";

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

export function settingsUpdateIconApi() {
    return useMutation<
        ResultApiImages,
        SettingsIconUpdateDto & { name: string },
        SettingsUpdateErrorAPI
    >("/uploads/settings/icon/1", async (url, body) => {
        const result = await uploadApi(`/api${url}`, {
            file: body.icon,
            name: body.name,
        });
        return result;
    });
}
export function settingsUpdatePhotoApi() {
    return useMutation<
        ResultApiImages,
        SettingsPhotoUpdateDto & { name: string },
        SettingsUpdateErrorAPI
    >("/uploads/settings/photo/1", async (url, body) => {
        const result = await uploadApi(`/api${url}`, {
            file: body.photo,
            name: body.name,
        });
        return result;
    });
}
interface SettingsUpdateAPI {
    success: true;
    message: string;
}
interface SettingsUpdateErrorAPI {
    success: false;
    message: string;
}

interface SettingsUpdateApiError {
    success: true;
    message: string;
    body: keyof SettingsUpdateDto;
}
