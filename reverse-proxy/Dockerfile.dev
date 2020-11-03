
########## BASE #########

FROM nginx:stable


########## CONFIGURATION ##########

ARG DEBIAN_FRONTEND=noninteractive

COPY ./services.conf /etc/nginx/conf.d/default.conf
COPY ./proxy_params.conf /etc/nginx/proxy_params.conf