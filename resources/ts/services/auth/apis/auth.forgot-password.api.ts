import { useMutation } from "@vigilio/preact-fetching";
import type { AuthForgotPasswordDto } from "../dtos/auth.forgot-password.dto";

export function authForgotPasswordApi() {
    return useMutation<
        AuthForgotPasswordAPI,
        AuthForgotPasswordDto,
        AuthForgotPasswordErrorAPI
    >("/auth/forgot-password", async (url, body) => {
        const response = await fetch(`/api${url}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
        });
        const result: AuthForgotPasswordAPI = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface AuthForgotPasswordAPI {
    success: boolean;
    message: string;
}

export interface AuthForgotPasswordErrorAPI {
    success: boolean;
    message: string;
    body: keyof AuthForgotPasswordDto;
}
