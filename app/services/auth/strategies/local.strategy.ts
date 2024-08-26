import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import { Users } from "@/users/entities/users.entity";
import { Op } from "sequelize";

export function localStrategy() {
    return new LocalStrategy(
        { usernameField: "identifier" },
        async (identifier, password, done) => {
            const user = await Users.findOne({
                where: {
                    [Op.or]: [{ email: identifier }, { telephone: identifier }],
                },
            });
            if (!user) {
                // por buena practica y seguridad insertar error similar para que el cliente no sepa cual es el error el correo o contraseña
                return done(null, false, {
                    // error que se lleva al cliente
                    message:
                        "Correo electrónico, télefono o contraseña incorrecta",
                });
            }
            const validPassword = bcryptjs.compareSync(password, user.password);
            if (!validPassword) {
                return done(null, false, {
                    message:
                        "Correo electrónico, télefono o contraseña incorrecta",
                });
            }
            if (!user.enabled) {
                return done(null, false, {
                    message:
                        "Esta cuenta no está habilitado para ingresar en este momento.",
                });
            }
            // esto guarda en cookie id de usuario
            return done(null, {
                id: user.id,
            });
        }
    );
}
