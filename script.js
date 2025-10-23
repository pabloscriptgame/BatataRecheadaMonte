let cart = [];

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    toast.textContent = message;
    container.appendChild(toast);

    // Mostra o toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
}

function addToCart(itemName, button, fixedPrice = null) {
    const sizeButtons = button ? button.parentElement.querySelectorAll('.size-btn') : null;
    let selectedSize = 'Médio'; // Default para especiais
    let price = fixedPrice || 0;

    if (sizeButtons) {
        const selectedBtn = Array.from(sizeButtons).find(btn => btn.classList.contains('selected'));
        if (!selectedBtn) {
            showToast('Selecione um tamanho!', 'error');
            return;
        }
        selectedSize = selectedBtn.dataset.size;
        price = parseFloat(selectedBtn.dataset.price);
    }

    cart.push({ name: itemName, size: selectedSize, price: price });
    updateCart();
    if (sizeButtons) {
        sizeButtons.forEach(btn => btn.classList.remove('selected'));
        selectedBtn.classList.add('selected');
    }
    // Notificação de sucesso ao adicionar
    showToast(`${itemName} ${selectedSize} adicionado ao carrinho!`, 'success');
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `<span>${item.name} (${item.size})</span><span>R$ ${item.price.toFixed(2)}</span><button onclick="removeFromCart(${index})">Remover</button>`;
        cartItems.appendChild(div);
        subtotal += item.price;
    });

    // Lógica para taxa de entrega/retirada
    const orderType = document.querySelector('input[name="order-type"]:checked').value;
    const deliveryFee = orderType === 'delivery' ? 8.00 : 0.00;
    const deliveryLine = document.getElementById('delivery-line');
    if (orderType === 'delivery') {
        deliveryLine.style.display = 'flex';
    } else {
        deliveryLine.style.display = 'none';
    }

    const total = subtotal + deliveryFee;
    totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    showToast('Item removido do carrinho!');
}

function toggleCart() {
    const cartEl = document.getElementById('cart');
    cartEl.classList.toggle('open');
}

function checkout() {
    if (cart.length === 0) {
        showToast('Carrinho vazio!', 'error');
        return;
    }

    const orderType = document.querySelector('input[name="order-type"]:checked').value;
    let message = 'Olá! Gostaria de pedir:\n';
    cart.forEach(item => {
        message += `- ${item.name} (${item.size || ''}) - R$ ${item.price.toFixed(2)}\n`;
    });

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const deliveryFee = orderType === 'delivery' ? 8.00 : 0.00;
    const total = subtotal + deliveryFee;
    message += `\nTotal: R$ ${total.toFixed(2)}`;

    if (orderType === 'pickup') {
        message += `\n\nRetirada no endereço: Rua Marajó N: 908, Bairro: Lagoinha`;
    } else {
        message += `\n\nEndereço para entrega: [insira seu endereço]\nTaxa de entrega: R$ 8,00`;
    }

    const whatsappUrl = `https://wa.me/553499194464?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    showToast('Pedido enviado! Verifique o WhatsApp.', 'success');
    cart = []; // Limpa carrinho após envio
    updateCart();
    toggleCart();
}

// Funções para Menu Mobile
function toggleMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('active');
}

function closeMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.remove('active');
}

// Seleção de tamanho
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('size-btn')) {
        e.target.parentElement.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
        e.target.classList.add('selected');
    }
});

// Listener para mudança nas opções de entrega/retirada
document.addEventListener('change', function(e) {
    if (e.target.name === 'order-type') {
        updateCart();
    }
});

// Scroll suave para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});