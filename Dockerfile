FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY app ./app

EXPOSE 3000

CMD ["npm", "start"]
