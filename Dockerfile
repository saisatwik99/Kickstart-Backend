# Install node v16
FROM node:16-alpine

# Set the workdir /var/www/kickstart
WORKDIR /usr/src/kickstart

# Copy the package.json to workdir
COPY package.json .

# Run npm install - install the npm dependencies
RUN npm install

# Copy application source
COPY . .


# Expose application ports 
EXPOSE 5000

# Start the application
CMD ["npm", "start"]