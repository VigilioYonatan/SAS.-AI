import { slug } from "@vigilio/express-core/helpers";
import type { UsersSchema } from "../schemas/users.schema";
import bcryptjs from "bcryptjs";
import { faker } from "@faker-js/faker";

export const usersSeeder: Omit<UsersSchema, "id">[] = Array.from({
    length: 100,
}).map((_, i) => ({
    name: faker.person.firstName(),
    buys: [],
    city_id: null,
    identification_number: null,
    reference: null,
    lastname: faker.person.lastName(),
    email: `test${i}@gmail.com`,
    password: bcryptjs.hashSync("123456a", bcryptjs.genSaltSync(10)),
    telephone: `12345678${i}`,
    user_code: `USER-${i + 1}`,
    username: "Vigilio1000",
    enabled: true,
    address: null,
    birthday: new Date(),
    photo: [
        {
            file: `https://randomuser.me/api/portraits/${
                i % 2 === 0 ? "men" : "women"
            }/${Math.floor(Math.random() * 100) + 1}.jpg`,
            dimension: 300,
        },
    ],
    token: null,
    isOnline: false,
    slug: slug(`test${i}`),
    enabledNotification: true,
    subscription: null,
    role_id: i === 0 ? 1 : Math.floor(Math.random() * 3) + 1,
    empresa_id: 1,
    isBot: false,
    speciality: null,
}));
