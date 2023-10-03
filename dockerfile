FROM node

WORKDIR /index

COPY package*.json -/

RUN yarn install

COPY . .

EXPOSE 4040

CMD ["yarn" , "start"]