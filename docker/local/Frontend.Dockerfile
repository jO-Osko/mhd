FROM node:16
WORKDIR /app/frontend/
ADD frontend/package.json .
ADD frontend/tsconfig.json .
ADD frontend/yarn.lock .

RUN yarn install

COPY . /app

EXPOSE 3000

CMD yarn start

