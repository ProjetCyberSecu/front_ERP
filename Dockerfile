FROM node:18-alpine as builder

WORKDIR /front_erp

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build


FROM nginx:alpine as production-build
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /front_erp/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]