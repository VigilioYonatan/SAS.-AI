import { slug } from "@vigilio/express-core/helpers";
import type { UsersSchema } from "../schemas/users.schema";
import bcryptjs from "bcryptjs";

export const adminUser: Omit<UsersSchema, "id"> = {
    name: "yonatan ",
    lastname: "Vigilio Lavado",
    email: "admin@gmail.com",
    password: bcryptjs.hashSync("123456", bcryptjs.genSaltSync(10)),
    telephone: "959884398",
    user_code: "USER-1000",
    username: "Vigilio1000",
    enabled: true,
    address: null,
    birthday: new Date(),
    photo: null,
    token: null,
    isOnline: false,
    slug: slug("Vigilio1000"),
    enabledNotification: true,
    subscription: null,
    role_id: 1,
    empresa_id: 1,
};
