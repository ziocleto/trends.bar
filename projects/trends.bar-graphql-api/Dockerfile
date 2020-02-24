FROM node:13.7.0
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
EXPOSE 4500
CMD [ "npm", "run", "start" ]
