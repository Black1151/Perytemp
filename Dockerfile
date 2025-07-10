# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory
WORKDIR /app

# Define a build argument for the AG Grid License Key (from Azure DevOps)
ARG NEXT_PUBLIC_AG_GRID_LICENSE_KEY
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Set the license key as an environment variable inside the container
ENV NEXT_PUBLIC_AG_GRID_LICENSE_KEY=${NEXT_PUBLIC_AG_GRID_LICENSE_KEY}
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Write the license key to an .env file (if required for frontend builds)
RUN echo "NEXT_PUBLIC_AG_GRID_LICENSE_KEY=${NEXT_PUBLIC_AG_GRID_LICENSE_KEY}" > .env \
    echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}" > .env

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 80

# Start the application
CMD ["npm", "start"]
