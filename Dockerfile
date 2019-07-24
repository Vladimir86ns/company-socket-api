FROM node:10.16.0
WORKDIR /var/www/socket-api
ADD . .
COPY package.json /var/www/socket-api/
RUN npm install
CMD [ "node", "index-socket-api.js" ]
EXPOSE 4000 6200