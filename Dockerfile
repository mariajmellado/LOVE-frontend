FROM node:10.13-stretch

# set working directory
RUN mkdir -p /home/docker/love

WORKDIR /home/docker/love

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /home/docker/love/node_modules/.bin:$PATH

# install and cache app dependencies
RUN npm install react-scripts@1.1.1 -g --silent

COPY ./love/package.json /home/docker/love/package.json

RUN npm install

COPY ./love /home/docker/love

# start app
CMD ["npm", "start"]