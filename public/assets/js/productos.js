//Scroll
let menuVisible = false;
//Función que oculta o muestra el menu
function mostrarOcultarMenu(){
    if(menuVisible){
        document.getElementById("nav").classList ="";
        menuVisible = false;
    }else{
        document.getElementById("nav").classList ="responsive";
        menuVisible = true;
    }
}

function seleccionar(){
    //oculto el menu una vez que selecciono una opcion
    document.getElementById("nav").classList = "";
    menuVisible = false;
}
let listaVisible = false;

function toggleLista() {
    const lista = document.getElementById('carrito-desplegable');
    if (!listaVisible) {
        lista.style.display = 'block'; // Mostrar lista
    } else {
        lista.style.display = 'none'; // Ocultar lista
    }
    listaVisible = !listaVisible; // Cambiar estado
}




// Función para mostrar el submenú "Marcas" cuando se hace clic
function mostrarSubMenuInterno(submenuId) {
    var submenuInterno = document.getElementById(submenuId);
    submenuInterno.classList.toggle("active");
}

// Función para mostrar u ocultar el menú en pantallas pequeñas
function mostrarOcultarMenu() {
    var menu = document.querySelector('.contenedor-header .navegador ul');
    menu.classList.toggle('active');
}

// Función para ocultar el menú en pantallas pequeñas después de hacer clic en un enlace
function seleccionar() {
    var menu = document.querySelector('.contenedor-header .navegador ul');
    menu.classList.remove('active');
}

// Función para mostrar u ocultar los submenús
function mostrarSubMenu(menuId) {
    var subMenu = document.getElementById(menuId + 'SubMenu');
    if (subMenu) {
        subMenu.classList.toggle('active');
    }
}


function mostrarMensaje() {
    alert("Por favor, inicie sesión o regístrese para continuar.");
}

// Función para mostrar el submenú "Marcas" cuando se hace clic
function mostrarSubMenuInterno(submenuId) {
    var submenuInterno = document.getElementById(submenuId);
    submenuInterno.classList.toggle("active");
}

// Función para mostrar u ocultar el menú en pantallas pequeñas
function mostrarOcultarMenu() {
    var menu = document.querySelector('.contenedor-header .navegador ul');
    menu.classList.toggle('active');
}

// Función para ocultar el menú en pantallas pequeñas después de hacer clic en un enlace
function seleccionar() {
    var menu = document.querySelector('.contenedor-header .navegador ul');
    menu.classList.remove('active');
}

// Función para mostrar u ocultar los submenús
function mostrarSubMenu(menuId) {
    var subMenu = document.getElementById(menuId + 'SubMenu');
    if (subMenu) {
        subMenu.classList.toggle('active');
    }
}









//despliega lista para el carrito
function toggleLista() {
    var listaCarrito = document.getElementById("cart-items");
    if (listaCarrito.style.display === "none") {
        listaCarrito.style.display = "block";
    } else {
        listaCarrito.style.display = "none";
    }
}






// Función para agregar un producto al carrito
function agregarAlCarrito(precio, itemId, nombreProducto) {
    // Verificar si el producto ya está en el carrito
    var carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    var productoExistente = carrito.find(function(producto) {
        return producto.itemId === itemId;
    });

    if (productoExistente) {
        // Incrementar la cantidad si el producto ya existe
        productoExistente.cantidad++;
		  alert('¡Producto agregado al carrito!');
    } else {
        // Agregar un nuevo producto al carrito
        carrito.push({ itemId: itemId, nombre: nombreProducto, precio: precio, cantidad: 1 });
		  alert('¡Producto agregado al carrito!');
    }

    // Guardar los productos del carrito en el almacenamiento local
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar la visualización del carrito
    cargarProductosDelCarrito();

    // Mostrar una alerta
  
}


// Función para quitar un producto del carrito
function quitarDelCarrito(itemId) {
    // Obtener el carrito del almacenamiento local
    var carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Encontrar el producto en el carrito
    var producto = carrito.find(function(producto) {
        return producto.itemId === itemId;
    });

    if (producto) {
        // Disminuir la cantidad del producto
        producto.cantidad--;

        // Eliminar el producto del carrito si la cantidad llega a cero
        if (producto.cantidad === 0) {
            var index = carrito.indexOf(producto);
            carrito.splice(index, 1);
        }
    }

    // Guardar los productos actualizados del carrito en el almacenamiento local
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar la visualización del carrito
    cargarProductosDelCarrito();
}

// Cargar los productos del carrito al cambiar de sección
function cargarProductosDelCarrito() {
    var carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    var cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    var total = 0;

    if (carrito.length === 0) {
        cartItems.innerHTML = '<li>No hay productos en el carrito</li>';
    } else {
        carrito.forEach(function (producto) {
            var li = document.createElement('li');

            var p = document.createElement('p');
            p.textContent = `${producto.nombre} - $${producto.precio} x ${producto.cantidad}`;
            li.appendChild(p);
            
            // Crear un botón para quitar el producto
            var btnQuitar = document.createElement('button');
            btnQuitar.textContent = 'Quitar';
            btnQuitar.onclick = function() {
                quitarDelCarrito(producto.itemId);
            };
            
            // Agregar el botón al elemento de la lista
            li.appendChild(btnQuitar);
            
            cartItems.appendChild(li);

            // Calcular el subtotal por producto
            var subtotal = producto.precio * producto.cantidad;
            total += subtotal;
        });
    }

    // Mostrar el total del carrito
    document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Cargar los productos del carrito al cargar la página
window.onload = function() {
    cargarProductosDelCarrito();
};

// Agregar event listener a los botones de "Añadir al carrito" con ID
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const itemId = this.getAttribute('data-item-id');
        const nombre = this.getAttribute('data-nombre');
        const precio = parseFloat(this.getAttribute('data-precio'));
        const imagen = this.getAttribute('data-imagen');
        agregarAlCarrito(precio, itemId, nombre, imagen);
    });
});

