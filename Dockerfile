# --- Stage 1: build the SPA (Vite) ---
FROM node:22-bookworm-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/ ./
ENV VITE_API_URL=
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
RUN npm install && npm run build

# --- Stage 2: compile the API (TypeScript -> JavaScript) ---
FROM node:22-bookworm-slim AS backend-build
WORKDIR /app
COPY backend/ ./
RUN npm install && npm run build

# --- Stage 3: runtime image (only prod deps + build assets) ---
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY backend/package.json backend/package-lock.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=backend-build /app/dist ./dist
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3001
USER node

CMD ["node", "dist/index.js"]