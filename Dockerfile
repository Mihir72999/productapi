FROM node:18
WORKDIR /app

COPY ./package*.json ./

RUN npm install
COPY . .
RUN npx prisma generate
ENV DATABASE_URL="mongodb+srv://mihir72999:Mihir72999@api.tv0cw9w.mongodb.net/data?retryWrites=true&w=majority"
CMD [ "npm","run","dev" ]
