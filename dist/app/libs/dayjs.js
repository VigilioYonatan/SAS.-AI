"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOW = NOW;
exports.TimePeru = TimePeru;
exports.restarDays = restarDays;
exports.formatDateTwo = formatDateTwo;
exports.isDateWithin = isDateWithin;
exports.getTime = getTime;
exports.formatTime = formatTime;
const dayjs_1 = __importDefault(require("dayjs"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
dayjs_1.default.extend(timezone_1.default);
dayjs_1.default.extend(utc_1.default);
function NOW(empresa) {
    return (0, dayjs_1.default)().tz(empresa.tz);
}
function TimePeru(empresa, date) {
    return (0, dayjs_1.default)(date).tz(empresa.tz);
}
function restarDays(empresa, now, back, time = "minute") {
    return (0, dayjs_1.default)(back).tz(empresa.tz).diff(now, time);
}
function formatDateTwo(empresa, date, format = "DD-MM-YYYY hh:mm A") {
    return (0, dayjs_1.default)(date).tz(empresa.tz).format(format);
}
function isDateWithin(empresa, date, timer, time = "days") {
    const today = (0, dayjs_1.default)(date).tz(empresa.tz);
    const twoWeeksFromNow = today.add(timer, time);
    return NOW(empresa).isAfter(twoWeeksFromNow);
}
function getTime(empresa) {
    const day = (0, dayjs_1.default)().tz(empresa.tz);
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
    const startOfYesterday = day.subtract(1, "day").startOf("day").utc().format();
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
function formatTime(empresa, time) {
    const partesHora = time.split(":");
    const horas = Number.parseInt(partesHora[0], 10);
    const minutos = Number.parseInt(partesHora[1], 10);
    const fecha = NOW(empresa).hour(horas).minute(minutos);
    return fecha;
}
exports.default = dayjs_1.default;
