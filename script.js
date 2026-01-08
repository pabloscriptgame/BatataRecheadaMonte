let cart = JSON.parse(localStorage.getItem('cart')) || [];

const menuItems = [
    { name: "Strogonoff de Frango", img: "https://iili.io/fex19Jj.png", desc: "Batata Inglesa - Reijão cremoso - Mussarela - Cheiro verde - Batata Palha", sizes: [{ size: "500ml", price: 24.99 }] },
    { name: "Strogonoff de Carne", img: "https://iili.io/fexMe7s.png", desc: "Batata inglesa - Requeijão cremoso - Mussarela - Cheiro Verde", sizes: [{ size: "500ml", price: 29.99 }] }
];

document.addEventListener('DOMContentLoaded', () => {
    // Cabeçalho dinâmico
    document.getElementById('header-container').innerHTML = `
        <header id="header">
            <nav>
                <div class="logo">
                    <img src="https://iili.io/feojeTb.png" alt="Batata Recheada Monte" class="logo-img">
                </div>
                <button class="hamburger" aria-label="Abrir menu" onclick="toggleMenu()">
                    <span></span><span></span><span></span>
                </button>
                <ul class="nav-links" id="nav-links">
                    <li><a href="#hero" onclick="closeMenu()">Início</a></li>
                    <li><a href="#menu" onclick="closeMenu()">Cardápio</a></li>
                    <li><a href="#bebidas" onclick="closeMenu()">Bebidas</a></li>
                    <li><a href="#contact" onclick="closeMenu()">Contato</a></li>
                </ul>
            </nav>
        </header>
    `;

    setTimeout(() => document.getElementById('header').classList.add('visible'), 100);

    populateMenu();
    updateCart();
    setupSearch();
    setupPaymentToggle();
    updateDelivery(); // Inicializa estado inicial
});

function toggleMenu() {
    document.getElementById('nav-links').classList.toggle('active');
    document.querySelector('.hamburger').classList.toggle('active');
}

function closeMenu() {
    document.getElementById('nav-links').classList.remove('active');
    document.querySelector('.hamburger').classList.remove('active');
}

function populateMenu() {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = menuItems.map(item => `
        <article class="menu-item">
            <img src="${item.img}" alt="${item.name}" onclick="openModal(this.src)" loading="lazy">
            <h3>${item.name}</h3>
            <p>${item.desc}</p>
            <div class="size-options">
                ${item.sizes.map(s => `<button class="size-btn" onclick="selectSize(this)" data-price="${s.price}">${s.size} - R$${s.price}</button>`).join('')}
            </div>
            <button class="add-to-cart" onclick="addToCart('${item.name.replace(/'/g, "\\'")}', this)">Adicionar ao Carrinho</button>
        </article>
    `).join('');
}

function selectSize(btn) {
    btn.parentNode.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

function addToCart(name, button) {
    const sizeBtn = button.parentNode.querySelector('.size-btn.selected');
    if (!sizeBtn) return toast('Selecione o tamanho!');
    const size = sizeBtn.innerText.split(' - ')[0];
    const price = parseFloat(sizeBtn.dataset.price);
    const existing = cart.find(i => i.name === name && i.size === size);
    if (existing) existing.qty++; else cart.push({name, size, price, qty:1});
    updateCart();
    toast(`${name} (${size}) adicionado!`);
}

function addDrink(name, price) {
    const existing = cart.find(i => i.name === name);
    if (existing) existing.qty++; else cart.push({name, size:"Único", price, qty:1});
    updateCart();
    toast(`${name} adicionado!`);
}

function updateQuantity(i, delta) {
    cart[i].qty += delta;
    if (cart[i].qty <= 0) cart.splice(i, 1);
    updateCart();
}

function updateCart() {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;padding:3rem;font-size:1.1rem;">Seu carrinho está vazio</p>';
    } else {
        cart.forEach((item, i) => {
            total += item.price * item.qty;
            container.innerHTML += `
                <div class="cart-item">
                    <div>
                        <strong>${item.name}</strong> (${item.size})<br>
                        <small>R$ ${item.price.toFixed(2)} × ${item.qty} = R$ ${(item.price * item.qty).toFixed(2)}</small>
                    </div>
                    <div class="qty">
                        <button onclick="updateQuantity(${i},-1)">−</button>
                        <span>${item.qty}</span>
                        <button onclick="updateQuantity(${i},1)">+</button>
                    </div>
                </div>`;
        });
    }

    if (document.querySelector('input[value="delivery"]')?.checked) total += 8;

    document.getElementById('cart-total').textContent = `R$ ${total.toFixed(2)}`;
    document.getElementById('cart-count').textContent = cart.reduce((a,b) => a + b.qty, 0) || '';
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateDelivery() {
    const isDelivery = document.querySelector('input[value="delivery"]')?.checked;
    const addressFields = document.getElementById('address-fields');

    if (isDelivery) {
        addressFields.style.display = 'block';
        setTimeout(() => {
            addressFields.style.opacity = '1';
            addressFields.style.maxHeight = '600px';
        }, 10);
    } else {
        addressFields.style.opacity = '0';
        addressFields.style.maxHeight = '0';
        setTimeout(() => { addressFields.style.display = 'none'; }, 400);
    }

    document.querySelectorAll('.delivery-options label').forEach(l => {
        l.classList.toggle('active', l.querySelector('input').checked);
    });

    updateCart();
}

function setupPaymentToggle() {
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('.payment-options label').forEach(l => l.classList.remove('active'));
            radio.parentElement.classList.add('active');

            const trocoField = document.getElementById('troco-field');
            if (radio.value === 'dinheiro') {
                trocoField.style.display = 'block';
                setTimeout(() => trocoField.style.opacity = '1', 10);
            } else {
                trocoField.style.opacity = '0';
                setTimeout(() => trocoField.style.display = 'none', 400);
            }
        });
    });
}

function toggleCart() {
    const cartEl = document.getElementById('cart');
    const overlay = document.getElementById('cart-overlay');
    const body = document.body;

    cartEl.classList.toggle('open');
    overlay.classList.toggle('show');

    if (cartEl.classList.contains('open')) {
        const scrollY = window.scrollY;
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';
        body.style.overflow = 'hidden';
    } else {
        const scrollY = body.style.top;
        body.style.position = '';
        body.style.top = '';
        body.style.overflow = '';
        body.style.width = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
}

function setupSearch() {
    document.getElementById('menu-search').addEventListener('input', e => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.menu-item').forEach(item => {
            item.style.display = item.textContent.toLowerCase().includes(q) ? 'block' : 'none';
        });
    });
}

function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast show';
    t.textContent = msg;
    document.getElementById('toast-container').appendChild(t);
    setTimeout(() => t.classList.remove('show'), 3000);
    setTimeout(() => t.remove(), 3500);
}

function openModal(src) {
    document.getElementById('modal-image').src = src;
    document.getElementById('image-modal').classList.add('show');
}

function closeModal() {
    document.getElementById('image-modal').classList.remove('show');
    document.getElementById('modal-image').src = '';
}

function copyPix() {
    const chavePix = "34 99919-4464";
    navigator.clipboard.writeText(chavePix);
    toast("Chave PIX copiada: " + chavePix);
    const btn = document.querySelector(".copy-pix-btn");
    const original = btn.textContent;
    btn.textContent = "Copiado!";
    btn.style.background = "#27ae60";
    btn.style.color = "white";
    setTimeout(() => {
        btn.textContent = original;
        btn.style.background = "";
        btn.style.color = "";
    }, 2000);
}

function checkout() {
    if (cart.length === 0) return toast('Carrinho vazio!');

    let msg = "Pedido Batata Recheada Monte:\n\n", total = 0;
    cart.forEach(i => {
        msg += `• ${i.name} (${i.size}) × ${i.qty} = R$ ${(i.price*i.qty).toFixed(2)}\n`;
        total += i.price * i.qty;
    });

    const delivery = document.querySelector('input[value="delivery"]')?.checked;
    if (delivery) total += 8;

    msg += `\nTotal: R$ ${total.toFixed(2)}`;

    if (delivery) {
        const nome = document.getElementById('customer-name').value.trim();
        const rua = document.getElementById('street').value.trim();
        const num = document.getElementById('number').value.trim();
        const bairro = document.getElementById('neighborhood').value.trim();
        if (!nome || !rua || !num || !bairro) return toast('Preencha todos os campos do endereço!');
        msg += `\n\nEntrega (+R$8):\n${nome}\n${rua}, ${num} - ${bairro}, Monte Carmelo-MG`;
    } else {
        msg += "\n\nRetirada no local";
    }

    const payment = document.querySelector('input[name="payment"]:checked').value;
    msg += `\n\nPagamento: ${payment === 'dinheiro' ? 'Dinheiro' : payment === 'cartao' ? 'Cartão' : 'PIX'}`;
    
    const troco = document.getElementById('troco-value').value.trim();
    if (troco) msg += ` (Troco para R$ ${troco})`;

    msg += "\n\nObrigado pelo pedido! 🥔❤️";

    location.href = `https://wa.me/553499194464?text=${encodeURIComponent(msg)}`;

    cart = [];
    localStorage.removeItem('cart');
    updateCart();
    toggleCart();
    toast('Pedido enviado com sucesso!');
}

function shareSite() {
    if (navigator.share) {
        navigator.share({ title: 'Batata Recheada Monte', url: location.href });
    } else {
        navigator.clipboard.writeText(location.href);
        toast('Link copiado para compartilhar!');
    }

}


