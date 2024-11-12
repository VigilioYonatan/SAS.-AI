import { useMutation } from "@vigilio/preact-fetching";
import type { AuthLoginDto } from "../dtos/auth.login.dto";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

export function authLoginApi() {
    return useMutation<AuthLoginAPI, AuthLoginDto, AuthLoginErrorAPI>(
        "/auth/login",
        async (url, body) => {
            const response = await fetch(`/api${url}`, {
                method: "POST",
                body: JSON.stringify({
                    ...body,
                    empresa_id: storageEmpresa!.id,
                }),
                headers: {
                    "content-type": "application/json",
                },
            });
            const result: AuthLoginAPI = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface AuthLoginAPI {
    success: boolean;
    user: User;
}

export interface User {
    id: number;
    role_id: number;
}
export interface AuthLoginErrorAPI {
    message: string;
    success: false;
    body: keyof AuthLoginDto;
}
