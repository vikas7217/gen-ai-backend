FROM node:22-alpine

# Set working directory
WORKDIR /server
# copy package.json and package-lock.json to the working directory
COPY package*.json ./
# RUN npm ci --omit=dev && npm cache clean --force
RUN npm install
COPY . .
# define the port number the container should expose
EXPOSE 3000

# start the application
CMD ["npm","run", "dev"]