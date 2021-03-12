const dotenv = require('dotenv');

process.on("uncaughtException", (error) => {
  console.log(error.name, error.message);
  console.log("UNCAUGHT EXCEPTION!. Shuting down...");
  server.close().then(process.exit(1));
});

dotenv.config();

const knex = require('./db')

const app = require("./app");

console.log("Currently working on:", process.env.NODE_ENV);

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App runing on port ${port}...`);
});

process.on("unhandledRejection", (error) => {
  console.log(error.name, error.message);
  console.log("UNHANDLER REJECTION!. Shuting down...");
  server.close().then(process.exit(1));
});
