FROM node:20-alpine AS build

WORKDIR /app

COPY typescript/ ./typescript/

RUN npm install -g typescript && \
    cd typescript && \
    npx tsc

FROM nginx:alpine AS runtime

COPY public/ /usr/share/nginx/html

COPY --from=build /app/typescript/../public/javascript/ /usr/share/nginx/html/javascript/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
