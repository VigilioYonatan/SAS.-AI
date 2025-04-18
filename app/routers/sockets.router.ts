import { WebsocketsController } from "@/websockets/controllers/websockets.controller";
import type { Type } from "@vigilio/express-core";

export const socketsRouters: Type[] = [WebsocketsController];
