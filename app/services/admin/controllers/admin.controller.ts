import { authDashboardPermissionMiddleware } from "@/auth/middlewares/auth.middleware";
import { initialMiddleware } from "@/web/middlewares/initial.middleware";
import { Controller, Get, Res } from "@vigilio/express-core";
import type { Response } from "express";

@Controller("/", [authDashboardPermissionMiddleware])
export class AdminController {
    @Get("/*", [initialMiddleware])
    async product(@Res() res: Response) {
        return res.render("admin");
    }
}
