"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCPUUsage = checkCPUUsage;
exports.checkDiskUsage = checkDiskUsage;
exports.updateVigilioServices = updateVigilioServices;
const node_child_process_1 = require("node:child_process");
const node_os_1 = __importDefault(require("node:os"));
const node_util_1 = __importDefault(require("node:util"));
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
const node_cron_1 = __importDefault(require("node-cron"));
const helpers_1 = require("./helpers");
function checkCPUUsage() {
    const cpus = node_os_1.default.cpus();
    let idle = 0;
    let total = 0;
    for (const cpu of cpus) {
        for (const type in cpu.times) {
            total += cpu.times[type];
        }
        idle += cpu.times.idle;
    }
    const usage = 1 - idle / total;
    return usage;
}
const execPromise = node_util_1.default.promisify(node_child_process_1.exec);
function checkDiskUsage() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { stdout } = yield execPromise("df -h /");
            const lines = stdout.split("\n");
            const diskInfo = lines[1].split(/\s+/);
            const usedPercentage = Number.parseFloat(diskInfo[4].replace("%", ""));
            return usedPercentage;
        }
        catch (error) {
            console.error(`Error ejecutando df: ${error.message}`);
            return 0;
        }
    });
}
function updateVigilioServices(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${enviroments_config_1.default.VITE_VIGILIO_WEB}/api/vps/${enviroments_config_1.default.CLIENT}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "access-token": enviroments_config_1.default.VITE_TOKEN_VIGILIO_SERVICES,
            },
        });
        const result = yield response.json();
        return result;
    });
}
node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, helpers_1.terminal)("cd /root/home && \
            mkdir temp_db || true && \
			rm -f ./temp_db/backup.sql && \
			docker exec saas-db-1 pg_dump -U postgres -d saas -F c -f /var/lib/postgresql/data/backup.sql && \
            docker cp saas-db-1:/var/lib/postgresql/data/backup.sql ./temp_db/backup.sql");
    }
    catch (error) { }
}));
