import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import { Users } from "@/users/entities/users.entity";
import { Op } from "sequelize";

export function localStrategy() {
	return new LocalStrategy(
		{ usernameField: "telephone", passReqToCallback: true },
		async (req, telephone, password, done) => {
			// como puedo usar req
			const user = await Users.findOne({
				where: {
					[Op.or]: [
						{ telephone: telephone }, // Suponiendo que 'identifier' puede ser teléfono o email
						{ email: telephone },
					],
					empresa_id: req.body.empresa_id,
				},
			});
			if (!user) {
				// por buena practica y seguridad insertar error similar para que el cliente no sepa cual es el error el correo o contraseña
				return done(null, false, {
					// error que se lleva al cliente
					message: "Télefono, Correo electrónico o contraseña incorrecta",
				});
			}
			const validPassword = bcryptjs.compareSync(password, user.password);
			if (!validPassword) {
				return done(null, false, {
					message: "Télefono, Correo electrónico o contraseña incorrecta",
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
				role_id: user.role_id,
			});
		},
	);
}
