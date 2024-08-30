FROM node:22.7.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

ENV DATABASE_USERNAME=admin
ENV DATABASE_PASSWORD=password
ENV DATABASE_NAME=consumptionreading

CMD ["npm", "run", "start:prod"]