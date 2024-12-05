import type { Empresas } from "@/empresas/entities/empresas.entity";
import { InternalServerErrorException } from "@vigilio/express-core";
import { custom, string, type DateSchema } from "@vigilio/valibot";
import { exec } from "node:child_process";
import util from "node:util";

/* PRO-00001 */
export async function generateCodeEntity(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    Item: any,
    latestCode: string,
    start: string,
    empresa: Empresas
) {
    const latestUser = await Item.findOne({
        order: [["createdAt", "DESC"]],
        where: {
            empresa_id: empresa.id,
        },
    });
    let code = null;

    if (latestUser) {
        const ultimoNumero = Number.parseInt(
            latestUser[latestCode].split("-")[1]
        );
        code = `${start.toUpperCase()}-${String(ultimoNumero + 1).padStart(
            6,
            "0"
        )}`;
    } else {
        code = `${start.toUpperCase()}-000001`;
    }
    return code;
}
/* get ip */
export async function getIp() {
    const ipResponse = await fetch("https://api.ipify.org");
    const ipResult = await ipResponse.text();
    return ipResult;
}

/* delay */
export async function delay(seg = 10) {
    return new Promise((res) => setTimeout(() => res(true), seg * 1000));
}

/*** random number between*/
export function randomNumber(start: number, end: number) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

export function removeTextHTML(value: string) {
    return value
        ? value
              .replace(/<img[^>]*src="[^"]*"[^>]*>/gi, "")
              .replace(/(<([^>]+)>)/gi, "")
        : null;
}

/* dolar */

export function distanciaDeLevenshtein(a: string, b: string) {
    const lenA = a.length;
    const lenB = b.length;
    const matrix = Array(lenA + 1);

    for (let i = 0; i <= lenA; i++) {
        matrix[i] = Array(lenB + 1).fill(0);
    }

    for (let i = 0; i <= lenA; i++) {
        matrix[i][0] = i;
    }
    for (let j = 0; j <= lenB; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= lenA; i++) {
        for (let j = 1; j <= lenB; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, // Eliminación
                matrix[i][j - 1] + 1, // Inserción
                matrix[i - 1][j - 1] + cost // Sustitución
            );
        }
    }

    return matrix[lenA][lenB];
}
// nos trae 0,5,10 depende de cuantos numeros hay
export function createIncrementArray(numbers: number[]): number[] {
    const resultado = new Set<number>(); // Usamos Set para evitar duplicados
    for (const num of numbers) {
        const multiploMasCercano = Math.floor(num / 5) * 5;
        resultado.add(multiploMasCercano);
    }
    return Array.from(resultado).sort((a, b) => a - b);
}

export function NoImage() {
    return "/images/settings/others/no-image.webp";
}

const execAsync = util.promisify(exec);

export async function terminal(comando: string, ignore = false) {
    try {
        const { stdout, stderr } = await execAsync(comando);
        if (stderr && !ignore) {
            throw new InternalServerErrorException(
                `Error en el comando, ${stderr}`
            );
        }
        return stdout; // Devuelve la salida estándar
    } catch (error) {
        throw new InternalServerErrorException(
            `Error server, ${(error as Error).message}`
        );
    }
}
export function datetime() {
    return string([
        custom((val) => {
            return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(
                val as unknown as string
            );
        }, "Fecha no válida"),
    ]) as unknown as DateSchema;
}
