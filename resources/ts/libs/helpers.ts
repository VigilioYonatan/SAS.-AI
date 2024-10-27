import dayjs, { type OpUnitType, type QUnitType } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import type { Path, UseFormReturn } from "react-hook-form";
import { c, sweetAlert, sweetModal } from "@vigilio/sweet";
import duration from "dayjs/plugin/duration";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

dayjs.extend(relativeTime);
dayjs.locale("es");
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(duration);
dayjs.tz.setDefault(storageEmpresa!.tz);

export function NOW() {
    return dayjs();
}

export function TimePeru(date: Date | string | number | dayjs.Dayjs) {
    return dayjs(date);
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
    return dayjs(date).format(format);
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
    return NOW().to(dayjs(date));
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
export async function onDownloadImage(
    imageurl: string,
    name: string | null = null
) {
    const response = await fetch(`/proxy?url=${imageurl}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = c("a") as HTMLLinkElement;
    a.href = url;
    if (name) {
        a.setAttribute("download", name);
    }
    a.click();
    URL.revokeObjectURL(url);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function deepEqual(arr1: any, arr2: any) {
    if (arr1.length !== arr2.length) {
        return false; // Si tienen diferente longitud, no son iguales
    }
    // Convertimos los arrays en sets de strings para compararlos independientemente del orden
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const set1 = new Set(arr1.map((item: any) => JSON.stringify(item)));
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const set2 = new Set(arr2.map((item: any) => JSON.stringify(item)));

    // Verificamos si ambos sets son iguales
    for (const item of set1) {
        if (!set2.has(item)) {
            return false; // Si algún elemento no está en ambos sets, no son iguales
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
export async function onPageImage<T extends object>(
    form: UseFormReturn<T>,
    key: keyof T
) {
    const text = await navigator.clipboard.readText();
    if (!text.startsWith("http")) {
        sweetAlert({
            icon: "info",
            title: "Buscar y copiar <i class='far fa-copy'></i> imagen en  <i class='fas fa-cogs'></i>",
        });
        return;
    }
    try {
        const response = await fetch(`/proxy?url=${text}`);
        const blob = await response.blob(); // Convertir a blob
        const file = new File([blob], text, { type: "image/webp" });
        form.setValue(
            key as unknown as Path<T>,
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            [...(form.watch(key as unknown as Path<T>) ?? []), file] as any
        );
        sweetAlert({
            icon: "success",
            title: "Imagen Agregado correctamente",
        });
    } catch (error) {
        sweetAlert({
            icon: "danger",
            title: "Error imagen",
        });
    }
}
export default dayjs;
