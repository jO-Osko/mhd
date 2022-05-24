#!/bin/bash

wait_for_postgres() {
    TRIES=30
    echo "Detected postgres backend, waiting for server to connect. "
    until PGPASSWORD=$DJANGO_DB_PASSWORD psql --host $DJANGO_DB_HOST --port $DJANGO_DB_PORT --dbname $DJANGO_DB_NAME --user $DJANGO_DB_USER -c "select 1" > /dev/null 2>&1 || [ $TRIES -eq 0 ]; do
        echo "Did not connect to postgres. $((TRIES--)) tries left, or starting anyways. "
        sleep 1
    done
}

if [ "$DJANGO_DB_ENGINE" == "django.db.backends.postgresql" ]; then
    wait_for_postgres
fi;


# Run Migrations
python manage.py collectstatic --no-input --settings=mhd.local_docker
python manage.py migrate --settings=mhd.local_docker

exec python manage.py runserver --settings=mhd.local_docker "0.0.0.0:8000"
