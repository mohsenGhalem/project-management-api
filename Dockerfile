FROM node:20.11-alpine3.19

WORKDIR /app

# Install pnpm and NestJS CLI
RUN npm install -g pnpm @nestjs/cli

COPY package*.json pnpm-lock.yaml* ./

# Use pnpm instead of npm for installation
RUN pnpm install && pnpm store prune

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]