const knex = require('../db');

const VALID_SORT = ['name', 'price', 'category', 'discount', 'category']
const VALID_FILTER = ['name', 'price', 'category', 'discount', 'category']
const FIELD_MAP = {
  'name': 'product.name',
  'category': 'category.name',
}
const DEFAULT_PAGE_ITEMS = 10


/* 
  Los campos que se puedan ordenar deben estar definidos en la constante VALID_SORT
  Los campos que se puedan filtrar deben estar definidos en la constante VALID_FILTER
  Cuando un mismo nombre de campo es usado en dos o mas entidades unidas (ej: name para product y category),
  cuando se requiera hacer un filtrado, se debera especificar [entidad].[campo] (ejemplo: product.name).
  Tambien se puede agregar a la constante FIELD_MAP, valores de la forma "[campo]: [entidad].[campo]" para mapear el campo al campo de la entidad.

  Ejemplos de Querys validas
  
  Ordenar:
    sort="name"
    sort="-name"
    sort="name,price"

  Filtrar:
    name=Mayonesa
    name=Mayonesa&price=100
  
  Paginar:
    page=1
    page=2
    page=1&limit=100
  
  Paginar (Manual):
    limit=100&offset=50


*/
exports.getAllProducts = async (req, res, next) => {
  try {
    let {
      sort,
      limit,
      offset,
      page
    } = req.query;

    const dbQuery = knex('product')
      .join('category', 'category.id', 'product.category')
      .select('product.name', 'product.id', 'product.url_image', 'product.price', 'product.discount', 'category.name as category')
    let dbQueryQuantity


    // Query para ordenar
    if (sort) {
      sort = sort.split(',')
      let desc = false
     
      for (let sortValue of sort) {

        // Mira si es en orden descendente 
        if (sortValue.startsWith('-')) {
          desc = true
          sortValue = sortValue.substr(1)
        }

        if (VALID_SORT.includes(sortValue)) {
          dbQuery.orderBy(sortValue, desc?'desc':'asc')
        }
      }
    }
    

    // Query para filtrar
    let i = 0
    VALID_FILTER.forEach((field) => {
      const fieldValue = req.query[field]

      // Si el query esta en el FIELD_MAP, lo reemplaza
      if (FIELD_MAP[field]) field = FIELD_MAP[field]

      if (fieldValue) {
        i++
        if (i == 0) dbQuery.where(field, "like", `%${fieldValue}%`)
        else dbQuery.andWhere(field, "like", `%${fieldValue}%`)
      }
    })

    // Previo a filtrar por paginas, hago una query a la BD para saber el numero de items que hay
    dbQueryQuantity = dbQuery.clone().count("*")

    // Query para paginar "manual"
    if (limit) {
      limit = Number(limit)

      dbQuery.limit(limit)
      if (offset) {
        offset = Number(offset)
        dbQuery.offset(offset)
      }
    }

    // Query para paginar (no mezclar con offset)
    // Comienza con page=1
    if (page && !offset) {
      page = Number(page)

      if (limit) {
        limit = Number(limit)

        dbQuery.limit(limit)
        dbQuery.offset((page - 1) * limit)
      } else {
        dbQuery.limit(DEFAULT_PAGE_ITEMS)
        dbQuery.offset((page - 1) * DEFAULT_PAGE_ITEMS)
      }
    }

    const products = await dbQuery
    const productQuantity = await dbQueryQuantity
    

    let data = {
      products: products,
      total: productQuantity[0]["count(*)"]
    };

    res.status(200).json({
      ...data,
    });
    
  } catch (error) {
    return next(error);
  }
};
