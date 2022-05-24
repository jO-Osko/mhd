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

COPY . /app

EXPOSE 8000
CMD ["/app/docker/local/entrypoint.sh"]
