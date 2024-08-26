import dayjs, { type OpUnitType, type QUnitType } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import type { Path, UseFormReturn } from "react-hook-form";
import { c, sweetModal } from "@vigilio/sweet";
import duration from "dayjs/plugin/duration";

dayjs.extend(relativeTime);
dayjs.locale("es");
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(duration);

export function NOW() {
    return dayjs().tz("America/Lima").utc(true);
}

export function TimePeru(date: Date | string | number | dayjs.Dayjs) {
    return dayjs(date).tz("America/Lima").utc(true);
}
export function restarDays(
    now: Date | string | number | dayjs.Dayjs,
    back: Date | string | number | dayjs.Dayjs,
    time: QUnitType | OpUnitType = "minute"
) {
    return dayjs(back).diff(now, time);
}

export function formatDateTwo(
    date: string | Date | number,
    format = "DD-MM-YYYY"
): string | Date {
    return dayjs(date).tz("America/Lima").utc(true).format(format);
}
export function delay(seg = 1) {
    return new Promise((res, _rej) => {
        setTimeout(() => {
            res(true);
        }, seg * 1000);
    });
}

/*****    convert time - example: hace 25 minutos *****/
export function showTime(date: Date | number | string | dayjs.Dayjs) {
    return NOW().to(dayjs(date).tz("America/Lima").utc(true));
}

// handle error
export function handlerError<T extends object>(
    form: UseFormReturn<T>,
    error: { success: boolean; body: string; message: string }
) {
    if (error?.body) {
        form.setError(error.body as Path<T>, {
            message: error.message,
        });
        form.resetField(error.body as Path<T>, {
            keepError: true,
        });

        return;
    }
    sweetModal({
        icon: "danger",
        title: "Error en el servidor",
        text: `${error.message}`,
    });
}
// verificar si esta dentro de esa fecha. pones la fecha . la fecha esta despues de 7 dias?
export function isDateWithin(
    date: Date | string,
    timer: number,
    time: dayjs.ManipulateType = "days"
) {
    const today = dayjs(date);
    const twoWeeksFromNow = today.add(timer, time);

    return NOW().isAfter(twoWeeksFromNow);
}

/* 10:00 */
export function formatTime(time: string) {
    const partesHora = time.split(":");
    const horas = Number.parseInt(partesHora[0], 10); // Convertir la parte de las horas a un número entero
    const minutos = Number.parseInt(partesHora[1], 10);
    const fecha = NOW().hour(horas).minute(minutos);
    return fecha;
}

export function onDownload(url: string, name: string | null = null) {
    const a = c("a") as HTMLLinkElement;
    a.href = url;
    if (name) {
        a.setAttribute("download", name);
    }
    a.click();
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function deepEqual(obj1: any, obj2: any): boolean {
    // Comparación de igualdad directa
    if (obj1 === obj2) {
        return true;
    }
    // Verificación de null y tipo de objeto
    if (
        obj1 == null ||
        obj2 == null ||
        typeof obj1 !== "object" ||
        typeof obj2 !== "object"
    ) {
        return false;
    }
    // Obtención de las claves de los objetos
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    // Comparación de la longitud de las claves
    if (keys1.length !== keys2.length) {
        return false;
    }
    // Comparación de los valores de las claves
    for (const key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function areArraysEqual(array1: any[], array2: any[]): boolean {
    // Comparación de la longitud de los arrays
    if (array1.length !== array2.length) {
        return false;
    }
    // Comparación de los elementos del array
    for (let i = 0; i < array1.length; i++) {
        if (!deepEqual(array1[i], array2[i])) {
            return false;
        }
    }

    return true;
}
/*** random number between*/
export function randomNumber(start: number, end: number) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}
/* isActiveURL /tienda. 
    include. true /tienda/sds
*/
export function isActive(uri: string, include = true) {
    if (include) {
        return window.location.pathname.startsWith(uri);
    }
    return window.location.pathname === uri;
}
export function removeTextHTML(value: string) {
    return value.replace(/(<([^>]+)>)/gi, "");
}

export function formatTelephoneNumber(telephone: string) {
    return telephone.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
}
export default dayjs;
