# ---------- BUILD STAGE ----------
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# ---------- RUNTIME STAGE ----------
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]
