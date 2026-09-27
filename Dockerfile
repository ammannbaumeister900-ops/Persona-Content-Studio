FROM node:24-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY server ./server
COPY public ./public

USER node
EXPOSE 5177
CMD ["node", "server/index.js"]
