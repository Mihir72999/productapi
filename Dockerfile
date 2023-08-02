FROM node:18
WORKDIR /app

COPY ./package*.json ./

RUN npm install
ENV DATABASE_URL="mongodb+srv://mihir72999:Mihir72999@api.tv0cw9w.mongodb.net/data?retryWrites=true&w=majority"
COPY . .
CMD [ "npm","run","dev" ]