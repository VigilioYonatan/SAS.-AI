"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complaintsSchema = exports.typeComplaintSchema = exports.typeOfConsumptionSchema = void 0;
const valibot_1 = require("valibot");
exports.typeOfConsumptionSchema = (0, valibot_1.picklistAsync)(["Producto", "Servicio"], "Tipo de consumo no válido");
exports.typeComplaintSchema = (0, valibot_1.picklistAsync)(["Queja", "Reclamo"], "Tipo de queja no válido");
exports.complaintsSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    fullName: (0, valibot_1.string)("El nombre completo es requerido.", [
        (0, valibot_1.minLength)(3, "El nombre completo debe tener al menos 3 caracteres."),
        (0, valibot_1.maxLength)(100, "El nombre completo debe tener como máximo 100 caracteres."),
    ]),
    phone: (0, valibot_1.stringAsync)("El número de teléfono es requerido.", [
        (0, valibot_1.minLength)(6, "El número de teléfono debe tener al menos 9 caracteres."),
        (0, valibot_1.maxLength)(15, "El número de teléfono debe tener como máximo 9 caracteres."),
    ]),
    numberDocument: (0, valibot_1.string)("El número de documento es requerido.", [
        (0, valibot_1.minLength)(6, "El número de documento debe tener al menos 8 caracteres."),
        (0, valibot_1.maxLength)(15, "El número de documento debe tener como máximo 11 caracteres."),
    ]),
    email: (0, valibot_1.string)("El correo electrónico es requerido.", [
        (0, valibot_1.minLength)(3, "El correo electrónico debe tener al menos 3 caracteres."),
        (0, valibot_1.maxLength)(100, "El correo electrónico debe tener como máximo 100 caracteres."),
    ]),
    guardianName: (0, valibot_1.nullable)((0, valibot_1.string)()),
    address: (0, valibot_1.string)("La dirección es requerida.", [
        (0, valibot_1.minLength)(3, "La dirección debe tener al menos 3 caracteres."),
        (0, valibot_1.maxLength)(100, "La dirección debe tener como máximo 100 caracteres."),
    ]),
    typeComplaint: exports.typeComplaintSchema,
    detailsOfComplaint: (0, valibot_1.string)("Los detalles de la queja son requeridos.", [
        (0, valibot_1.minLength)(3, "Los detalles de la queja deben tener al menos 3 caracteres."),
    ]),
    typeOfConsumption: exports.typeOfConsumptionSchema,
    detailsOfConsumption: (0, valibot_1.string)("Los detalles del consumo son requeridos.", [
        (0, valibot_1.minLength)(3, "Los detalles del consumo deben tener al menos 3 caracteres."),
    ]),
    dateOfComplaint: (0, valibot_1.nullable)((0, valibot_1.coerce)((0, valibot_1.date)(), (value) => new Date(value))),
    empresa_id: (0, valibot_1.number)(),
});
