// Imports
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const app = express();
const knex = require('./db')

// Development Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));

  // Knex query
  knex.on('query', function (queryData) {
    console.log(queryData);
  });

  // Query string
  app.use((req,res,next)=>{
    console.log("QUERY: ", req.query)
    next()
  })

}

// Cors
app.use(cors());

// Body parser
app.use(express.json());

// Routes
app.use(routes);

// 404
app.all("*", (req, res, next) => {
  next(
    new Error(`No se encuentra ${req.originalUrl} en este servidor!`, 404)
  );
});

// GlobalErrorMiddleware
app.use((err, req, res, next) => {
  res.status(500).json({
    status: err.status || "error",
    message: err.message || "Ha ocurrido un error!",
  });
});

//Export
module.exports = app;
