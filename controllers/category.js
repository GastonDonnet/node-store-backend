const knex = require('../db');


exports.getAllCategories = async (req, res, next) => {
  try {
    const dbQuery = knex('category').select('id', 'name')

    const categories = await dbQuery

    let data = {
      categories: categories,
      total: categories.length
    };

    res.status(200).json({
      ...data,
    });
  } catch (error) {
    return next(error);
  }
};
