import type { Empresas } from "@/empresas/entities/empresas.entity";
import dayjs, { type OpUnitType, type QUnitType } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(timezone);
dayjs.extend(utc);
// que sea de  ahora. hora peruana
export function NOW(empresa: Empresas) {
    return dayjs().tz(empresa.tz);
}

export function TimePeru(
    empresa: Empresas,
    date: Date | string | number | dayjs.Dayjs
) {
    return dayjs(date).tz(empresa.tz);
}
export function restarDays(
    empresa: Empresas,
    now: Date | string | number | dayjs.Dayjs,
    back: Date | string | number | dayjs.Dayjs,
    time: QUnitType | OpUnitType = "minute"
) {
    return dayjs(back).tz(empresa.tz).diff(now, time);
}
export function formatDateTwo(
    empresa: Empresas,
    date: string | Date | number,
    format = "DD-MM-YYYY hh:mm A"
): string | Date {
    return dayjs(date).tz(empresa.tz).format(format);
} // verificar si esta dentro de esa fecha. pones la fecha
export function isDateWithin(
    empresa: Empresas,
    date: Date | string,
    timer: number,
    time: dayjs.ManipulateType = "days"
) {
    const today = dayjs(date).tz(empresa.tz);
    const twoWeeksFromNow = today.add(timer, time);

    return NOW(empresa).isAfter(twoWeeksFromNow);
}

export function getTime(empresa: Empresas) {
    const day = dayjs().tz(empresa.tz);
    const currentYear = day.year();
    const currentMonth = day.month() + 1;
    const startOfYear = day.startOf("year").utc().format();
    const endOfYear = day.endOf("year").utc().format();
    const startOfToday = day.startOf("day").utc().format();
    const endOfToday = day.endOf("day").utc().format();
    const startOfWeek = day.startOf("week").utc().format();
    const endOfWeek = day.endOf("week").utc().format();
    const startOfMonth = day.startOf("month").utc().format();
    const endOfMonth = day.endOf("month").utc().format();
    const startOfYesterday = day
        .subtract(1, "day")
        .startOf("day")
        .utc()
        .format();
    const endOfYesterday = day.subtract(1, "day").endOf("day").utc().format();

    return {
        currentYear,
        currentMonth,
        startOfYear,
        endOfYear,
        startOfToday,
        endOfToday,
        startOfWeek,
        endOfWeek,
        startOfMonth,
        endOfMonth,
        startOfYesterday,
        endOfYesterday,
    };
}
/* time : 08:00  */
export function formatTime(empresa: Empresas, time: string) {
    const partesHora = time.split(":");
    const horas = Number.parseInt(partesHora[0], 10); // Convertir la parte de las horas a un número entero
    const minutos = Number.parseInt(partesHora[1], 10);
    const fecha = NOW(empresa).hour(horas).minute(minutos);
    return fecha;
}
export default dayjs;
