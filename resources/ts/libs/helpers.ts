import dayjs, { type OpUnitType, type QUnitType } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import type { Path, UseFormReturn } from "react-hook-form";
import { c, sweetAlert, sweetModal } from "@vigilio/sweet";
import duration from "dayjs/plugin/duration";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import { prominent } from "color.js";

dayjs.extend(relativeTime);
dayjs.locale("es");
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(duration);
dayjs.tz.setDefault(storageEmpresa!.tz);

export function NOW() {
    return dayjs().tz(storageEmpresa!.tz);
}

export function TimePeru(date: Date | string | number | dayjs.Dayjs) {
    return dayjs(date).tz(storageEmpresa!.tz);
}
export function restarDays(
    now: Date | string | number | dayjs.Dayjs,
    back: Date | string | number | dayjs.Dayjs,
    time: QUnitType | OpUnitType = "minute"
) {
    return dayjs(back).tz(storageEmpresa!.tz).diff(now, time);
}

export function formatDateTwo(
    date: string | Date | number,
    format = "DD-MM-YYYY"
): string | Date {
    return dayjs(date).tz(storageEmpresa!.tz).format(format);
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
    return NOW().to(dayjs(date).tz(storageEmpresa!.tz));
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
    const today = dayjs(date).tz(storageEmpresa!.tz);
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
    return value
        ? value
              .replace(/<img[^>]*src="[^"]*"[^>]*>/gi, "")
              .replace(/(<([^>]+)>)/gi, "")
        : "";
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
export async function onPageVideo<T extends object>(
    form: UseFormReturn<T>,
    key: keyof T
) {
    const text = await navigator.clipboard.readText();
    if (!text.startsWith("https://vimeo.com")) {
        sweetAlert({
            icon: "info",
            title: "Url de video VIMEO no válido",
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

export function getPeriodDescription(dias: number) {
    if (dias === 1) {
        return "1 día";
    }
    if (dias === 7) {
        return "1 semana";
    }
    if (dias === 30) {
        return "1 mes";
    }
    if (dias === 365) {
        return "1 año";
    }
    if (dias % 365 === 0) {
        return `${dias / 365} años`;
    }
    if (dias % 30 === 0) {
        return `${dias / 30} meses`;
    }
    if (dias % 7 === 0) {
        return `${dias / 7} semanas`;
    }
    if (dias < 7) {
        return `${dias} días`;
    }
    const semanas = Math.floor(dias / 7);
    const diasRestantes = dias % 7;
    return `${semanas} semanas ${diasRestantes} días`;
}
export function isColorLight(hex: string) {
    const hex2 = hex.replace("#", "");
    const r = Number.parseInt(hex2.substring(0, 2), 16);
    const g = Number.parseInt(hex2.substring(2, 4), 16);
    const b = Number.parseInt(hex2.substring(4, 6), 16);
    const luminosity = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luminosity > 128;
}
export function getDominantColorFromFile(file: File) {
    return new Promise((res, rej) => {
        const reader = new FileReader();
        // Cuando el archivo se ha leído
        reader.onload = async (e) => {
            const imageUrl = e.target!.result; // URL de datos de la imagen
            if (imageUrl) {
                try {
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    const color = await prominent(imageUrl as any, {
                        sample: 10,
                    });
                    res(color);
                } catch (error) {
                    rej(null);
                }
            }
        };
        // Leer el archivo como URL de datos
        reader.readAsDataURL(file);
    });
}
export function rgbToHex(rgbArray: string[]) {
    return rgbArray
        .map((value) => {
            // Convierte cada valor a hexadecimal y asegura que tenga dos dígitos
            const hex = Number(value).toString(16).padStart(2, "0");
            return hex;
        })
        .join("");
}

export function getColorPrimary() {
    return useEmpresastore().state?.setting.bg_color;
}

export async function getPrincipalColor(file: File) {
    return new Promise((res) => {
        if (file?.type.startsWith("image/")) {
            const img = new Image();
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target?.result) {
                    img.src = event.target.result as string;
                }
            };

            reader.readAsDataURL(file); // Leer la imagen como DataURL

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    // Establecer dimensiones del canvas igual que la imagen
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Dibujar la imagen en el canvas
                    ctx.drawImage(img, 0, 0, img.width, img.height);

                    // Obtener los datos de los píxeles
                    const imageData = ctx.getImageData(
                        0,
                        0,
                        img.width,
                        img.height
                    );
                    const data = imageData.data;

                    const colorFrequency: { [key: string]: number } = {};

                    // Iterar sobre los píxeles para contar los colores
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        const a = data[i + 3];

                        // Ignorar píxeles transparentes
                        if (a < 128) continue;

                        // Crear una clave única para el color (RGB)
                        const colorKey = `${r},${g},${b}`;

                        // Contar la frecuencia del color
                        if (colorFrequency[colorKey]) {
                            colorFrequency[colorKey]++;
                        } else {
                            colorFrequency[colorKey] = 1;
                        }
                    }

                    // Encontrar el color más frecuente
                    let dominantColor: string | null = null;
                    let maxCount = 0;

                    for (const color in colorFrequency) {
                        if (colorFrequency[color] > maxCount) {
                            maxCount = colorFrequency[color];
                            dominantColor = color;
                        }
                    }

                    if (dominantColor) {
                        // Convertir el color dominante a un objeto Color de color.js
                        const [r, g, b] = dominantColor
                            .split(",")
                            .map((num) => Number.parseInt(num));
                        function rgbToHex(
                            r: number,
                            g: number,
                            b: number
                        ): string {
                            return `#${((1 << 24) | (r << 16) | (g << 8) | b)
                                .toString(16)
                                .slice(1)
                                .toUpperCase()}`;
                        }
                        const dominantColorInstance = rgbToHex(r, g, b);

                        res(dominantColorInstance);
                    }
                }
            };
        }
    });
}

export async function getBackgroundColorImgen(file: File) {
    return new Promise((res) => {
        if (file?.type.startsWith("image/")) {
            const img = new Image();
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target?.result) {
                    img.src = event.target.result as string;
                }
            };

            reader.readAsDataURL(file); // Leer la imagen como DataURL

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    // Establecer el tamaño del canvas a las dimensiones de la imagen
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Dibujar la imagen en el canvas
                    ctx.drawImage(img, 0, 0, img.width, img.height);

                    // Obtener los píxeles de las esquinas (esquinas + borde)
                    const esquinaSuperiorIzquierda = ctx.getImageData(
                        0,
                        0,
                        1,
                        1
                    ).data;
                    const esquinaSuperiorDerecha = ctx.getImageData(
                        img.width - 1,
                        0,
                        1,
                        1
                    ).data;
                    const esquinaInferiorIzquierda = ctx.getImageData(
                        0,
                        img.height - 1,
                        1,
                        1
                    ).data;
                    const esquinaInferiorDerecha = ctx.getImageData(
                        img.width - 1,
                        img.height - 1,
                        1,
                        1
                    ).data;

                    // Promediar los colores de las esquinas
                    const r =
                        (esquinaSuperiorIzquierda[0] +
                            esquinaSuperiorDerecha[0] +
                            esquinaInferiorIzquierda[0] +
                            esquinaInferiorDerecha[0]) /
                        4;
                    const g =
                        (esquinaSuperiorIzquierda[1] +
                            esquinaSuperiorDerecha[1] +
                            esquinaInferiorIzquierda[1] +
                            esquinaInferiorDerecha[1]) /
                        4;
                    const b =
                        (esquinaSuperiorIzquierda[2] +
                            esquinaSuperiorDerecha[2] +
                            esquinaInferiorIzquierda[2] +
                            esquinaInferiorDerecha[2]) /
                        4;

                    // Convertir el color promedio de RGB a HEX
                    const hexColor = `#${((1 << 24) | (r << 16) | (g << 8) | b)
                        .toString(16)
                        .slice(1)
                        .toUpperCase()}`;
                    res(hexColor);
                }
            };
        }
    });
}
export function getParams() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    return params;
}
export default dayjs;
