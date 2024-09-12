import type { Empresas } from "@/empresas/entities/empresas.entity";
import { Users } from "@/users/entities/users.entity";
import { Injectable } from "@vigilio/express-core";

@Injectable()
export class AuthService {
	async forgotPassword(empresa: Empresas, token: string | null) {
		let userByToken = null;
		if (token) {
			const user = await Users.findOne({
				where: { token, empresa_id: empresa.id },
				attributes: ["id", "username", "enabled", "empresa_id"],
			});
			if (user) {
				await user.update({ token: null });
				userByToken = user;
			}
		}

		return {
			user: userByToken,
		};
	}
	async confirmedAccount(empresa: Empresas, token: string | null) {
		let userByToken = null;
		if (token) {
			const user = await Users.findOne({
				where: {
					token,
					empresa_id: empresa.id,
				},
				attributes: ["id", "username", "token", "enabled", "empresa_id"],
			});

			if (user && !user.enabled) {
				// activar cuenta
				await user.update({ enabled: true, token: null });
				userByToken = user;
			}
		}

		return {
			user: userByToken,
		};
	}
}
