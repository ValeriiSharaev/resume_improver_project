FROM node:22.19.0

WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@latest
RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "3000"]
EXPOSE 3000
