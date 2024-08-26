import { NoProfileImage } from "~/config/settings";
import { printFileWithDimension, type FilesSchema } from "~/libs/upload";

export type UsersFotoQualities = 100 | 300;
export const arrayRoles = [
    { key: 1, value: "Administrador" },
    { key: 2, value: "Trabajador" },
];

export function icoRoleColor(role: number): string {
    const roles: Record<number, string> = {
        1: "bg-black",
        2: "bg-blue-600",
    };
    return roles[role] || "bg-blue-600";
}

export function printFileUser(
    foto: FilesSchema[] | null,
    quality: UsersFotoQualities = 300
) {
    let images = [NoProfileImage()];
    if (foto) {
        images = printFileWithDimension(foto, quality) as string[];
    }
    return images;
}
export function numberPhoneFormated(telephone: string) {
    const numeroComoCadena = telephone.toString().split("").reverse().join("");

    const numeroFormateado = numeroComoCadena
        .replace(/(\d{3})/g, "$1-")
        .slice(0, -1)
        .split("")
        .reverse()
        .join("");
    return numeroFormateado;
}
