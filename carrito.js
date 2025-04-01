// Cargar carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('sportRunCarrito')) || [];

// Función para renderizar los productos del carrito
function renderizarCarrito() {
    const cartItems = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    const cartCount = document.querySelector('.cart-count');
    
    let subtotal = 0;
    
    if (carrito.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Carrito vacío">
                <h2>Tu carrito está vacío</h2>
                <p>Parece que no has añadido ningún producto aún</p>
                <a href="index.html" class="orange-btn">Explorar productos</a>
            </div>
        `;
    } else {
        let html = '';
        
        carrito.forEach((item, index) => {
            const precioTotalItem = item.precio * item.cantidad;
            subtotal += precioTotalItem;
            
            html += `
                <div class="cart-item">
                    <img src="${item.imagen}" alt="${item.nombre}">
                    <div class="item-details">
                        <h3>${item.nombre}</h3>
                        <p>Talla: ${item.talla}</p>
                        <div class="quantity-control">
                            <button class="quantity-btn minus" onclick="updateQuantity(${index}, -1)">-</button>
                            <input type="number" class="quantity-input" value="${item.cantidad}" min="1" 
                                   onchange="updateQuantityInput(${index}, this.value)">
                            <button class="quantity-btn plus" onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                    </div>
                    <div class="item-total">$${precioTotalItem.toFixed(2)}</div>
                    <button class="remove-item" onclick="eliminarDelCarrito(${index})">×</button>
                </div>
            `;
        });
        
        cartItems.innerHTML = html;
    }
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${subtotal.toFixed(2)}`;
    cartCount.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);
}

// Función para actualizar la cantidad desde los botones +/-
function updateQuantity(index, change) {
    const newQuantity = carrito[index].cantidad + change;
    
    if (newQuantity < 1) {
        if (confirm('¿Deseas eliminar este producto del carrito?')) {
            eliminarDelCarrito(index);
        }
        return;
    }
    
    carrito[index].cantidad = newQuantity;
    guardarCarrito();
    renderizarCarrito();
}

// Función para actualizar la cantidad desde el input (versión corregida)
function updateQuantityInput(index, value) {
    const newQuantity = parseInt(value);
    
    // Validación más robusta
    if (isNaN(newQuantity)) {
        // Si no es un número, restablecer al valor anterior
        renderizarCarrito();
        return;
    }
    
    if (newQuantity < 1) {
        // Si la cantidad es menor a 1, preguntar antes de eliminar
        if (confirm('¿Deseas eliminar este producto del carrito?')) {
            eliminarDelCarrito(index);
        } else {
            renderizarCarrito(); // Restablecer al valor anterior
        }
        return;
    }
    
    // Actualizar cantidad si todo está bien
    carrito[index].cantidad = newQuantity;
    guardarCarrito();
    renderizarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    renderizarCarrito();
    
    // Mostrar notificación
    mostrarNotificacion('Producto eliminado del carrito');
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('sportRunCarrito', JSON.stringify(carrito));
    
    // Actualizar contador en todas las páginas
    const cartCount = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cartCount;
    });
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

// Estilo para la notificación (si no está en tu CSS)
const estiloNotificacion = document.createElement('style');
estiloNotificacion.textContent = `
    .notificacion-carrito {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #ff6b00;
        color: white;
        padding: 15px;
        border-radius: 4px;
        z-index: 1000;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s, transform 0.3s;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    }
    
    .notificacion-carrito.mostrar {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(estiloNotificacion);

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', renderizarCarrito);