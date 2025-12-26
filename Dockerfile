FROM node:20-slim AS builder

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

ARG API_KEY
ENV API_KEY=${API_KEY}

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
