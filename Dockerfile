FROM nginx:1.23.2

RUN mkdir /etc/nginx/logs && touch /etc/nginx/logs/static.log

ADD ./nginx.conf /etc/nginx/conf.d/default.conf
ADD /src /www
