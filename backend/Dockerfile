# Use the official Node.js image
FROM --platform=linux/amd64 node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./
COPY nodemon.json ./

# Install dependencies
COPY . .
RUN npm install 
RUN npx prisma generate
# RUN npm run build
# Expose the port that the app will run on
EXPOSE 3000
# Start the app
CMD npm run dev