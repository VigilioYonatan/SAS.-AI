import { authDashboardPermissionMiddleware } from "@/auth/middlewares/auth.middleware";
import { Controller, Get, Res } from "@vigilio/express-core";
import type { Response } from "express";

@Controller("/", [authDashboardPermissionMiddleware])
export class AdminController {
    @Get("/*")
    index(@Res() res: Response) {
        return res.render("admin");
    }
}
