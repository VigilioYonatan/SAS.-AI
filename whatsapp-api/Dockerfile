FROM node:20.13.1-slim AS  base
WORKDIR /usr/src/app
RUN  apt-get update && apt-get install -y \
    gconf-service \
    libgbm-dev \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget \
    git \ 
    openvpn \
 && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /etc/openvpn

COPY start-vpn.sh /usr/local/bin/start-vpn.sh
RUN chmod +x /usr/local/bin/start-vpn.sh

RUN npm install -g bun 

FROM base AS build
COPY . .
RUN bun install
RUN  bun build:serve && \
    rm -rf node_modules && bun install --production && \ 
    bun install --platform=linux --arch=x64 sharp

FROM base AS production
COPY --from=build  /usr/src/app/node_modules  ./node_modules
COPY --from=build  /usr/src/app/dist  ./dist
COPY --from=build  /usr/src/app/package.json  ./package.json
# puerto 5000
EXPOSE 5000 
CMD ["node","dist/main.js"]