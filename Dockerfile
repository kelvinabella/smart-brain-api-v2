FROM node:12.18.0

# Create app directory
RUN mkdir -p /usr/src/smart-brain-enhanced-api
WORKDIR /usr/src/smart-brain-enhanced-api

# Install app dependencies
COPY package.json /usr/src/smart-brain-enhanced-api
RUN npm install

# Bundle app source
COPY . /usr/src/smart-brain-enhanced-api

# Build arguments
ARG NODE_VERSION=12.18.0

# Environment
ENV NODE_VERSION $NODE_VERSION