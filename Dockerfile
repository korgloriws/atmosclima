FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3030
ENV BASE_PATH=/
ENV DATA_DIR=/app/data
ENV NODE_OPTIONS=--experimental-sqlite

RUN mkdir -p /app/data

EXPOSE 3030

CMD ["npm", "start"]
