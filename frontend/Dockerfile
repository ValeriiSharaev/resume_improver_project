FROM node:22.19.0

WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@latest
RUN npm install

COPY . .

CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "3000"]
