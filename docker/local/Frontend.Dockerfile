FROM node:16
WORKDIR /app/frontend/
COPY frontend/next-env.d.ts .
COPY frontend/package.json .
COPY frontend/yarn.lock .
COPY frontend/tsconfig.json .

RUN yarn --frozen-lockfile install

COPY frontend /app/frontend

EXPOSE 3000

# CMD sleep infinity
CMD yarn dev
