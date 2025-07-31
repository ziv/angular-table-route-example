FROM node:lts-jod as build

COPY ./package.json ./package-lock.json ./
RUN npm ci --no-fund --no-audit --no-progress

FROM node:lts-jod as production
CMD ["node"]
