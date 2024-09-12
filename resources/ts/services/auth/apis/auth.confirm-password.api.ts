import { useMutation } from "@vigilio/preact-fetching";
import type { AuthConfirmPasswordDto } from "../dtos/auth.confirm-password.dto";

export function authConfirmPasswordApi() {
    return useMutation<
        AuthConfirmPasswordAPI,
        AuthConfirmPasswordDto,
        AuthConfirmPasswordErrorAPI
    >("/auth/confirm-password", async (url, body) => {
        const response = await fetch(`/api${url}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
        });
        const result: AuthConfirmPasswordAPI = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface AuthConfirmPasswordAPI {
    success: boolean;
    message: string;
}

export interface AuthConfirmPasswordErrorAPI {
    success: boolean;
    message: string;
    body: keyof AuthConfirmPasswordDto;
}
