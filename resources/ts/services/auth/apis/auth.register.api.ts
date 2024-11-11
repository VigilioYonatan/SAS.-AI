import { useMutation } from "@vigilio/preact-fetching";
import type { AuthRegisterDto } from "../dtos/auth.register.dto";

export function authRegisterApi() {
    return useMutation<AuthRegisterAPI, AuthRegisterDto, AuthRegisterErrorAPI>(
        "/auth/register",
        async (url, body) => {
            const response = await fetch(`/api${url}`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "content-type": "application/json",
                },
            });
            const result: AuthRegisterAPI = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface AuthRegisterAPI {
    success: boolean;
    user: User;
}

export interface User {
    id: string;
    username: string;
    telephone: string;
    slug: string;
}
export interface AuthRegisterErrorAPI {
    success: boolean;
    message: string;
    body: keyof AuthRegisterDto;
}
