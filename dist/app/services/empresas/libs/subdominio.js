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
exports.onNginx = onNginx;
exports.onDeleteNginx = onDeleteNginx;
exports.newVersionVPS = newVersionVPS;
const helpers_1 = require("~/libs/helpers");
const node_fs_1 = __importDefault(require("node:fs"));
const express_core_1 = require("@vigilio/express-core");
const node_ssh_1 = require("node-ssh");
function onNginx(_a) {
    return __awaiter(this, arguments, void 0, function* ({ sub_domain, port, domain }) {
        try {
            const CONFIG_FILE = `/etc/nginx/sites-available/${domain ? domain : sub_domain}`;
            const configContent = `server {
			server_name ${domain ? domain : `${sub_domain}.vigilio-services.com`} www.${domain ? domain : `${sub_domain}.vigilio-services.com`};
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
				proxy_connect_timeout 3200s;
				proxy_send_timeout 3200s;
				proxy_read_timeout 3200s;
			}

		# Redirige www a la versión
		if ($host = ${domain ? domain : `${sub_domain}.vigilio-services.com`}) {
			return 301 $scheme://www.${domain ? domain : `${sub_domain}.vigilio-services.com`}$request_uri;
		}
	}

`;
            node_fs_1.default.writeFileSync(CONFIG_FILE, configContent);
            yield (0, helpers_1.terminal)(`ln -s ${CONFIG_FILE} /etc/nginx/sites-enabled/`, true);
            yield (0, helpers_1.terminal)("nginx -t", true);
            yield (0, helpers_1.terminal)("systemctl reload nginx", true);
            yield (0, helpers_1.terminal)(`certbot  --nginx  -d ${domain
                ? `${domain}  -d www.${domain}`
                : `${sub_domain}.vigilio-services.com -d www.${sub_domain}.vigilio-services.com`}  --non-interactive --agree-tos --email yonatanvigiliolavado09@gmail.com --quiet`, true);
        }
        catch (error) {
            console.log(error.message);
            throw new express_core_1.InternalServerErrorException(error.message);
        }
    });
}
function onDeleteNginx(_a) {
    return __awaiter(this, arguments, void 0, function* ({ sub_domain, domain, }) {
        try {
            yield (0, helpers_1.terminal)(`sudo rm -rf /etc/nginx/sites-available/${domain ? domain : sub_domain} || true`, true);
            yield (0, helpers_1.terminal)(`sudo rm -rf /etc/nginx/sites-enabled/${domain ? domain : sub_domain}  || true`, true);
            yield (0, helpers_1.terminal)("nginx -t");
            yield (0, helpers_1.terminal)("systemctl reload nginx  || true");
            yield (0, helpers_1.terminal)(`sudo certbot delete --cert-name www.${domain ? domain : `${sub_domain}.vigilio-services.com`} --non-interactive --quiet --agree-tos  || true`, true);
        }
        catch (error) {
            throw new express_core_1.InternalServerErrorException(error.message);
        }
    });
}
function newVersionVPS(_a) {
    return __awaiter(this, arguments, void 0, function* ({ ip, password, commando, GIT_TOKEN, version, }) {
        const ssh = new node_ssh_1.NodeSSH();
        try {
            yield ssh.connect({
                host: ip,
                username: "root",
                password: password,
            });
            console.log("Conectado correctamente a vps");
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
             docker exec saas-db-1 sh -c "while [ ! -f /tmp/backup.sql ]; do sleep 1; done && \
            docker exec saas-db-1 pg_restore -U postgres -d saas /tmp/backup.sql && \
            ${commando ? `${commando} && \ ` : ""} \
            pm2 delete all || true && bun i && bun build:serve && bun build:client && \
            pm2 start bun --name "saas" -- start && sleep 120 && \
            rm -rf ./app || true && rm -rf ./resources/ts || true && rm -rf ./whatsapp-api || true && \
            rm -rf ./redes || true && rm -rf .git`;
            const result = yield ssh.execCommand(commands);
            return result;
        }
        catch (error) {
            throw new express_core_1.BadRequestException("error ssh");
        }
        finally {
            ssh.dispose();
        }
    });
}
