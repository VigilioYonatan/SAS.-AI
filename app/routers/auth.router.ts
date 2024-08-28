import { AuthController } from "@/auth/controllers/auth.controller";
import type { Type } from "@vigilio/express-core";

export const authRouters: Type[] = [AuthController];
