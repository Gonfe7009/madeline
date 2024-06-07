 const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt'); // Importar bcrypt

// Permitir a Express analizar datos de formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'madeline'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database');
});


// Ruta para guardar usuarios
app.post('/guardar_usuario', async (req, res) => {
  const { idUsuario, nombreUsuario, telefono, email, contraseña, tipoUsuario, delete: deleteFlag } = req.body;

  if (deleteFlag === "Eliminar") {
    if (idUsuario) {
      const query = 'DELETE FROM usuarios WHERE id = ? AND nombre_usuario = ?';
      connection.query(query, [idUsuario, nombreUsuario], (error) => {
        if (error) {
          res.status(500).send(error.toString());
          return;
        }
        
        res.redirect('/editar_usuarios.html'); // Redirigir después de enviar la respuesta
      });
    } else {
      res.status(400).send("ID de usuario no proporcionado para eliminación.");
    }
  } else {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    
    if (idUsuario) {
      // Actualizar usuario existente
      const query = 'UPDATE usuarios SET nombre_usuario = ?, numero_telefono = ?, email = ?, contraseña = ?, tipo_usuario = ? WHERE id = ?';
      connection.query(query, [nombreUsuario, telefono, email, contraseña, tipoUsuario, idUsuario], (error) => {
        if (error) {
          res.status(500).send(error.toString());
          return;
        }
        
        res.redirect('/editar_usuarios.html'); // Redirigir después de enviar la respuesta
      });
    } else {
      // Insertar nuevo usuario
      const query = 'INSERT INTO usuarios (nombre_usuario, numero_telefono, email, contraseña, tipo_usuario) VALUES (?, ?, ?, ?, ?)';
      connection.query(query, [nombreUsuario, telefono, email, contraseña, tipoUsuario], (error) => {
        if (error) {
          res.status(500).send(error.toString());
          return;
        }
        
        res.redirect('/editar_usuarios.html'); // Redirigir después de enviar la respuesta
      });
    }
  }
});


// Ruta para buscar usuarios
app.get('/buscar_usuarios', (req, res) => {
  const termino = req.query.termino;
  const query = 'SELECT id, nombre_usuario FROM usuarios WHERE nombre_usuario LIKE ?';
  connection.query(query, [`%${termino}%`], (error, results) => {
    if (error) {
      res.status(500).send(error.toString());
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener un usuario por ID
app.get('/obtener_usuario', (req, res) => {
  const id = req.query.id;
  const query = 'SELECT * FROM usuarios WHERE id = ?';
  connection.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).send(error.toString());
      return;
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Usuario no encontrado.');
    }
  });
});

// Ruta para obtener los usuarios
app.get('/usuarios', (req, res) => {
  const query = 'SELECT id, nombre_usuario, numero_telefono, email, contraseña, tipo_usuario FROM usuarios';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error.toString());
      return;
    }
    res.json(results);
  });
});



// Agrega la ruta para buscar productos
app.get('/buscar_productos', (req, res) => {
  const termino = req.query.termino;
  const query = 'SELECT id, nombre_producto FROM productos WHERE nombre_producto LIKE ?';
  connection.query(query, [`%${termino}%`], (error, results) => {
    if (error) {
      res.status(500).send(error.toString());
      return;
    }
    res.json(results);
  });
});

// Agrega la ruta para obtener un producto por ID
app.get('/obtener_producto', (req, res) => {
  const id = req.query.id;
  const query = 'SELECT * FROM productos WHERE id = ?';
  connection.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).send(error.toString());
      return;
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Producto no encontrado.');
    }
  });
});

// Actualiza la ruta para guardar productos (existente o nuevo)
app.post('/guardar_producto', async (req, res) => {
  const { idProducto, nombreProducto, marca, descripcion, color, precio, talla, presentacion, especificaciones, delete: deleteFlag } = req.body;

  if (deleteFlag === "Eliminar") {
    if (idProducto) {
      const query = 'DELETE FROM productos WHERE id = ? AND nombre_producto = ?';
      connection.query(query, [idProducto, nombreProducto], (error) => {
        if (error) {
          res.status(500).send(error.toString());
          return;
        }
        res.redirect('/editar_Productos.html');
      });
    } else {
      res.status(400).send("ID de producto no proporcionado para eliminación.");
    }
  } else {
    if (idProducto) {
      const query = 'UPDATE productos SET nombre_producto = ?, marca = ?, descripcion = ?, color = ?, precio = ?, talla = ?, presentacion = ?, especificaciones = ? WHERE id = ?';
      connection.query(query, [nombreProducto, marca, descripcion, color, precio, talla, presentacion, especificaciones, idProducto], (error) => {
        if (error) {
          res.status(500).send(error.toString());
          return;
        }
        res.redirect('/editar_Productos.html');
      });
    } else {
      const query = 'INSERT INTO productos (nombre_producto, marca, descripcion, color, precio, talla, presentacion, especificaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      connection.query(query, [nombreProducto, marca, descripcion, color, precio, talla, presentacion, especificaciones], (error) => {
        if (error) {
          res.status(500).send(error.toString());
          return;
        }
        res.redirect('/editar_Productos.html');
      });
    }
  }
});

app.get('/productos', (req, res) => {
  const query = 'SELECT id, nombre_producto, marca, descripcion, color, precio, talla, presentacion, especificaciones, imagen FROM productos';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error.toString());
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener los productos
app.get('/mostrar_productos', (req, res) => {
  const query = 'SELECT id, nombre_producto, precio, presentacion FROM productos';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error.toString());
      return;
    }

    let html = '<div class="row">'; // Inicia una fila para los productos
    results.forEach(row => {
      const image_name = row.nombre_producto.replace(/\s+/g, '_').toLowerCase() + '.png';
      const uniqueId = `product_${row.id}`; // Genera un id único para cada producto
      html += `<div class="col-md-4">
                  <div class="card mb-4 product-wap rounded-0">
                      <div class="card rounded-0">
                          <img class="card-img rounded-0 img-fluid" src="assets/img/${image_name}" alt="${row.nombre_producto}">
                          <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                              <ul class="list-unstyled">
                                   
                                  <li><a class="btn btn-success text-white mt-2" onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')"><i class="fas fa-cart-plus"></i></a></li>
                              </ul>
                          </div>
                      </div>
                      <div class="card-body">
                          <a onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')" class="h3 text-decoration-none">${row.nombre_producto}</a>
                          <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                              <li>${row.presentacion}</li>
                              <li class="pt-2">
                                  <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                              </li>
                          </ul>
                          <ul class="list-unstyled d-flex justify-content-center mb-1">
                              <li>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                              </li>
                          </ul>
                          <p class="text-center mb-0">$${row.precio}</p>
                      </div>
                  </div>
              </div>`;
    });
    html += '</div>'; // Cierra la fila
    res.send(html);
  });
});


// Ruta para obtener los detalles de un producto específico
app.get('/obtener_producto/:id', (req, res) => {
  const productId = req.params.id;
  const query = 'SELECT id, nombre_producto, precio, presentacion FROM productos WHERE id = ?';
  connection.query(query, [productId], (error, results) => {
    if (error) {
      res.status(500).send(error.toString());
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Producto no encontrado');
      return;
    }
    res.json(results[0]);
  });
});


app.get('/productosbordados', (req, res) => {
  const query = 'SELECT id, nombre_producto, precio, presentacion FROM productos where presentacion = "Bordado"';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error.toString());
      return;
    }

    let html = '<div class="row">'; // Inicia una fila para los productos
    results.forEach(row => {
      const image_name = row.nombre_producto.replace(/\s+/g, '_').toLowerCase() + '.png';
      const uniqueId = `product_${row.id}`; // Genera un id único para cada producto
      html += `<div class="col-md-4">
                  <div class="card mb-4 product-wap rounded-0">
                      <div class="card rounded-0">
                          <img class="card-img rounded-0 img-fluid" src="assets/img/${image_name}" alt="${row.nombre_producto}">
                          <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                              <ul class="list-unstyled">
                                   
                                  <li><a class="btn btn-success text-white mt-2" onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')"><i class="fas fa-cart-plus"></i></a></li>
                              </ul>
                          </div>
                      </div>
                      <div class="card-body">
                          <a onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')" class="h3 text-decoration-none">${row.nombre_producto}</a>
                          <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                              <li>${row.presentacion}</li>
                              <li class="pt-2">
                                  <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                              </li>
                          </ul>
                          <ul class="list-unstyled d-flex justify-content-center mb-1">
                              <li>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                              </li>
                          </ul>
                          <p class="text-center mb-0">$${row.precio}</p>
                      </div>
                  </div>
              </div>`;
    });
    html += '</div>'; // Cierra la fila
    res.send(html);
  });
});


app.get('/productosprincesas', (req, res) => {
  const query = 'SELECT id, nombre_producto, precio, presentacion FROM productos where presentacion = "Princesa"';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error.toString());
      return;
    }

    let html = '<div class="row">'; // Inicia una fila para los productos
    results.forEach(row => {
      const image_name = row.nombre_producto.replace(/\s+/g, '_').toLowerCase() + '.png';
      const uniqueId = `product_${row.id}`; // Genera un id único para cada producto
      html += `<div class="col-md-4">
                  <div class="card mb-4 product-wap rounded-0">
                      <div class="card rounded-0">
                          <img class="card-img rounded-0 img-fluid" src="assets/img/${image_name}" alt="${row.nombre_producto}">
                          <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                              <ul class="list-unstyled">
                                   
                                  <li><a class="btn btn-success text-white mt-2" onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')"><i class="fas fa-cart-plus"></i></a></li>
                              </ul>
                          </div>
                      </div>
                      <div class="card-body">
                          <a onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')" class="h3 text-decoration-none">${row.nombre_producto}</a>
                          <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                              <li>${row.presentacion}</li>
                              <li class="pt-2">
                                  <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                              </li>
                          </ul>
                          <ul class="list-unstyled d-flex justify-content-center mb-1">
                              <li>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                              </li>
                          </ul>
                          <p class="text-center mb-0">$${row.precio}</p>
                      </div>
                  </div>
              </div>`;
    });
    html += '</div>'; // Cierra la fila
    res.send(html);
  });
});




app.get('/productosnovias', (req, res) => {
  const query = 'SELECT id, nombre_producto, precio, presentacion FROM productos where presentacion = "Novia"';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error.toString());
      return;
    }

    let html = '<div class="row">'; // Inicia una fila para los productos
    results.forEach(row => {
      const image_name = row.nombre_producto.replace(/\s+/g, '_').toLowerCase() + '.png';
      const uniqueId = `product_${row.id}`; // Genera un id único para cada producto
      html += `<div class="col-md-4">
                  <div class="card mb-4 product-wap rounded-0">
                      <div class="card rounded-0">
                          <img class="card-img rounded-0 img-fluid" src="assets/img/${image_name}" alt="${row.nombre_producto}">
                          <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                              <ul class="list-unstyled">
                                   
                                  <li><a class="btn btn-success text-white mt-2" onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')"><i class="fas fa-cart-plus"></i></a></li>
                              </ul>
                          </div>
                      </div>
                      <div class="card-body">
                          <a onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')" class="h3 text-decoration-none">${row.nombre_producto}</a>
                          <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                              <li>${row.presentacion}</li>
                              <li class="pt-2">
                                  <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                              </li>
                          </ul>
                          <ul class="list-unstyled d-flex justify-content-center mb-1">
                              <li>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                              </li>
                          </ul>
                          <p class="text-center mb-0">$${row.precio}</p>
                      </div>
                  </div>
              </div>`;
    });
    html += '</div>'; // Cierra la fila
    res.send(html);
  });
});



app.get('/productossombreros', (req, res) => {
  const query = 'SELECT id, nombre_producto, precio, presentacion FROM productos where presentacion = "Sombreros"';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error.toString());
      return;
    }

    let html = '<div class="row">'; // Inicia una fila para los productos
    results.forEach(row => {
      const image_name = row.nombre_producto.replace(/\s+/g, '_').toLowerCase() + '.png';
      const uniqueId = `product_${row.id}`; // Genera un id único para cada producto
      html += `<div class="col-md-4">
                  <div class="card mb-4 product-wap rounded-0">
                      <div class="card rounded-0">
                          <img class="card-img rounded-0 img-fluid" src="assets/img/${image_name}" alt="${row.nombre_producto}">
                          <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                              <ul class="list-unstyled">
                                   
                                  <li><a class="btn btn-success text-white mt-2" onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')"><i class="fas fa-cart-plus"></i></a></li>
                              </ul>
                          </div>
                      </div>
                      <div class="card-body">
                          <a onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')" class="h3 text-decoration-none">${row.nombre_producto}</a>
                          <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                              <li>${row.presentacion}</li>
                              <li class="pt-2">
                                  <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                              </li>
                          </ul>
                          <ul class="list-unstyled d-flex justify-content-center mb-1">
                              <li>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                              </li>
                          </ul>
                          <p class="text-center mb-0">$${row.precio}</p>
                      </div>
                  </div>
              </div>`;
    });
    html += '</div>'; // Cierra la fila
    res.send(html);
  });
});





app.get('/productosramos', (req, res) => {
  const query = 'SELECT id, nombre_producto, precio, presentacion FROM productos where presentacion = "Ramos"';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error.toString());
      return;
    }

    let html = '<div class="row">'; // Inicia una fila para los productos
    results.forEach(row => {
      const image_name = row.nombre_producto.replace(/\s+/g, '_').toLowerCase() + '.png';
      const uniqueId = `product_${row.id}`; // Genera un id único para cada producto
      html += `<div class="col-md-4">
                  <div class="card mb-4 product-wap rounded-0">
                      <div class="card rounded-0">
                          <img class="card-img rounded-0 img-fluid" src="assets/img/${image_name}" alt="${row.nombre_producto}">
                          <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                              <ul class="list-unstyled">
                                   
                                  <li><a class="btn btn-success text-white mt-2" onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')"><i class="fas fa-cart-plus"></i></a></li>
                              </ul>
                          </div>
                      </div>
                      <div class="card-body">
                          <a onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')" class="h3 text-decoration-none">${row.nombre_producto}</a>
                          <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                              <li>${row.presentacion}</li>
                              <li class="pt-2">
                                  <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                              </li>
                          </ul>
                          <ul class="list-unstyled d-flex justify-content-center mb-1">
                              <li>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                              </li>
                          </ul>
                          <p class="text-center mb-0">$${row.precio}</p>
                      </div>
                  </div>
              </div>`;
    });
    html += '</div>'; // Cierra la fila
    res.send(html);
  });
});





app.get('/productoszapatillas', (req, res) => {
  const query = 'SELECT id, nombre_producto, precio, presentacion FROM productos where presentacion = "Zapatillas"';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error.toString());
      return;
    }

    let html = '<div class="row">'; // Inicia una fila para los productos
    results.forEach(row => {
      const image_name = row.nombre_producto.replace(/\s+/g, '_').toLowerCase() + '.png';
      const uniqueId = `product_${row.id}`; // Genera un id único para cada producto
      html += `<div class="col-md-4">
                  <div class="card mb-4 product-wap rounded-0">
                      <div class="card rounded-0">
                          <img class="card-img rounded-0 img-fluid" src="assets/img/${image_name}" alt="${row.nombre_producto}">
                          <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                              <ul class="list-unstyled">
                                   
                                  <li><a class="btn btn-success text-white mt-2" onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')"><i class="fas fa-cart-plus"></i></a></li>
                              </ul>
                          </div>
                      </div>
                      <div class="card-body">
                          <a onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')" class="h3 text-decoration-none">${row.nombre_producto}</a>
                          <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                              <li>${row.presentacion}</li>
                              <li class="pt-2">
                                  <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                              </li>
                          </ul>
                          <ul class="list-unstyled d-flex justify-content-center mb-1">
                              <li>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                              </li>
                          </ul>
                          <p class="text-center mb-0">$${row.precio}</p>
                      </div>
                  </div>
              </div>`;
    });
    html += '</div>'; // Cierra la fila
    res.send(html);
  });
});



app.get('/productoscrinolinas', (req, res) => {
  const query = 'SELECT id, nombre_producto, precio, presentacion FROM productos where presentacion = "Crinolinas"';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error.toString());
      return;
    }

    let html = '<div class="row">'; // Inicia una fila para los productos
    results.forEach(row => {
      const image_name = row.nombre_producto.replace(/\s+/g, '_').toLowerCase() + '.png';
      const uniqueId = `product_${row.id}`; // Genera un id único para cada producto
      html += `<div class="col-md-4">
                  <div class="card mb-4 product-wap rounded-0">
                      <div class="card rounded-0">
                          <img class="card-img rounded-0 img-fluid" src="assets/img/${image_name}" alt="${row.nombre_producto}">
                          <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                              <ul class="list-unstyled">
                                   
                                  <li><a class="btn btn-success text-white mt-2" onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')"><i class="fas fa-cart-plus"></i></a></li>
                              </ul>
                          </div>
                      </div>
                      <div class="card-body">
                          <a onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')" class="h3 text-decoration-none">${row.nombre_producto}</a>
                          <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                              <li>${row.presentacion}</li>
                              <li class="pt-2">
                                  <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                              </li>
                          </ul>
                          <ul class="list-unstyled d-flex justify-content-center mb-1">
                              <li>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                              </li>
                          </ul>
                          <p class="text-center mb-0">$${row.precio}</p>
                      </div>
                  </div>
              </div>`;
    });
    html += '</div>'; // Cierra la fila
    res.send(html);
  });
});



app.get('/productoscojines', (req, res) => {
  const query = 'SELECT id, nombre_producto, precio, presentacion FROM productos where presentacion = "Cojines"';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error.toString());
      return;
    }

    let html = '<div class="row">'; // Inicia una fila para los productos
    results.forEach(row => {
      const image_name = row.nombre_producto.replace(/\s+/g, '_').toLowerCase() + '.png';
      const uniqueId = `product_${row.id}`; // Genera un id único para cada producto
      html += `<div class="col-md-4">
                  <div class="card mb-4 product-wap rounded-0">
                      <div class="card rounded-0">
                          <img class="card-img rounded-0 img-fluid" src="assets/img/${image_name}" alt="${row.nombre_producto}">
                          <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                              <ul class="list-unstyled">
                                   
                                  <li><a class="btn btn-success text-white mt-2" onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')"><i class="fas fa-cart-plus"></i></a></li>
                              </ul>
                          </div>
                      </div>
                      <div class="card-body">
                          <a onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')" class="h3 text-decoration-none">${row.nombre_producto}</a>
                          <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                              <li>${row.presentacion}</li>
                              <li class="pt-2">
                                  <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                              </li>
                          </ul>
                          <ul class="list-unstyled d-flex justify-content-center mb-1">
                              <li>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                              </li>
                          </ul>
                          <p class="text-center mb-0">$${row.precio}</p>
                      </div>
                  </div>
              </div>`;
    });
    html += '</div>'; // Cierra la fila
    res.send(html);
  });
});



app.get('/productostenis', (req, res) => {
  const query = 'SELECT id, nombre_producto, precio, presentacion FROM productos where presentacion = "Tenis"';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error.toString());
      return;
    }

    let html = '<div class="row">'; // Inicia una fila para los productos
    results.forEach(row => {
      const image_name = row.nombre_producto.replace(/\s+/g, '_').toLowerCase() + '.png';
      const uniqueId = `product_${row.id}`; // Genera un id único para cada producto
      html += `<div class="col-md-4">
                  <div class="card mb-4 product-wap rounded-0">
                      <div class="card rounded-0">
                          <img class="card-img rounded-0 img-fluid" src="assets/img/${image_name}" alt="${row.nombre_producto}">
                          <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                              <ul class="list-unstyled">
                                   
                                  <li><a class="btn btn-success text-white mt-2" onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')"><i class="fas fa-cart-plus"></i></a></li>
                              </ul>
                          </div>
                      </div>
                      <div class="card-body">
                          <a onclick="agregarAlCarrito('${row.precio}', '${row.id}', '${row.nombre_producto}')" class="h3 text-decoration-none">${row.nombre_producto}</a>
                          <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                              <li>${row.presentacion}</li>
                              <li class="pt-2">
                                  <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                  <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                              </li>
                          </ul>
                          <ul class="list-unstyled d-flex justify-content-center mb-1">
                              <li>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-warning fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                                  <i class="text-muted fa fa-star"></i>
                              </li>
                          </ul>
                          <p class="text-center mb-0">$${row.precio}</p>
                      </div>
                  </div>
              </div>`;
    });
    html += '</div>'; // Cierra la fila
    res.send(html);
  });
});

// Ruta de autenticación
app.post('/login_usuario', (req, res) => {
  const nombre_completo = req.body.nombre_completo;
  const contrasena = req.body.contrasena;

  // Consulta para verificar las credenciales
  const sql = 'SELECT tipo_usuario, contraseña FROM usuarios WHERE nombre_usuario = ?';
  connection.query(sql, [nombre_completo], async (error, results) => {
    if (error) {
      console.error('Error en la consulta: ' + error);
      res.status(500).send('Error en el servidor');
      return;
    }

    if (results.length > 0) {
      const user = results[0];
      
      // Comparar la contraseña con el hash almacenado
      const validPassword = await bcrypt.compare(contrasena, user.contraseña);
      if (contrasena) {
        if (user.tipo_usuario === 'admin') {
          res.redirect('/admin.html');
        } else if (user.tipo_usuario === 'cliente') {
          res.redirect('/index_cl.html');
        }
      } else {
        res.send('No se pudo iniciar sesión: Credenciales incorrectas');
      }
    } else {
      res.send('No se pudo iniciar sesión: Credenciales incorrectas');
    }
  });
});


// Servir archivos estáticos (HTML, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
