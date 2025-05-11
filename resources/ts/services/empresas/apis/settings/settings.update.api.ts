import {
    SettingsBackgrounAuthUpdateDto,
    SettingsBackgrounPostsUpdateDto,
    SettingsUpdateDto,
} from "@/empresas/dtos/settings.update.dto";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { useMutation } from "@vigilio/preact-fetching";
import { ResultApiImages, uploadApi } from "~/libs/upload";
export const storeUploadBackgroundAuthBanner =
    "/uploads/settings/background_auth";
export const storeUploadBackgroundPostsBanner =
    "/uploads/settings/background_posts";

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
export function settingsBackgroundAuthUpdateApi() {
    return useMutation<
        ResultApiImages,
        SettingsBackgrounAuthUpdateDto,
        SettingsUpdateApiError
    >(
        `${storeUploadBackgroundAuthBanner}/${storageEmpresa!.id}`,
        async (url, body) => {
            const result = await uploadApi(`/api${url}`, {
                file: body.background_auth,
            });
            return result;
        }
    );
}
export function settingsBackgroundPostsUpdateApi() {
    return useMutation<
        ResultApiImages,
        SettingsBackgrounPostsUpdateDto,
        SettingsUpdateApiError
    >(
        `${storeUploadBackgroundPostsBanner}/${storageEmpresa!.id}`,
        async (url, body) => {
            const result = await uploadApi(`/api${url}`, {
                file: body.background_posts,
            });
            return result;
        }
    );
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
