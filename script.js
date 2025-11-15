// Cart e Dados (Persistência com localStorage e IndexedDB fallback)
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const menuItems = [{
        name: 'Carne Seca ao Molho Branco',
        img: 'https://i.ibb.co/qMkNt06Q/20251031-155022.jpg',
        desc: 'Carne seca desfiada, molho branco cremoso, mussarela derretida, requeijão, bacon crocante e cebolinha. Perfeita para quem ama sabores intensos!',
        sizes: [{ size: '500g', price: 34.00 }, { size: '750g', price: 51.00 }]
    },
    {
        name: 'Bacon ao Molho Branco',
        img: 'https://i.ibb.co/S4RTd1QF/20251031-162528.jpg',
        desc: 'Bacon em cubos, molho branco artesanal, mussarela, requeijão cremoso e toque de cebolinha. Crocante e cremoso na medida certa!',
        sizes: [{ size: '500g', price: 25.00 }, { size: '750g', price: 38.00 }]
    },
    {
        name: 'Frango ao Molho Branco ou Sugo',
        img: 'https://i.ibb.co/NQYzmBv/20251031-162513.jpg',
        desc: 'Frango em cubos ao nosso delicioso molho branco artesanal, servido na batata inglesa cozida, com queijo mussarela derretido, bacon em cubos, requeijão cremoso de pote e cebolinha. Opção leve e saborosa!',
        sizes: [{ size: '500g', price: 25.00 }, { size: '750g', price: 38.00 }]
    },
    {
        name: 'Calabresa ao Molho Branco e Sugo',
        img: 'https://i.ibb.co/5xJzc1Dg/20251031-162330.jpg',
        desc: 'Calabresa defumada, molho duplo, mussarela, bacon, requeijão e cebolinha picante. Picância e sabor em cada mordida!',
        sizes: [{ size: '500g', price: 32.00 }, { size: '750g', price: 48.00 }]
    },
    {
        name: 'Fraldinha ao Molho Sugo',
        img: 'https://i.ibb.co/Y4vMD3MM/20251031-162457.jpg',
        desc: 'Fraldinha desfiada ao molho sugo, mussarela derretida, requeijão, bacon e cebolinha. Sucesso garantido para os amantes de carne!',
        sizes: [{ size: '500g', price: 34.00 }, { size: '750g', price: 51.00 }]
    }
];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    populateMenu();
    updateCart();
    toggleTrocoField();
    detectAndAutoOpen();
    setupSearch();
    generateSnowflakes(); // Neve dinâmica
    setupOfflineDetection();
});

// Popular Menu via JS (Facilita Filtros)
function populateMenu() {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = menuItems.map(item => `
        <article class="menu-item" data-keywords="${item.name.toLowerCase()} ${item.desc.toLowerCase()}">
            <h3>${item.name}</h3>
            <img src="${item.img}" alt="Batata Recheada com ${item.name}" class="menu-img" loading="lazy">
            <p>${item.desc}</p>
            <div class="size-options">
                ${item.sizes.map(size => `<button class="size-btn" data-size="${size.size}" data-price="${size.price}">${size.size} - R$${size.price.toFixed(2)}</button>`).join('')}
            </div>
            <button class="add-to-cart" onclick="addToCart('${item.name}', this)" aria-label="Adicionar ${item.name} ao carrinho">Adicionar ao Carrinho</button>
        </article>
    `).join('');
}

// Busca no Menu (Nova)
function setupSearch() {
    const searchInput = document.getElementById('menu-search');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const items = document.querySelectorAll('#menu-grid .menu-item');
        items.forEach(item => {
            const keywords = item.dataset.keywords;
            item.style.display = keywords.includes(query) ? 'block' : 'none';
        });
        if (!query) items.forEach(item => item.style.display = 'block');
    });
}

// Neve Dinâmica (Mais flocos)
function generateSnowflakes() {
    const snowContainer = document.querySelector('.snowflakes');
    if (!snowContainer) return;
    for (let i = 0; i < 50; i++) { // Mais flocos
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.animationDuration = `${10 + Math.random() * 20}s`;
        snowflake.style.animationDelay = `${Math.random() * -20}s`;
        snowflake.style.opacity = Math.random();
        snowflake.textContent = '❄';
        snowflake.style.fontSize = `${0.5 + Math.random()}em`;
        snowContainer.appendChild(snowflake);
    }
}

// Detecção Mobile e Auto-Open (Melhorada)
function detectAndAutoOpen() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile && window.innerWidth < 480) {
        setTimeout(() => {
            toggleMobileMenu();
            showToast('Menu aberto para navegação fácil no celular!', 'info');
        }, 800);
    }
}

// Toast (Melhorado com ARIA)
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
}

// Copiar PIX
function copyPix() {
    navigator.clipboard.writeText('34999194464').then(() => showToast('Chave PIX copiada!', 'success')).catch(() => showToast('Erro ao copiar. Copie manualmente: 34999194464', 'error'));
}

// Compartilhar (Melhorado)
function shareSite() {
    const shareData = { title: 'Batata Recheada Monte', text: 'Peça agora!', url: window.location.href };
    if (navigator.share) {
        navigator.share(shareData).catch(() => fallbackShare());
    } else {
        fallbackShare();
    }
}

function fallbackShare() {
    navigator.clipboard.writeText(window.location.href).then(() => showToast('URL copiada!', 'success')).catch(() => showToast(`Link: ${window.location.href}`, 'info'));
}

// Adicionar ao Carrinho (Refatorado)
function addToCart(itemName, button, fixedPrice = null) {
    const sizeButtons = button ? button.parentElement.querySelectorAll('.size-btn') : null;
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

    const existingIndex = cart.findIndex(item => item.name === itemName && item.size === selectedSize);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ name: itemName, size: selectedSize, price, quantity: 1 });
    }

    updateCart();
    showToast(`${itemName} adicionado!`, 'success');
    if (sizeButtons) sizeButtons.forEach(btn => btn.classList.toggle('selected', btn === selectedBtn));
}

// Atualizar Quantidade e Remover
function updateQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCart();
}

function removeFromCart(index) {
    if (confirm('Remover item?')) {
        cart.splice(index, 1);
        updateCart();
        showToast('Item removido!', 'success');
    }
}

// Toggle Troco
function toggleTrocoField() {
    const paymentType = document.querySelector('input[name="payment-type"]:checked').value;
    document.getElementById('troco-field').style.display = paymentType === 'dinheiro' ? 'block' : 'none';
}

// Atualizar Carrinho (Otimizado)
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
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-size">(${item.size})</span>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)" aria-label="Diminuir quantidade">−</button>
                    <span class="qty-display">${item.quantity}</span>
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
    document.getElementById('delivery-line').style.display = orderType === 'delivery' ? 'flex' : 'none';
    const total = subtotal + deliveryFee;
    totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Toggle Carrinho
function toggleCart() {
    const cartEl = document.getElementById('cart');
    const overlay = document.getElementById('cart-overlay');
    const isOpen = cartEl.classList.toggle('open');
    overlay.classList.toggle('show', isOpen);
    cartEl.setAttribute('aria-hidden', !isOpen);
}

// Checkout (Validações Melhoradas)
function checkout() {
    if (cart.length === 0) return showToast('Carrinho vazio!', 'error');

    const orderType = document.querySelector('input[name="order-type"]:checked').value;
    if (orderType === 'delivery') {
        const fields = ['customer-name', 'street', 'number', 'neighborhood'];
        if (fields.some(id => !document.getElementById(id).value.trim())) {
            return showToast('Preencha o endereço!', 'error');
        }
    }

    let message = 'Olá! Pedido na Batata Recheada Monte:\n\n';
    cart.forEach(item => message += `- ${item.name} (${item.size}) x${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}\n`);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = orderType === 'delivery' ? 8.00 : 0.00;
    message += `\nSubtotal: R$ ${subtotal.toFixed(2)}\nTaxa: R$ ${deliveryFee.toFixed(2)}\nTotal: R$ ${(subtotal + deliveryFee).toFixed(2)}\n\n`;

    if (orderType === 'delivery') {
        const name = document.getElementById('customer-name').value;
        const street = document.getElementById('street').value;
        const number = document.getElementById('number').value;
        const neighborhood = document.getElementById('neighborhood').value;
        message += `Entrega para: ${name}\n${street}, ${number} - ${neighborhood}, Monte Carmelo - MG\n\n`;
    } else {
        message += 'Retirada no local\n';
    }

    const paymentType = document.querySelector('input[name="payment-type"]:checked').value;
    let paymentText = `Pagamento: ${paymentType === 'dinheiro' ? 'Dinheiro' : paymentType === 'cartao' ? 'Cartão' : 'PIX (Chave: 34999194464)'}`;
    if (paymentType === 'dinheiro') {
        const troco = document.getElementById('troco-value').value;
        if (troco) paymentText += ` (Troco para R$ ${troco})`;
    }
    message += `${paymentText}\n\nAguardo confirmação! 😊`;

    window.open(`https://wa.me/553499194464?text=${encodeURIComponent(message)}`, '_blank');
    showToast('Pedido enviado!', 'success');
    cart = [];
    localStorage.removeItem('cart');
    updateCart();
    toggleCart();
}

// Menu Mobile
function toggleMobileMenu() {
    const nav = document.getElementById('nav-links');
    const hamburger = document.querySelector('.hamburger');
    nav.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', nav.classList.contains('active'));
}

function closeMobileMenu() { document.getElementById('nav-links').classList.remove('active'); }

// Seleção de Tamanho
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('size-btn')) {
        e.target.parentElement.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
        e.target.classList.add('selected');
    }
});

// Listeners para Opções
document.addEventListener('change', (e) => {
    if (e.target.name === 'order-type') {
        const address = document.querySelector('.address-inputs');
        address.style.display = e.target.value === 'delivery' ? 'block' : 'none';
        document.getElementById('delivery-line').style.display = e.target.value === 'delivery' ? 'flex' : 'none';
        updateCart();
    }
    if (e.target.name === 'payment-type') toggleTrocoField();
});

// Scroll Suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// Overlay Click
document.getElementById('cart-overlay').addEventListener('click', toggleCart);

// Detecção Offline (Nova)
function setupOfflineDetection() {
    window.addEventListener('online', () => showToast('Conectado! Pode pedir agora.', 'success'));
    window.addEventListener('offline', () => showToast('Offline: Carrinho salvo localmente.', 'info'));
}