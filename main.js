let contenedor = document.getElementById('contPrincipal');

let carrito = []; // Arreglo para guardar los productos que se agreguen al carrito
let costoTotal = 0; // Este let es para almacenar el costo total

window.addEventListener('DOMContentLoaded', function() {
  // Esto es para verificar si hay datos en el localStorage
  if (localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito')); // Con esto se cargan los datos que haya en el carrito si hay algun producto
    actualizarCantidadProductos(); // Para acatualizar la cantidad de productos en el carrito
  }
});

for (let i = 0; i < producto.length; i++) {
  let creaDiv = document.createElement('div');
  let creaImg = document.createElement('img');
  let contenedorProducto = document.createElement('div');
  let nombreProducto = document.createElement('p');
  let precioProducto = document.createElement('p');
  let agregarCarritoBtn = document.createElement('button');

  // aca esta el estilo con codigo de js de los productos
  creaDiv.style.display = 'inline-block';
  creaDiv.style.marginRight = '5px';
  creaImg.style.width = '100px';
  creaImg.style.height = 'auto';
  contenedorProducto.style.textAlign = 'center';

  //Este seria una card, digamos, donde se llama 2 caracteristicas segun la posicion de las mismas
  nombreProducto.textContent = producto[i][0];
  precioProducto.textContent = producto[i][1];
  agregarCarritoBtn.textContent = 'Agregar al carrito';
  agregarCarritoBtn.style.backgroundColor = 'yellow';

  agregarCarritoBtn.addEventListener('click', function() {
    agregarAlCarrito(producto[i]);
    actualizarCantidadProductos();
  });

  contenedorProducto.appendChild(nombreProducto);
  contenedorProducto.appendChild(creaImg);
  contenedorProducto.appendChild(precioProducto);
  contenedorProducto.appendChild(agregarCarritoBtn);

  creaImg.setAttribute('src', producto[i][3]);

  contenedor.appendChild(contenedorProducto);
}
// es el sistema de grilla y aproveche a hacerlo responsive
let contenedorCSS = contenedor.style;
contenedorCSS.display = 'grid';
contenedorCSS.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
contenedorCSS.gridAutoRows = 'auto';
contenedorCSS.gap = '10px';

const mediaQuery = window.matchMedia('(max-width: 768px)');
if (mediaQuery.matches) {
  contenedorCSS.gridTemplateColumns = 'repeat(2, 1fr)';
  contenedorCSS.gridAutoRows = 'auto';
}

function agregarAlCarrito(producto) {
  let productoCarrito = [...producto, 1]; // Agrega la cantidad inicial de "1" al producto
  const stock = obtenerStock(producto);

  if (stock > 0) {
    if (validarStockDisponible(producto)) {
      // Esto es para buscar si el producto ya está en el carrito agregado
      const index = carrito.findIndex(item => item[0] === producto[0]);

      if (index !== -1) {
        // Si ya está agregado se le suma uno mas
        carrito[index][carrito[index].length - 1]++;
      } else {
        // y si no está se agrega
        carrito.push(productoCarrito);
      }

      localStorage.setItem('carrito', JSON.stringify(carrito)); // Almacenamos el carrito con LocalStorage aca
    } else {
      alert('Lo sentimos, no hay más productos en stock');
    }
  } else {
    alert('Lo sentimos, el producto está agotado');
  }
}

function obtenerStock(producto) {
  const stockString = producto[2];
  const stock = parseInt(stockString.replace('stock: ', ''));
  return stock;
}

function validarStockDisponible(producto) {
  const stock = obtenerStock(producto);
  const carritoProducto = carrito.find(item => item[0] === producto[0]);

  if (carritoProducto) {
    return (carritoProducto[carritoProducto.length - 1] + 1) <= stock;
  }

  return stock > 0;
}

function actualizarCantidadProductos() {
  const costoTotalElement = document.getElementById('costoTotal');
  costoTotal = 0; // Es para reiniciar el costo total a 0 antes de que sea recalculado

  // Aca usé un for para recorrer el carrito y sumar los valores de los productos
  for (let i = 0; i < carrito.length; i++) {
    const precio = parseFloat(carrito[i][1].replace('$', '')); // aca podemos obtener el valor numerico del precio
    costoTotal += precio * carrito[i][carrito[i].length - 1]; // Esto sirve para multiplicar el precio por la cantidad del producto 
  }

  costoTotalElement.textContent = costoTotal + '$'; // Con esto podemos mostrar el costo total en el elemento span que tiene el id 'costoTotal'
}

function limpiarCarrito() {
  carrito = []; // aca se limpira el carro
  localStorage.removeItem('carrito'); // Se eliminan los datos de localStorage
  actualizarCantidadProductos(); // Y se actualiza la cantidad de productos en el carro
}

// Este boton es el de limpiar carrito en rojo con un evento
let limpiarCarritoBtn = document.createElement('button');
limpiarCarritoBtn.textContent = 'Limpiar carrito';
limpiarCarritoBtn.style.backgroundColor = 'red';

limpiarCarritoBtn.addEventListener('click', function() {
  limpiarCarrito();
});

contenedor.appendChild(limpiarCarritoBtn);

// Los botones son estos con los respectivos id en el HTML
let verCarritoBtn = document.getElementById('verCarro');
let contenedorCompras = document.getElementById('contenedorCompras');

verCarritoBtn.addEventListener('click', function() {
  mostrarCarrito();
});

function mostrarCarrito() {
  contenedorCompras.innerHTML = ''; // Limpiar todo el contenido

  for (let i = 0; i < carrito.length; i++) {
    let productoDiv = document.createElement('div');
    let nombreProducto = document.createElement('p');
    let precioProducto = document.createElement('p');
    let cantidadProducto = document.createElement('span');
    let incrementarBtn = document.createElement('button');
    let decrementarBtn = document.createElement('button');

    productoDiv.style.display = 'flex';
    productoDiv.style.justifyContent = 'space-between';
    productoDiv.style.alignItems = 'center';

    nombreProducto.textContent = carrito[i][0];
    precioProducto.textContent = carrito[i][1];
    cantidadProducto.textContent = carrito[i][carrito[i].length - 1];

    incrementarBtn.textContent = '+';
    incrementarBtn.style.backgroundColor = 'green';
    incrementarBtn.addEventListener('click', function() {
      incrementarCantidad(i);
      actualizarCantidadProductos();
    });

    decrementarBtn.textContent = '-';
    decrementarBtn.style.backgroundColor = 'red';
    decrementarBtn.addEventListener('click', function() {
      if (carrito[i][carrito[i].length - 1] > 1) {
        decrementarCantidad(i);
        actualizarCantidadProductos();
      } else {
        eliminarProducto(i);
        actualizarCantidadProductos();
      }
    });

    productoDiv.appendChild(nombreProducto);
    productoDiv.appendChild(precioProducto);
    productoDiv.appendChild(decrementarBtn);
    productoDiv.appendChild(cantidadProducto);
    productoDiv.appendChild(incrementarBtn);

    contenedorCompras.appendChild(productoDiv);
  }

}

function incrementarCantidad(index) {
  const stock = obtenerStock(carrito[index]);

  if (validarStockDisponible(carrito[index])) {
    if (carrito[index][carrito[index].length - 1] < stock) {
      carrito[index][carrito[index].length - 1]++;
      localStorage.setItem('carrito', JSON.stringify(carrito)); // Es para actualizar el carrito en localStorage
      mostrarCarrito();
    } else {
      alert('Lo sentimos, no hay más productos en stock');
    }
  } else {
    alert('Lo sentimos, el producto está agotado');
  }
}

function decrementarCantidad(index) {
  if (carrito[index][carrito[index].length - 1] > 0) {
    carrito[index][carrito[index].length - 1]--;
    localStorage.setItem('carrito', JSON.stringify(carrito)); 
    mostrarCarrito();
  }
}

// Funcion para eliminar producto del carrito con el boton -
function eliminarProducto(index) {
  carrito.splice(index, 1); 
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
}

//pequeña funcion con evento para corroborar que se realizo con exito la compra
let terminarCompraBtn = document.getElementById('terminarCompra');

terminarCompraBtn.addEventListener('click', function() {
  alert('¡Su compra ha sido exitosa!');
});
