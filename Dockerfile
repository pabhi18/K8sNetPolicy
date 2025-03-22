FROM node:18-alpine AS builder

WORKDIR /build

COPY package.*json .

RUN npm install --only=production

COPY . .

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /build /app

EXPOSE 3000

CMD ["node", "server.js"]
