import enviroments from "~/config";

export function logoutUrl() {
    return `${enviroments.VITE_URL}/auth/logout`;
}
