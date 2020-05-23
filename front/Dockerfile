FROM node:12

WORKDIR /var/www/app

COPY . ./
RUN npm install --production

CMD [ "npm", "run", "start" ]