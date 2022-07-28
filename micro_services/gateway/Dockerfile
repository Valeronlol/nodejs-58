FROM node:18.3

WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .

CMD ["npm", "run", "dev"]