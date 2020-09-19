FROM arm32v7/node:14.11-buster as install
EXPOSE 8090

RUN cd /tmp && wget https://project-downloads.drogon.net/wiringpi-latest.deb && dpkg -i wiringpi-latest.deb

WORKDIR /usr/src/recv
COPY package*.json ./
RUN npm install \
    && npm cache clean --force
ENV PATH /usr/src/recv/node_modules/.bin:$PATH
WORKDIR /usr/src/recv/app

FROM install AS dev
ENV NODE_ENV=development
CMD [ "npm", "run", "dev" ]

FROM install AS build
ENV NODE_ENV=production
COPY . .
RUN npm run build

FROM install as prod
COPY --from=build /usr/src/recv/app/dist .
CMD ["node", "index.js"]