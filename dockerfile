FROM node:18.15.0-alpine

WORKDIR /webapp

COPY package*.json /webapp/

RUN npm install

COPY . /webapp/

EXPOSE 5173

CMD ["npm", "run", "dev"]