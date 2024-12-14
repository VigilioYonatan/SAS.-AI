import { terminal } from "~/libs/helpers";
import fs from "node:fs";
import {
    BadRequestException,
    InternalServerErrorException,
} from "@vigilio/express-core";
import { NodeSSH } from "node-ssh";

interface OnNginx {
    sub_domain: string;
    port: number;
    domain?: string;
}
export async function onNginx({ sub_domain, port, domain }: OnNginx) {
    try {
        const CONFIG_FILE = `/etc/nginx/sites-available/${
            domain ? domain : sub_domain
        }`;
        const configContent = `server {
			server_name ${domain ? domain : `${sub_domain}.vigilio-services.com`} www.${
            domain ? domain : `${sub_domain}.vigilio-services.com`
        };
			client_max_body_size 100M; # permite subir archivos mas de 100mb

			location / {
				proxy_pass http://localhost:${port}; # Cambia 3000 por el puerto en el que corre tu app N>
				proxy_http_version 1.1;
				proxy_set_header Upgrade $http_upgrade;
				proxy_set_header Connection 'upgrade';
				proxy_set_header Host $host;
				proxy_cache_bypass $http_upgrade;
				proxy_set_header X-Forwarded-Proto $scheme;
				# esperar a 10 minutos. a los endpoints
				proxy_connect_timeout 1600s;
				proxy_send_timeout 1600s;
				proxy_read_timeout 1600s;
			}

		# Redirige www a la versión
		if ($host = ${domain ? domain : `${sub_domain}.vigilio-services.com`}) {
			return 301 $scheme://www.${
                domain ? domain : `${sub_domain}.vigilio-services.com`
            }$request_uri;
		}
	}

`;
        fs.writeFileSync(CONFIG_FILE, configContent);
        await terminal(`ln -s ${CONFIG_FILE} /etc/nginx/sites-enabled/`, true);

        await terminal("nginx -t", true);
        await terminal("systemctl reload nginx", true);
        await terminal(
            `certbot  --nginx  -d ${
                domain
                    ? `${domain}  -d www.${domain}`
                    : `${sub_domain}.vigilio-services.com -d www.${sub_domain}.vigilio-services.com`
            }  --non-interactive --agree-tos --email yonatanvigiliolavado09@gmail.com --quiet`,
            true
        );
    } catch (error) {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log((error as Error).message);
        throw new InternalServerErrorException((error as Error).message);
    }
}

export async function onDeleteNginx({
    sub_domain,
    domain,
}: {
    sub_domain?: string;
    domain?: string;
}) {
    try {
        await terminal(
            `sudo rm -rf /etc/nginx/sites-available/${
                domain ? domain : sub_domain
            } || true`,
            true
        );

        await terminal(
            `sudo rm -rf /etc/nginx/sites-enabled/${
                domain ? domain : sub_domain
            }  || true`,
            true
        );
        await terminal("nginx -t");
        await terminal("systemctl reload nginx  || true");
        await terminal(
            `sudo certbot delete --cert-name www.${
                domain ? domain : `${sub_domain}.vigilio-services.com`
            } --non-interactive --quiet --agree-tos  || true`,
            true
        );
    } catch (error) {
        throw new InternalServerErrorException((error as Error).message);
    }
}
export async function newVersionVPS({
    ip,
    password,
    commando,
    GIT_TOKEN,
    version,
}: {
    commando: string | null;
    password: string;
    ip: string;
    GIT_TOKEN: string;
    version: string;
}) {
    const ssh = new NodeSSH();

    try {
        // Conectar por SSH
        await ssh.connect({
            host: ip,
            username: "root",
            password: password,
        });

        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("Conectado correctamente a vps");

        // Comandos a ejecutar en el servidor
        const commands = `cd /root/home/ && rm -rf temp || true && mkdir temp  && \
            docker exec saas-db-1 pg_dump -U postgres -d saas -F c -f /var/lib/postgresql/data/backup.sql && \
            docker cp saas-db-1:/var/lib/postgresql/data/backup.sql ./temp/backup.sql && \
            cp -r ./saas/public/empresas ./temp && \
            cp ./saas/.env ./temp/.env && \
            rm -rf saas && \
            git clone https://${GIT_TOKEN}@github.com/VigilioYonatan/SAS.-AI saas && \
            cd saas &&   git checkout tags/${version} && \
            cp -r ../temp/empresas ./public && \
            cp ../temp/.env . && \
            docker rm -f saas-db-1 && docker volume rm saas_postgres-data-saas && \
            docker rm -f && docker compose up -d --build && \
            docker cp ../temp/backup.sql saas-db-1:/tmp/backup.sql && \
            sleep 15 && \
            docker exec saas-db-1 pg_restore -U postgres -d saas /tmp/backup.sql && \
            ${commando ? `${commando} && \ ` : ""} \
            pm2 delete all || true && bun i && bun build:serve && bun build:client && \
            pm2 start bun --name "saas" -- start && \
            rm -rf ./app || true && rm -rf ./resources/ts || true && rm -rf ./whatsapp-api || true && \
            rm -rf ./redes || true && rm -rf .git`;

        // Ejecutar los comandos en el servidor remoto
        const result = await ssh.execCommand(commands);
        return result;
    } catch (error) {
        // Manejo de errores de conexión o ejecución
        throw new BadRequestException("error ssh");
    } finally {
        // Cerrar la conexión SSH
        ssh.dispose();
    }
}
