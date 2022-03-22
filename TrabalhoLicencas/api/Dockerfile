FROM node:alpine
# Create app directory
WORKDIR /usr/src/app/
# Install app dependencies
COPY package*.json ./usr/src/app/

#Expose port and start application
EXPOSE 8081

# Copy app source code
COPY . .