// Cargar carrito desde localStorage
let carrito = [];

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('sportRunCarrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
        renderizarResumenPedido();
    } else {
        // Redirigir si no hay productos en el carrito
        window.location.href = 'carrito.html';
    }
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
    const contador = document.querySelector('.cart-count');
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    contador.textContent = totalItems;
}

// Renderizar resumen del pedido
function renderizarResumenPedido() {
    const orderItems = document.getElementById('orderItems');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    let subtotal = 0;
    let html = '';
    
    carrito.forEach(item => {
        const precioTotalItem = item.precio * item.cantidad;
        subtotal += precioTotalItem;
        
        html += `
            <div class="summary-row">
                <span>${item.nombre} x${item.cantidad}</span>
                <span>$${precioTotalItem.toFixed(2)}</span>
            </div>
        `;
    });
    
    orderItems.innerHTML = html;
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${subtotal.toFixed(2)}`; // Envío gratis por ahora
}

// Seleccionar método de pago
function seleccionarMetodoPago(elemento) {
    // Quitar clase active de todos los métodos
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('active');
    });
    
    // Añadir clase active al método seleccionado
    elemento.classList.add('active');
    
    // Actualizar formulario de pago según método seleccionado
    const paymentForm = document.getElementById('paymentForm');
    const metodo = elemento.querySelector('span').textContent;
    
    if (metodo === 'Tarjeta') {
        paymentForm.innerHTML = `
            <div class="form-group">
                <label for="cardNumber">Número de tarjeta</label>
                <input type="text" id="cardNumber" class="form-control" placeholder="1234 5678 9012 3456">
            </div>
            <div class="form-group">
                <label for="cardName">Nombre en la tarjeta</label>
                <input type="text" id="cardName" class="form-control" placeholder="Nombre como aparece en la tarjeta">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="cardExpiry">Fecha de expiración</label>
                    <input type="text" id="cardExpiry" class="form-control" placeholder="MM/AA">
                </div>
                <div class="form-group">
                    <label for="cardCvv">CVV</label>
                    <input type="text" id="cardCvv" class="form-control" placeholder="123">
                </div>
            </div>
        `;
    } else if (metodo === 'PayPal') {
        paymentForm.innerHTML = `
            <div class="form-group">
                <p>Serás redirigido a PayPal para completar tu pago de manera segura.</p>
            </div>
        `;
    } else if (metodo === 'Transferencia') {
        paymentForm.innerHTML = `
            <div class="form-group">
                <p>Por favor realiza una transferencia a nuestra cuenta bancaria:</p>
                <p><strong>Banco:</strong> Banco Ejemplo</p>
                <p><strong>IBAN:</strong> ESXX XXXX XXXX XXXX XXXX XXXX</p>
                <p><strong>Titular:</strong> SportRun S.L.</p>
                <p>Indica tu número de pedido como concepto.</p>
            </div>
        `;
    }
}

// Validar formulario
function validarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    const codigoPostal = document.getElementById('codigo_postal').value.trim();
    const provincia = document.getElementById('provincia').value.trim();
    
    // Validación básica
    if (!nombre || !email || !telefono || !direccion || !ciudad || !codigoPostal || !provincia) {
        alert('Por favor completa todos los campos obligatorios.');
        return false;
    }
    
    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor introduce un email válido.');
        return false;
    }
    
    // Validación de teléfono (solo que tenga al menos 9 dígitos)
    const telefonoRegex = /^[0-9]{9,}$/;
    if (!telefonoRegex.test(telefono.replace(/\D/g, ''))) {
        alert('Por favor introduce un número de teléfono válido.');
        return false;
    }
    
    return true;
}

// Finalizar compra
function finalizarCompra() {
    if (!validarFormulario()) {
        return;
    }
    
    // Obtener método de pago seleccionado
    const metodoPago = document.querySelector('.payment-method.active span').textContent;
    
    // Crear objeto con los datos del pedido
    const pedido = {
        fecha: new Date().toISOString(),
        cliente: {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            direccion: {
                calle: document.getElementById('direccion').value.trim(),
                ciudad: document.getElementById('ciudad').value.trim(),
                codigoPostal: document.getElementById('codigo_postal').value.trim(),
                provincia: document.getElementById('provincia').value.trim()
            }
        },
        metodoPago: metodoPago,
        productos: carrito,
        total: document.getElementById('total').textContent
    };
    
    // Aquí normalmente enviaríamos los datos a un servidor
    console.log('Pedido realizado:', pedido);
    
    // Guardar pedido en localStorage (simulación)
    localStorage.setItem('sportRunUltimoPedido', JSON.stringify(pedido));
    
    // Limpiar carrito
    localStorage.removeItem('sportRunCarrito');
    carrito = [];
    actualizarContadorCarrito();
    
    // Redirigir a página de confirmación
    window.location.href = 'confirmacion.html';
}

// Inicializar eventos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    
    // Asignar evento al botón de finalizar compra
    document.querySelector('.orange-btn').addEventListener('click', finalizarCompra);
    
    // Asignar eventos a los métodos de pago (ya están en el HTML con onclick)
    
    // Formatear inputs especiales
    document.getElementById('telefono')?.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9+]/g, '');
    });
    
    document.getElementById('cardNumber')?.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9 ]/g, '').replace(/(\d{4})/g, '$1 ').trim();
    });
    
    document.getElementById('cardExpiry')?.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9/]/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
    });
    
    document.getElementById('cardCvv')?.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '').substring(0, 4);
    });
});