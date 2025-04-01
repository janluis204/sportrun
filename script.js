// Modal de producto
const modal = document.getElementById('productModal');
const modalProductImage = document.getElementById('modalProductImage');
const modalProductTitle = document.getElementById('modalProductTitle');
const modalProductPrice = document.getElementById('modalProductPrice');
const modalTotalPrice = document.getElementById('modalTotalPrice');

function openModal(productId) {
    // Aquí en una implementación real, cargaríamos la información del producto
    // basada en el ID recibido
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Evitar scroll
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll
}

// Cerrar el modal al hacer clic fuera del contenido
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Inicializar la funcionalidad cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Thumbnails en el modal
    const thumbnails = document.querySelectorAll('.product-thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Quitar la clase active de todos los thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            // Añadir la clase active al thumbnail seleccionado
            this.classList.add('active');
            // Actualizar la imagen principal
            modalProductImage.src = this.querySelector('img').src;
        });
    });
    
    // Selección de talla
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Quitar la clase active de todas las opciones
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            // Añadir la clase active a la opción seleccionada
            this.classList.add('active');
        });
    });

    // Selección de método de pago
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Quitar la clase active de todos los métodos
            paymentMethods.forEach(m => m.classList.remove('active'));
            // Añadir la clase active al método seleccionado
            this.classList.add('active');
        });
    });

    
});

// carrito ---------------------------------------------------------------------------------------------

// Función para añadir productos al carrito
function addToCart(productId) {
    // En un caso real, podrías abrir el modal para seleccionar talla aquí
    // Por ahora usaremos talla por defecto '40'
    const talla = '40';
    const cantidad = 1;
    
    // Buscar el producto en nuestro array de productos
    const producto = productos.find(p => p.id === productId);
    
    if (!producto) {
        console.error('Producto no encontrado');
        return;
    }
    
    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => 
        item.id === productId && item.talla === talla
    );
    
    if (itemExistente) {
        // Incrementar cantidad si ya existe
        itemExistente.cantidad += cantidad;
    } else {
        // Agregar nuevo item al carrito
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            talla: talla,
            cantidad: cantidad
        });
    }
    
    // Actualizar localStorage y contador
    guardarCarrito();
    mostrarNotificacion(`${producto.nombre} agregado al carrito`);
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-carrito';
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 10);
    
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Asegúrate de que estas funciones estén en tu script.js
function guardarCarrito() {
    localStorage.setItem('sportRunCarrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const contador = document.querySelector('.cart-count');
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    contador.textContent = totalItems;
}

// Cargar carrito al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    const carritoGuardado = localStorage.getItem('sportRunCarrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
    }
});

// Variables para el modal
let productoActual = null;
let tallaSeleccionada = '40';
let cantidadSeleccionada = 1;

// Función para abrir el modal con un producto específico
function openProductModal(productId) {
    // Aquí deberías obtener el producto real de tu base de datos o array
    productoActual = {
        id: productId,
        nombre: document.querySelector(`.product-card:nth-child(${productId}) h3`).textContent,
        precio: parseFloat(document.querySelector(`.product-card:nth-child(${productId}) .product-price`).textContent.replace('$', '')),
        imagen: document.querySelector(`.product-card:nth-child(${productId}) img`).src
    };
    
    // Actualizar el modal con los datos del producto
    document.getElementById('modalProductTitle').textContent = productoActual.nombre;
    document.getElementById('modalProductPrice').textContent = `$${productoActual.precio.toFixed(2)}`;
    document.getElementById('modalTotalPrice').textContent = `$${productoActual.precio.toFixed(2)}`;
    document.getElementById('modalProductImage').src = productoActual.imagen;
    
    // Mostrar el modal
    document.getElementById('productModal').style.display = 'block';
}

// Función para seleccionar talla
function selectSize(element) {
    document.querySelectorAll('.size-option').forEach(option => {
        option.classList.remove('active');
    });
    element.classList.add('active');
    tallaSeleccionada = element.textContent;
    updateSummary();
}

// Función para cambiar cantidad
function changeQuantity(change) {
    const quantityInput = document.getElementById('productQuantity');
    let newQuantity = parseInt(quantityInput.value) + change;
    
    if (newQuantity < 1) newQuantity = 1;
    
    quantityInput.value = newQuantity;
    cantidadSeleccionada = newQuantity;
    document.getElementById('modalProductQuantity').textContent = newQuantity;
    updateSummary();
}

// Función para actualizar el resumen
function updateSummary() {
    if (!productoActual) return;
    
    const total = productoActual.precio * cantidadSeleccionada;
    document.getElementById('modalTotalPrice').textContent = `$${total.toFixed(2)}`;
}

// Función para añadir al carrito desde el modal
function addToCartFromModal() {
    if (!productoActual) return;
    
    // Obtener la cantidad actual
    cantidadSeleccionada = parseInt(document.getElementById('productQuantity').value) || 1;
    
    // Obtener el carrito actual o crear uno nuevo
    let carrito = JSON.parse(localStorage.getItem('sportRunCarrito')) || [];
    
    // Buscar si el producto ya está en el carrito con la misma talla
    const itemExistente = carrito.find(item => 
        item.id === productoActual.id && item.talla === tallaSeleccionada
    );
    
    if (itemExistente) {
        // Si ya existe, actualizar la cantidad
        itemExistente.cantidad += cantidadSeleccionada;
    } else {
        // Si no existe, añadirlo al carrito
        carrito.push({
            id: productoActual.id,
            nombre: productoActual.nombre,
            precio: productoActual.precio,
            imagen: productoActual.imagen,
            talla: tallaSeleccionada,
            cantidad: cantidadSeleccionada
        });
    }
    
    // Guardar en localStorage
    localStorage.setItem('sportRunCarrito', JSON.stringify(carrito));
    
    // Mostrar notificación
    alert(`${productoActual.nombre} (Talla: ${tallaSeleccionada}) añadido al carrito`);
    
    // Actualizar el contador del carrito
    updateCartCount();
    
    // Cerrar el modal
    closeModal();
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const carrito = JSON.parse(localStorage.getItem('sportRunCarrito')) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

// Función para cerrar el modal
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar contador del carrito al cargar
    updateCartCount();
    
    // Cerrar modal al hacer clic fuera
    window.onclick = function(event) {
        if (event.target === document.getElementById('productModal')) {
            closeModal();
        }
    };
    
    // Validar input de cantidad
    document.getElementById('productQuantity')?.addEventListener('change', function() {
        const value = parseInt(this.value);
        if (isNaN(value)) {
            this.value = '1';
            cantidadSeleccionada = 1;
        } else if (value < 1) {
            this.value = '1';
            cantidadSeleccionada = 1;
        } else {
            cantidadSeleccionada = value;
        }
        updateSummary();
    });
});

// seccion de confirmacion
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del pedido desde localStorage
    const pedido = JSON.parse(localStorage.getItem('sportRunUltimoPedido'));

    // Si no hay pedido, redirigir al inicio
    if (!pedido) {
        window.location.href = 'index.html';
        return;
    }

    // Mostrar información del pedido
    if (pedido.productos && pedido.productos.length > 0) {
        const orderSummary = document.getElementById('orderSummary');
        let html = '';
        let subtotal = 0;

        pedido.productos.forEach(item => {
            const precioTotal = item.precio * item.cantidad;
            subtotal += precioTotal;

            html += `
                <div class="detail-row">
                    <span>${item.nombre} (Talla: ${item.talla}) x${item.cantidad}</span>
                    <span>$${precioTotal.toFixed(2)}</span>
                </div>
            `;
        });

        orderSummary.innerHTML = html;
        document.getElementById('orderTotal').textContent = `$${subtotal.toFixed(2)}`;

        // Agregar el total pagado en la sección de confirmación
        const totalPagado = document.createElement('div');
        totalPagado.classList.add('total-pagado');
        totalPagado.innerHTML = `<strong>Total Pagado: $${subtotal.toFixed(2)}</strong>`;
        orderSummary.appendChild(totalPagado);
    }

    // Mostrar información del cliente
    if (pedido.cliente) {
        const shippingAddress = `${pedido.cliente.direccion.calle}, ${pedido.cliente.direccion.ciudad}, ${pedido.cliente.direccion.provincia} ${pedido.cliente.direccion.codigoPostal}`;
        document.getElementById('shippingAddress').textContent = shippingAddress;
    }

    // Mostrar método de pago
    if (pedido.metodoPago) {
        document.getElementById('paymentMethod').textContent = pedido.metodoPago;
    }

    // Calcular fecha estimada de entrega (3-5 días hábiles)
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3 + Math.floor(Math.random() * 3));

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('deliveryDate').textContent = deliveryDate.toLocaleDateString('es-ES', options);

    // Limpiar el carrito después de mostrar la confirmación
    localStorage.removeItem('sportRunCarrito');
    actualizarContadorCarrito();
});

// Función para actualizar contador del carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('sportRunCarrito')) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}
