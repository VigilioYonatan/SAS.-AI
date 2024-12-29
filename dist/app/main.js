"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const module_alias_1 = require("module-alias");
const node_path_1 = __importDefault(require("node:path"));
(0, module_alias_1.addAlias)("~", node_path_1.default.resolve(__dirname));
(0, module_alias_1.addAlias)("@", node_path_1.default.resolve(__dirname, "services"));
const server_1 = require("~/config/server");
const application = new server_1.Server();
exports.app = application.app;
exports.server = application.listen();
