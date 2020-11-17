FROM node:14.5.0

# Create app directory
RUN mkdir -p /usr/src/covid-app-server
WORKDIR /usr/src/covid-app-server

# Install app dependencies
COPY package.json /usr/src/covid-app-server
COPY tsconfig.json /usr/src/covid-app-server
COPY tslint.json /usr/src/covid-app-server

RUN npm install

# Bundle app source
COPY . /usr/src/covid-app-server

# Build arguments
ARG NODE_VERSION=14.5.0

# Environment
ENV NODE_VERSION $NODE_VERSION