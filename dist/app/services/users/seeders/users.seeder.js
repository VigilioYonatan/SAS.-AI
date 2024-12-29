"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersSeeder = void 0;
const helpers_1 = require("@vigilio/express-core/helpers");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const faker_1 = require("@faker-js/faker");
exports.usersSeeder = Array.from({
    length: 100,
}).map((_, i) => ({
    name: faker_1.faker.person.firstName(),
    buys: [],
    city_id: null,
    identification_number: null,
    reference: null,
    lastname: faker_1.faker.person.lastName(),
    email: `test${i}@gmail.com`,
    password: bcryptjs_1.default.hashSync("123456a", bcryptjs_1.default.genSaltSync(10)),
    telephone: `12345678${i}`,
    user_code: `USER-${i + 1}`,
    username: "Vigilio1000",
    enabled: true,
    address: null,
    birthday: new Date(),
    photo: [
        {
            file: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${Math.floor(Math.random() * 100) + 1}.jpg`,
            dimension: 300,
        },
    ],
    token: null,
    isOnline: false,
    slug: (0, helpers_1.slug)(`test${i}`),
    enabledNotification: true,
    subscription: null,
    role_id: i === 0 ? 1 : Math.floor(Math.random() * 3) + 1,
    empresa_id: 1,
    isBot: false,
    speciality: null,
}));
