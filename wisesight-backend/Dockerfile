FROM node:8.12
COPY ./ /home/node/app
WORKDIR /home/node/app
RUN npm install node-pre-gyp
RUN ["npm", "install"]
EXPOSE 3000
CMD ["node", "app.js"]