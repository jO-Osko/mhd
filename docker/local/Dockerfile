# Stage 1: Build the frontend
#FROM node:12 as frontend
#WORKDIR /app/frontend/
#ADD frontend .
#RUN yarn
#RUN yarn build

# Stage 2: Build the backend + add the frontend to it
FROM python:3.10-alpine as backend

# Add requirements and install dependencies
WORKDIR /app/

# Add dependencies
RUN mkdir -p /var/www/api/admin/static/ \
    && apk add --no-cache bash postgresql-libs postgresql-client pcre-dev libffi-dev mailcap \
    && apk add --no-cache --virtual .build-deps gcc g++ musl-dev postgresql-dev linux-headers python3-dev

ADD requirements.txt /app/
ADD requirements-dev.txt /app/

RUN pip install -r requirements.txt -r requirements-dev.txt --no-cache-dir

# COPY --from=frontend /app/frontend/build /app2/frontend/build

COPY . /app

EXPOSE 8000
CMD ["/app/docker/local/entrypoint.sh"]
