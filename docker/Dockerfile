FROM registry.redhat.io/ubi8/nodejs-20-minimal

ENV DockerHOME=/home/app/webapp

USER root

RUN mkdir -p $DockerHOME

COPY . $DockerHOME

WORKDIR $DockerHOME

EXPOSE 80

RUN npm install --legacy-peer-deps --force  -userconfig=.npmrc

CMD ["npm", "run", "dev:concurrent"]
