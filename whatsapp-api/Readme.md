# START WHATSAPP

### comandos

Iniciar whatsapp en node - crear imagen

```bash
docker build -t whatsapp-session:v1.0.0 .
```

Crear contenedores

```bash
docker volume create whatsapp-data3 && docker run -d --name slug_web -v /usr/src/app:/app/data Whatsapp-session:v1.0.0
```

lt --port 3000 --subdomain mi-subdominio
