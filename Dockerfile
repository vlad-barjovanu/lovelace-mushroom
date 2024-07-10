# Use the official Node.js image as a base image
FROM node:16

# Create and change to the app directory
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the project
RUN npm install
RUN npm run build

# Define the volume for the dist folder
VOLUME [ "/app/dist" ]

# Default command (optional, in case you want to run something by default)
CMD [ "npm", "run", "build" ]
