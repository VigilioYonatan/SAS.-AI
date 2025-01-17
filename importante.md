Ve a la carpeta .git/hooks en tu repositorio local.

Busca el archivo pre-push. Si no existe, créalo.

Abre el archivo pre-push y agrega el siguiente contenido:
```bash
#!/bin/sh
echo "Ejecutando comandos de construcción antes del push..."
bun build:serve && bun build:client
if [ $? -ne 0 ]; then
    echo "La construcción falló. Abortando el push."
    exit 1
fi

```
```bash
chmod +x .git/hooks/pre-push
```
