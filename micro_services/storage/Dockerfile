FROM node:18.3-alpine

WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run prisma:generate

CMD ["npm", "run", "dev"]
