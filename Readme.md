# VIGILIO/EXPRESS-CORE

by Yonatan Vigilio Lavado

-   @VIGILIO/EXPRESS-CORE VERSION: 1.4.1

## INSTALAR

docker git pm2 nvm curl bun sudo

### DEPLOY

1. Crear ssh keygen

```bash
ssh-keygen
cat .ssh/id_rsa.pub # copiar
```

2. entrar a ssh

```bash
ssh root@ip
```

3. instalacion en vps

```bash
sudo apt update && sudo apt upgrade -y # instalar ultimas acciones
```

4. crear usuario y dar acceso

```bash
adduser vigilio # cualquier nombre puedes poner. enter enter y
usermod -aG sudo vigilio
# cambiar  usuario y entrar
su - vigilio
```

5. instalar pm2 y nvm

```bash
# nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.profile
nvm install --lts
# pm2
npm i -g pm2


pm2 start bun --name "nombredeweb" -- start

```

6. NGNIX

Crear archivo

```bash
sudo nano /etc/nginx/sites-available/vigilio-services
```

```nginx
server {
    listen 80;
    server_name eccomerce.vigilio-services.com www.eccomerce.vigilio-services.com;

    location / {
        proxy_pass http://localhost:4000; # Cambia 3000 por el puerto en el que corre tu app Node.js
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Redirige www a la versión
    if ($host = eccomerce.vigilio-services.com) {
        return 301 $scheme://www.eccomerce.vigilio-services.com$request_uri;
    }
}

# Configuración SSL (se habilitará más adelante)
server {
    listen 443 ssl;
    server_name eccomerce.vigilio-services.com;

    ssl_certificate /etc/letsencrypt/live/eccomerce.vigilio-services.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/eccomerce.vigilio-services.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:4000; # Cambia 3000 por el puerto en el que corre tu app Node.js
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    }
```

Reinciiar nginx

```bash
sudo ln -s /etc/nginx/sites-available/vigilio-services /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

```

Activar Ssl

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d www.eccomerce.vigilio-services.com -d eccomerce.vigilio-services.com

# solo ceritificado
sudo certbot certonly --nginx -d www.eccomerce.vigilio-services.com -d eccomerce.vigilio-services.com
```

verificar si ssl es automatico

```bash
sudo systemctl status certbot.timer
sudo certbot renew --dry-run #probar la renovacion

```

listar ssl

```bash
ls /etc/letsencrypt/live
```

# BACKUP

-docker cp ../temp/backup.sql 3006:./backup.sql
-docker exec -it contenedo y pg_dump -U nombre_usuario -d nombre_base_datos -F c -f /var/lib/postgresql/data/backup.sql
-pg_restore -U postgres -d mi_base_de_datos /tmp/backup.dump
// ver psql -U postgres -d basededatos
// SELECT \* FROM "Users";
// \q salir

scp -r root@161.132.47.141:/home/vigilio/temp C:/Users/Vigilio/Documents/backup

# SUBDOMINIOS DINAMICOS

```nginx
server {
    listen 80;
    server_name *.vigilio-services.com ;
    client_max_body_size 100M; # permite subir archivos mas de 100mb

    location / {
        proxy_pass http://localhost:4003; # Cambia 3000 por el puerto en el que corre tu app Node.js
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Redirige www a la versión
    if ($host ~* ^(.+)\.vigilio-services\.com$) {
        return 301 https://www.$1.vigilio-services.com$request_uri;
    }
}


```

# ver cuanto de ram y cpu

free -h
top

# entrar dentro de sql postgres

psql -U postgres -d saas
\dt // ver tablas

// actualizar
UPDATE "public"."Empresas"
SET whatsapp_mode = '{"type": "FREE", "ip": null, "password": null, "memory": null, "cpu": null}'
WHERE whatsapp_mode IS NULL;
UPDATE 0

```js
{
    #seettings
    web: body.web,
                    host: {
                        host: null,
                        nameserver_one: null,
                        nameserver_two: null,
                        time: null,
                        enabled: false,
                    },
                    bg_color: "rgb(28,141,227)",
                    bg_color_responsive: "#FFFFFF",
                    type_border: "circle",
                    type_cart: "fas fa-shopping-cart",
                    isCoverImage: true,
                    isDark: false,
                    isScrolling: true,
                    hamburger: "fas fa-bars",
                    isLogoImage: false,
                    position_header: true,
                    logo_width: 80,
                    border_title_type: "normal",
                    type_icons: "normal",
                    bg_color_background: "#FFFFFF",
                    bg_color_footer: "#FFFFFF",
                    bg_color_paper: "#F2F2F2",
                    bg_color_button: "rgb(28,141,227)",
                    font_face: "Exo",
                    background_position: "center",
                    background_type: "first",
                    shows: {
                        about: true,
                        brands: true,
                        cards: true,
                        map: true,
                        android: true,
                        offers_section: true,
                        offers_user: true,
                    },
                    type_map: "satelite",
                    header_type: "normal",
                    type_star: "star",
                    is_block_aside: false,
                    type_card: "normal",
                    is_subcategory: false,
                    background_custom_html: null,
                    header_position: { logo: 1, icons: 3, navbar: 2 },
                    header: {
                        about: true,
                        condiciones: true,
                        home: true,
                        pedidos: true,
                        profile: true,
                        shop: true,
                        categories: true,
                        services: true,
                        subcategories: true,
                    },
                    background_auth: null,
                    bg_color_secondary: "#dc2626",
                    type_animation: "fade-up",
}
```

```js
export function gridEmpresa(width: number[]): {
    width: number,
    height: number,
    gap: number,
    cols: number,
    rows: number,
    title: null,
}[] {
    return width.map((grid) => ({
        width: grid,
        height: 200,
        rows: 1,
        cols: 3,
        gap: 1,
        title: null,
    }));
}
[
    {
        responsive: gridEmpresa(bannersQualities),
        enabled: true,
        empresa_id: empresa.id,
    },
    {
        responsive: gridEmpresa(bannersQualities),
        enabled: true,
        empresa_id: empresa.id,
    },
    {
        responsive: gridEmpresa(bannersQualities),
        enabled: true,
        empresa_id: empresa.id,
    },
    {
        responsive: gridEmpresa(bannersQualities),
        enabled: true,
        empresa_id: empresa.id,
    },
];
```
