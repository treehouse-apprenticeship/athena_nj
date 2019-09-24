FROM node:10.15.1

WORKDIR /usr/src

EXPOSE 5000

CMD ["./wait-for-it.sh", "-t", "2", "mongo:27017", "--", "./startup.sh"]
