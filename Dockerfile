FROM node:latest

RUN mkdir -p /usr/src/shortly-app
WORKDIR /usr/src/shortly-app
RUN rm -rf *
COPY shortly-deploy.tar.gz /usr/src/shortly-app
#RUN tar xzvf shortly-deploy.tar.gz
#WORKDIR /usr/src/shortly-app/shortly-deploy
#RUN npm install
#EXPOSE 4568
#CMD [ "grunt", "build", "--prod" ]
