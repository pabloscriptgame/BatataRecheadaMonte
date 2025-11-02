let cart = JSON.parse(localStorage.getItem('cart')) || [];

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

function copyPix() {
    const pixKey = '34999194464';
    navigator.clipboard.writeText(pixKey).then(() => {
        showToast('Chave PIX copiada!', 'success');
    }).catch(() => {
        showToast('Erro ao copiar chave PIX.', 'error');
    });
}

function addToCart(itemName, button, fixedPrice = null) {
    const sizeButtons = button ? button.parentElement.querySelectorAll('.size-btn') : null;
    let selectedSize = 'Padrão'; // Default para itens sem tamanho
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

    // Verifica se o item já existe no carrinho (mesmo nome e tamanho)
    const existingItemIndex = cart.findIndex(item => item.name === itemName && item.size === selectedSize);
    if (existingItemIndex !== -1) {
        // Incrementa a quantidade
        cart[existingItemIndex].quantity += 1;
        showToast(`${itemName} ${selectedSize} (quantidade atualizada)!`, 'success');
    } else {
        // Adiciona novo item com quantidade 1
        cart.push({ name: itemName, size: selectedSize, price: price, quantity: 1 });
        showToast(`${itemName} ${selectedSize} adicionado ao carrinho!`, 'success');
    }

    updateCart();
    if (sizeButtons) {
        sizeButtons.forEach(btn => btn.classList.remove('selected'));
        selectedBtn.classList.add('selected');
    }
}

function updateQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1); // Remove se quantidade for 0 ou negativa
    }
    updateCart();
}

function removeFromCart(index) {
    if (confirm('Tem certeza que deseja remover este item?')) {
        cart.splice(index, 1);
        updateCart();
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
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <div class="item-price">
                <span class="item-subtotal">R$ ${itemSubtotal.toFixed(2)}</span>
                <button class="remove-btn" onclick="removeFromCart(${index})">Remover</button>
            </div>
        `;
        cartItems.appendChild(div);
    });

    // Salva no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

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
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function toggleCart() {
    const cartEl = document.getElementById('cart');
    const overlay = document.getElementById('cart-overlay');
    cartEl.classList.toggle('open');
    overlay.classList.toggle('show');
}

function checkout() {
    if (cart.length === 0) {
        showToast('Carrinho vazio!', 'error');
        return;
    }

    const orderType = document.querySelector('input[name="order-type"]:checked').value;
    const paymentType = document.querySelector('input[name="payment-type"]:checked').value;

    if (orderType === 'delivery') {
        const customerName = document.getElementById('customer-name').value.trim();
        const street = document.getElementById('street').value.trim();
        const number = document.getElementById('number').value.trim();
        const neighborhood = document.getElementById('neighborhood').value.trim();
        if (!customerName || !street || !number || !neighborhood) {
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
    cart = []; // Limpa carrinho após envio
    localStorage.removeItem('cart'); // Remove do localStorage
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
        const addressInputs = document.querySelector('.address-inputs');
        if (e.target.value === 'delivery') {
            addressInputs.style.display = 'block';
            document.getElementById('delivery-line').style.display = 'flex';
        } else {
            addressInputs.style.display = 'none';
            document.getElementById('delivery-line').style.display = 'none';
        }
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

// Fechar carrinho ao clicar no overlay
document.getElementById('cart-overlay').addEventListener('click', toggleCart);

// Inicializa o carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    updateCart();
});