import { signal } from "@preact/signals";
import type { AuthLogin } from "../schemas/auth.schema";
export const authStorage = JSON.parse(
    localStorage.getItem("user") ?? "null"
) as AuthLogin;
const auth = signal<AuthLogin | null>(authStorage);

function useAuthStore() {
    function permissionAdminGuard() {
        return auth.value?.role_id === 1;
    }

    function updateUser(user: Partial<AuthLogin>) {
        auth.value = { ...auth.value, ...(user as AuthLogin) };
    }
    return {
        state: auth.value,
        methods: { updateUser },
        guards: {
            permissionAdminGuard,
        },
    };
}

export default useAuthStore;
