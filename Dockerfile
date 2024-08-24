# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY bot/package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY bot/ ./

# Expose a port if you plan to monitor/log externally (optional)
EXPOSE 8080

# Command to run your bot when the container starts
CMD ["node", "--no-warnings", "bot.js"]
