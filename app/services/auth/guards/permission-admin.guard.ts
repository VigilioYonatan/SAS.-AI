import { attachMiddleware } from "@vigilio/express-core";
import { type NextFunction, type Request, type Response } from "express";
import type { Users } from "@/users/entities/users.entity";

export function PermissionAdmin() {
	return (
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		target: any,
		propertyKey: string,
		_descriptor: PropertyDescriptor,
	) => {
		attachMiddleware(
			target,
			propertyKey,
			(req: Request, res: Response, next: NextFunction) => {
				// local
				if (req.isAuthenticated()) {
					const user = req.user as Users;

					if (!user || !user.enabled || user.role_id !== 1) {
						return res.status(403).json({
							success: false,
							message: "No está permitido realizar esta acción solo admin",
						});
					}
					return next();
				}
				return res.status(403).json({
					success: false,
					message: "Unauthorized",
				});
			},
		);
	};
}
