let cart = JSON.parse(localStorage.getItem('cart')) || [];
let debounceTimer;

// Debounce utilitário para updates frequentes em mobile
function debounce(func, delay) {
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}

const debouncedUpdateCart = debounce(updateCart, 150);

// Funções para Lightbox (Zoom de Imagens)
function openLightbox(imageSrc, caption = '') {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = caption;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Previne scroll no fundo
    lightboxImg.style.transform = 'scale(0)';
    setTimeout(() => lightboxImg.style.transform = 'scale(1)', 10);
}

function closeLightbox(event) {
    if (event && event.target.id !== 'lightbox-img') {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        lightboxImg.style.transform = 'scale(0)';
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Adicionar zoom no hover/tap para imagem no lightbox
document.addEventListener('DOMContentLoaded', function() {
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightboxImg) {
        lightboxImg.addEventListener('click', function(e) {
            e.stopPropagation(); // Previne fechar ao clicar na img
            this.style.transform = this.style.transform === 'scale(1.5)' ? 'scale(1)' : 'scale(1.5)';
        });
    }
});

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
}

function copyPix() {
    const pixKey = '34999194464';
    navigator.clipboard.writeText(pixKey).then(() => {
        showToast('Chave PIX copiada!', 'success');
    }).catch(() => {
        showToast('Erro ao copiar chave PIX.', 'error');
    });
}

function addToCart(itemName, button, fixedPrice = null) {
    const sizeButtons = button ? button.closest('.menu-item').querySelectorAll('.size-btn') : null;
    let selectedSize = 'Padrão';
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

    const existingItemIndex = cart.findIndex(item => item.name === itemName && item.size === selectedSize);
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
        showToast(`${itemName} ${selectedSize} (quantidade atualizada)!`, 'success');
    } else {
        cart.push({ name: itemName, size: selectedSize, price: price, quantity: 1 });
        showToast(`${itemName} ${selectedSize} adicionado ao carrinho!`, 'success');
    }

    debouncedUpdateCart();
    if (sizeButtons && selectedBtn) {
        sizeButtons.forEach(btn => btn.classList.remove('selected'));
        selectedBtn.classList.add('selected');
    }
}

function updateQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    debouncedUpdateCart();
}

function removeFromCart(index) {
    if (confirm('Tem certeza que deseja remover este item?')) {
        cart.splice(index, 1);
        debouncedUpdateCart();
        showToast('Item removido do carrinho!', 'success');
    }
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    cartItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-size">(${item.size})</span>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)" aria-label="Diminuir quantidade">−</button>
                    <span class="qty-display" aria-label="Quantidade atual">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)" aria-label="Aumentar quantidade">+</button>
                </div>
            </div>
            <div class="item-price">
                <span class="item-subtotal">R$ ${itemSubtotal.toFixed(2)}</span>
                <button class="remove-btn" onclick="removeFromCart(${index})" aria-label="Remover item">Remover</button>
            </div>
        `;
        cartItems.appendChild(div);
    });

    localStorage.setItem('cart', JSON.stringify(cart));

    const orderType = document.querySelector('input[name="order-type"]:checked').value;
    const deliveryFee = orderType === 'delivery' ? 8.00 : 0.00;
    const deliveryLine = document.getElementById('delivery-line');
    deliveryLine.style.display = orderType === 'delivery' ? 'flex' : 'none';

    const total = subtotal + deliveryFee;
    totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function toggleCart() {
    const cartEl = document.getElementById('cart');
    const overlay = document.getElementById('cart-overlay');
    const aside = document.getElementById('cart-aside');
    const isOpen = cartEl.classList.contains('open');
    cartEl.classList.toggle('open');
    overlay.classList.toggle('show');
    aside.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    document.querySelector('.hamburger').setAttribute('aria-expanded', !isOpen);
}

function checkout() {
    if (cart.length === 0) {
        showToast('Carrinho vazio!', 'error');
        return;
    }

    const orderType = document.querySelector('input[name="order-type"]:checked').value;
    const paymentType = document.querySelector('input[name="payment-type"]:checked').value;

    if (orderType === 'delivery') {
        const fields = ['customer-name', 'street', 'number', 'neighborhood'];
        const missing = fields.find(id => !document.getElementById(id).value.trim());
        if (missing) {
            showToast('Preencha todos os campos de endereço!', 'error');
            return;
        }
    }

    let message = 'Olá! Gostaria de pedir:\n';
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `- ${item.name} (${item.size || ''}) x${item.quantity} - R$ ${itemTotal.toFixed(2)}\n`;
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = orderType === 'delivery' ? 8.00 : 0.00;
    const total = subtotal + deliveryFee;
    message += `\nSubtotal: R$ ${subtotal.toFixed(2)}\n`;
    message += `Taxa de Entrega: R$ ${deliveryFee.toFixed(2)}\n`;
    message += `Total: R$ ${total.toFixed(2)}`;

    if (orderType === 'pickup') {
        message += `\n\nRetirada no endereço: Rua Marajó N: 908, Bairro: Lagoinha`;
    } else {
        const customerName = document.getElementById('customer-name').value;
        const street = document.getElementById('street').value;
        const number = document.getElementById('number').value;
        const neighborhood = document.getElementById('neighborhood').value;
        message += `\n\nEndereço para entrega:\nNome: ${customerName}\n${street}, ${number} - ${neighborhood}`;
    }

    let paymentText = '';
    if (paymentType === 'dinheiro') {
        paymentText = '\n\nMétodo de Pagamento: Dinheiro';
    } else if (paymentType === 'cartao') {
        paymentText = '\n\nMétodo de Pagamento: Cartão';
    } else if (paymentType === 'pix') {
        paymentText = '\n\nMétodo de Pagamento: Pix (Chave: 34999194464)';
    }
    message += paymentText;

    const whatsappUrl = `https://wa.me/553499194464?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    showToast('Pedido enviado! Verifique o WhatsApp.', 'success');
    cart = [];
    localStorage.removeItem('cart');
    updateCart();
    toggleCart();
}

// Funções para Menu Mobile
function toggleMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.querySelector('.hamburger');
    navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', navLinks.classList.contains('active'));
}

function closeMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.remove('active');
    document.querySelector('.hamburger').setAttribute('aria-expanded', 'false');
}

// Event Listeners (Event Delegation para performance)
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('size-btn')) {
        const sizeButtons = e.target.parentElement.querySelectorAll('.size-btn');
        sizeButtons.forEach(btn => btn.classList.remove('selected'));
        e.target.classList.add('selected');
    }
});

document.addEventListener('change', function(e) {
    if (e.target.name === 'order-type') {
        const addressInputs = document.querySelector('.address-inputs');
        const isDelivery = e.target.value === 'delivery';
        addressInputs.style.display = isDelivery ? 'block' : 'none';
        document.getElementById('delivery-line').style.display = isDelivery ? 'flex' : 'none';
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
        closeMobileMenu();
    });
});

// Inicializa o carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    updateCart();
});