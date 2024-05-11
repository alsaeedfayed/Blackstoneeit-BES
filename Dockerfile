FROM node:16-alpine AS build
WORKDIR /app
COPY / ./
COPY package*.json ./

ARG BUILD_CONFIG
RUN npm install -g @angular/cli@13.3.0 && \
    npm install --save --legacy-peer-deps && \
    ng build --output-hashing=all --configuration=$BUILD_CONFIG
COPY . .

FROM nginx:1.23.1-alpine
WORKDIR /app
RUN echo $'server { \n\
    listen       80; \n\
    listen  [::]:80; \n\
    server_name  localhost; \n\
    location / { \n\
        root   /usr/share/nginx/html; \n\
        index  index.html index.htm; \n\
		try_files $uri $uri/ /index.html; \n\
    } \n\
    error_page   500 502 503 504  /50x.html; \n\
    location = /50x.html { \n\
        root   /usr/share/nginx/html; \n\
    } \n\
}' > /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/EppmPortal/ /usr/share/nginx/html
