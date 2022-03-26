FROM node:lts as dependencies
WORKDIR /supernova
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts as builder
WORKDIR /supernova
COPY . .
COPY --from=dependencies /supernova/node_modules ./node_modules
RUN yarn build

FROM node:lts as runner
WORKDIR /supernova
ENV NODE_ENV production

COPY --from=builder /supernova/next.config.js ./
COPY --from=builder /supernova/public ./public
COPY --from=builder /supernova/.next ./.next
COPY --from=builder /supernova/node_modules ./node_modules
COPY --from=builder /supernova/package.json ./package.json

EXPOSE 3000
CMD ["yarn", "start"]


#
# Dockerfile taken from:
# https://www.koyeb.com/tutorials/how-to-dockerize-and-deploy-a-next-js-application-on-koyeb
#