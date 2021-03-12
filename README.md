# Store Backend

API programada en NodeJs para retornar los productos de una tienda soportando paginado, filtros y sort.

## Install
- `npm i`
- Setear las siguientes variables de entorno (puede leer archivo `.env`):
  - PORT = `Puerto en el que correrá el servidor`
  - DB_HOST = `Host de la base de datos`
  - DB_USER = `Usuario de la base de datos`
  - DB_PASSWORD = `Contraseña de la base de datos`
  - DB_DATABASE = `Base de datos a usar`

## Run
- Iniciar en dev: `npm start dev` (requiere `nodemon`)
- Iniciar en prod: `npm start`
- Iniciar en debug: `npm debug` (requiere `ndb`)

## Rutas

- `api/v1/productos`: Retorna productos
    - Soporta: paginado, filtros, sort.
- `api/v1/categories`: Retorna categorías

## Queries para productos

- `sort=[campo]`: Ordena los resultados obtenidos.
    - `sort=-name`: con un `-` adelante del campo, ordena de manera decreciente.
    - `sort=-name,price`: soporta múltiples sort en el orden dado.
- `limit=[entero]`: limita los resultados al numero dado.
- `page=[entero]`: retorna los resultados de la pagina dada (usa por default `limit=10`).
- `offset=[entero]`: retorna los resultados a partir del numero dado. Requiere query de `limit`.
- `[campo]=[valor a buscar]`: se puede filtrar muchos campos de esta manera. La base de datos busca los campos con un `LIKE %valor%`.

## Se podría mejorar

- Error handling: ahora mismo no esta gestionando los errores. (ya que solo son rutas GET, no deberían ocurrir.)
- Trasladar el código de las queries a un middleware para poder usarse en múltiples rutas.
- Usar un ORM para CRUD básico de datos.