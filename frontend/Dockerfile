FROM node:alpine as build
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:stable-alpine
COPY --from=build /src/dist /usr/share/nginx/html
COPY --from=build /src/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]