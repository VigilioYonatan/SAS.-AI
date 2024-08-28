import type { Type } from "@vigilio/express-core";
import { WebsocketsController } from "@/websockets/controllers/websockets.controller";

export const socketsRouters: Type[] = [WebsocketsController];
