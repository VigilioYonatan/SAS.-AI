import { terminal } from "~/libs/helpers";
import fs from "node:fs";
import { InternalServerErrorException } from "@vigilio/express-core";

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
				proxy_connect_timeout 600s;
				proxy_send_timeout 600s;
				proxy_read_timeout 600s;
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
		await terminal(`ln -s ${CONFIG_FILE} /etc/nginx/sites-enabled/`);

		await terminal("nginx -t");
		await terminal("systemctl reload nginx");
		await terminal(
			`certbot  --nginx  -d ${
				domain
					? `${domain}  -d www.${domain}`
					: `${sub_domain}.vigilio-services.com -d www.${sub_domain}.vigilio-services.com`
			}  --non-interactive --agree-tos --email yonatanvigiliolavado09@gmail.com --quiet`,
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
		);

		await terminal(
			`sudo rm -rf /etc/nginx/sites-enabled/${
				domain ? domain : sub_domain
			}  || true`,
		);
		await terminal("nginx -t");
		await terminal("systemctl reload nginx  || true");
		await terminal(
			`sudo certbot delete --cert-name www.${
				domain ? domain : `${sub_domain}.vigilio-services.com`
			} --non-interactive --quiet --agree-tos  || true`,
		);
	} catch (error) {
		throw new InternalServerErrorException((error as Error).message);
	}
}
