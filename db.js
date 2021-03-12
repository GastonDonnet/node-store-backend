const knexfile = require('./knexfile')
const knex  =require('knex')(knexfile)

knex
  .raw('SELECT 1')
  .then(() => {
    console.log('DB sucefully conected');
  })
  .catch((err) => {
    throw err;
  });

module.exports =  knex