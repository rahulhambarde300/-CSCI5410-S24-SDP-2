FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
EXPOSE 8080

CMD ["npm", "start"]


# FROM nginx:1.19.0
# WORKDIR /usr/share/nginx/html
# RUN rm -rf ./*
# COPY --from=builder /app/build .

# COPY nginx.conf /etc/nginx/nginx.conf
# EXPOSE 8080
# ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

