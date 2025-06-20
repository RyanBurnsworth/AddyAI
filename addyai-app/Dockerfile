FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Use a lightweight web server like serve
RUN npm install -g serve
CMD ["npm", "run", "dev", "--", "--host=0.0.0.0", "--port=5173"]