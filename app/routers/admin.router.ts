import { AdminController } from "@/admin/controllers/admin.controller";
import type { Type } from "@vigilio/express-core";

export const adminRouters: Type[] = [AdminController];
