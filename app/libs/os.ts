import { exec } from "node:child_process";
import os from "node:os";
import util from "node:util";
import enviroments from "~/config/enviroments.config";
import cron from "node-cron";
import { terminal } from "./helpers";
export function checkCPUUsage() {
    const cpus = os.cpus();
    let idle = 0;
    let total = 0;

    for (const cpu of cpus) {
        for (const type in cpu.times) {
            total += cpu.times[type as keyof typeof cpu.times];
        }
        idle += cpu.times.idle;
    }

    const usage = 1 - idle / total;
    return usage;
}

const execPromise = util.promisify(exec);

export async function checkDiskUsage() {
    try {
        const { stdout } = await execPromise("df -h /");

        const lines = stdout.split("\n");
        const diskInfo = lines[1].split(/\s+/); // Parsear la segunda línea

        const usedPercentage = Number.parseFloat(diskInfo[4].replace("%", ""));
        return usedPercentage;
    } catch (error) {
        console.error(`Error ejecutando df: ${(error as Error).message}`);
        return 0; // Retorna un valor por defecto en caso de error
    }
}

// VIGILIO SERVICES
export async function updateVigilioServices(
    body: Partial<{
        name: string;
        cpu: number;
        disk: number;
        enabled: boolean;
    }>
) {
    const response = await fetch(
        `${enviroments.VITE_VIGILIO_WEB}/api/vps/${enviroments.CLIENT}`,
        {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "access-token": enviroments.VITE_TOKEN_VIGILIO_SERVICES,
            },
        }
    );
    const result = await response.json();
    return result;
}

cron.schedule("* * * * *", async () => {
    try {
        await terminal(
            "cd /root/home/temp_db && \
			rm -f ./temp_db/backup.sql && \
			docker exec saas-db-1 pg_dump -U postgres -d saas -F c -f /var/lib/postgresql/data/backup.sql && \
            docker cp saas-db-1:/var/lib/postgresql/data/backup.sql ./temp_db/backup.sql"
        );
    } catch (error) {}
});
