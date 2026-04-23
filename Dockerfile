# Next.js frontend Dockerfile
# Multi-stage build: deps -> builder -> runner

FROM node:20-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat && corepack enable && corepack prepare pnpm@9.12.2 --activate

# Install dependencies (with lockfile)
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN npm config set registry https://mirror-npm.runflare.com/
RUN pnpm install --frozen-lockfile

# Build the app
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build && pnpm prune --prod

# Production runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy needed files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Optional: configs (not strictly required at runtime)
COPY --from=builder /app/tailwind.config.ts ./tailwind.config.ts
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
# Use Next.js CLI directly to avoid needing pnpm in runtime image
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]

