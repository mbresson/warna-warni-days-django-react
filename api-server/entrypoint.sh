#!/bin/sh

echo "Waiting for DB..."

while ! nc -z $POSTGRES_HOST 5432; do
    sleep 0.1
done

echo "DB ready"

python manage.py migrate && \
exec "$@"