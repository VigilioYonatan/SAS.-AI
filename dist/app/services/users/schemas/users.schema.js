"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersSchema = exports.subscription = void 0;
const helpers_1 = require("@vigilio/express-core/helpers");
const valibot_1 = require("@vigilio/valibot");
const libs_1 = require("../libs");
const uploads_schema_1 = require("@/uploads/schemas/uploads.schema");
exports.subscription = (0, valibot_1.objectAsync)({
    endpoint: (0, valibot_1.string)(),
    keys: (0, valibot_1.object)({ p256dh: (0, valibot_1.string)(), auth: (0, valibot_1.string)() }),
});
exports.usersSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    user_code: (0, valibot_1.string)(),
    username: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(1), (0, valibot_1.minLength)(6), (0, valibot_1.maxLength)(30)]),
    identification_number: (0, valibot_1.nullable)((0, valibot_1.string)("Documento de identidad no válido")),
    name: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(1), (0, valibot_1.minLength)(3), (0, valibot_1.maxLength)(30)]),
    lastname: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(3), (0, valibot_1.maxLength)(60)])),
    birthday: (0, valibot_1.nullable)((0, valibot_1.coerce)((0, valibot_1.date)(), (value) => new Date(value))),
    email: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(1), (0, valibot_1.email)(), (0, valibot_1.maxLength)(100)])),
    password: (0, valibot_1.string)([
        (0, valibot_1.toTrimmed)(),
        (0, valibot_1.minLength)(1),
        (0, valibot_1.minLength)(6),
        (0, valibot_1.maxLength)(30),
        (0, valibot_1.custom)((val) => /[a-zA-Z]/.test(val), "Debe tener por lo menos una letra."),
        (0, valibot_1.custom)((val) => /\d/.test(val), "Debe tener por lo menos un número."),
    ]),
    address: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(10), (0, valibot_1.maxLength)(100)])),
    telephone: (0, valibot_1.string)([
        (0, valibot_1.toTrimmed)(),
        (0, valibot_1.minLength)(6),
        (0, valibot_1.custom)((value) => /^\d+$/.test(value), "Este campo solo permite números."),
    ]),
    reference: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.minLength)(10), (0, valibot_1.maxLength)(100)])),
    photo: (0, valibot_1.nullable)((0, valibot_1.array)((0, uploads_schema_1.filesSchema)(libs_1.usersPhotoQualities))),
    enabled: (0, valibot_1.boolean)(),
    isOnline: (0, valibot_1.boolean)(),
    slug: (0, valibot_1.transform)((0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(1), (0, valibot_1.minLength)(3), (0, valibot_1.maxLength)(30)]), helpers_1.slug),
    token: (0, valibot_1.nullable)((0, valibot_1.string)()),
    speciality: (0, valibot_1.nullable)((0, valibot_1.string)()),
    role_id: (0, valibot_1.number)(),
    empresa_id: (0, valibot_1.number)(),
    isBot: (0, valibot_1.boolean)(),
    subscription: (0, valibot_1.nullableAsync)(exports.subscription),
    buys: (0, valibot_1.nullable)((0, valibot_1.array)((0, valibot_1.object)({
        title: (0, valibot_1.string)(),
        date: (0, valibot_1.nullable)((0, valibot_1.coerce)((0, valibot_1.date)(), (val) => new Date(val))),
        order: (0, valibot_1.string)(),
    }))),
    enabledNotification: (0, valibot_1.nullable)((0, valibot_1.boolean)()),
    city_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
});
