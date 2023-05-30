let contenedor = document.getElementById('contPrincipal');

let carrito = []; // Arreglo para almacenar los productos agregados al carrito
let costoTotal = 0; // Variable para almacenar el costo total

window.addEventListener('DOMContentLoaded', function() {
  // Verificar si hay datos en localStorage
  if (localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito')); // Cargar los datos en el carrito
    actualizarCantidadProductos(); // Actualizar la cantidad de productos en el carrito
  }
});

for (let i = 0; i < producto.length; i++) {
  let creaDiv = document.createElement('div');
  let creaImg = document.createElement('img');
  let contenedorProducto = document.createElement('div');
  let nombreProducto = document.createElement('p');
  let precioProducto = document.createElement('p');
  let agregarCarritoBtn = document.createElement('button');

  creaDiv.style.display = 'inline-block';
  creaDiv.style.marginRight = '5px';
  creaImg.style.width = '100px';
  creaImg.style.height = 'auto';
  contenedorProducto.style.textAlign = 'center';

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
  let productoCarrito = [...producto, 1]; // Agregar cantidad inicial de 1 al producto
  const stock = obtenerStock(producto);

  if (stock > 0) {
    if (validarStockDisponible(producto)) {
      // Buscar si el producto ya está en el carrito
      const index = carrito.findIndex(item => item[0] === producto[0]);

      if (index !== -1) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        carrito[index][carrito[index].length - 1]++;
      } else {
        // Si el producto no está en el carrito, agregarlo al carrito
        carrito.push(productoCarrito);
      }

      localStorage.setItem('carrito', JSON.stringify(carrito)); // Almacenar el carrito en localStorage
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
  costoTotal = 0; // Reiniciar el costo total antes de recalcularlo

  // Recorrer el carrito y sumar los valores de los productos
  for (let i = 0; i < carrito.length; i++) {
    const precio = parseFloat(carrito[i][1].replace('$', '')); // Obtener el valor numérico del precio
    costoTotal += precio * carrito[i][carrito[i].length - 1]; // Multiplicar el precio por la cantidad del producto
  }

  costoTotalElement.textContent = costoTotal + '$'; // Mostrar el costo total en el elemento span con id 'costoTotal'
}

function limpiarCarrito() {
  carrito = []; // Limpiar el carrito
  localStorage.removeItem('carrito'); // Eliminar los datos de localStorage
  actualizarCantidadProductos(); // Actualizar la cantidad de productos en el carrito
}

let limpiarCarritoBtn = document.createElement('button');
limpiarCarritoBtn.textContent = 'Limpiar carrito';
limpiarCarritoBtn.style.backgroundColor = 'red';

limpiarCarritoBtn.addEventListener('click', function() {
  limpiarCarrito();
});

contenedor.appendChild(limpiarCarritoBtn);

let verCarritoBtn = document.getElementById('verCarro');
let contenedorCompras = document.getElementById('contenedorCompras');

verCarritoBtn.addEventListener('click', function() {
  mostrarCarrito();
});

function mostrarCarrito() {
  contenedorCompras.innerHTML = ''; // Limpiar el contenido del contenedor

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
      localStorage.setItem('carrito', JSON.stringify(carrito)); // Actualizar el carrito en localStorage
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
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Actualizar el carrito en localStorage
    mostrarCarrito();
  }
}

function eliminarProducto(index) {
  carrito.splice(index, 1); // Eliminar el producto del carrito
  localStorage.setItem('carrito', JSON.stringify(carrito)); // Actualizar el carrito en localStorage
  mostrarCarrito();
}

let terminarCompraBtn = document.getElementById('terminarCompra');

terminarCompraBtn.addEventListener('click', function() {
  alert('¡Su compra ha sido exitosa!');
});
