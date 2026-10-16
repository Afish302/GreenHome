#Copied from https://thedkpatel.medium.com/dockerizing-react-application-built-with-vite-a-simple-guide-4c41eb09defa

# upated node version to 22
FROM node:22-alpine
#changed to /code to match project setup
WORKDIR /code 

COPY package.json ./
RUN npm ci

COPY . .
# Changes to 3000 to match docker compose file
EXPOSE 3000

CMD [ "npm", "run", "dev" ]