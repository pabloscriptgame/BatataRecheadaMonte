let cart = JSON.parse(localStorage.getItem('cart')) || [];

const menuItems = [
    { name: "Carne Seca ao Molho Branco", img: "https://i.ibb.co/zWNRtmBC/CARNE-SECA-AO-MOLHO-BRANCO.jpg", desc: "Carne seca, molho branco, mussarela, requeijão, bacon", sizes: [{ size: "500g", price: 34 }, { size: "750g", price: 51 }] },
    { name: "Bacon ao Molho Branco", img: "https://i.ibb.co/GZT04vx/BACON-AO-MOLHO-BRANCO-feito.jpg", desc: "Bacon crocante, molho branco, mussarela, requeijão", sizes: [{ size: "500g", price: 25 }, { size: "750g", price: 38 }] },
    { name: "Frango ao Molho Branco", img: "https://i.ibb.co/kgx7KNq5/FRANGO-AO-MOLHO-BRANCO-OU-AO-MOLHO-SUGO.jpg", desc: "Frango, molho branco, mussarela, bacon, requeijão", sizes: [{ size: "500g", price: 25 }, { size: "750g", price: 38 }] },
    { name: "Calabresa ao Molho Duplo", img: "https://i.ibb.co/nsg4VmXz/CALABRESA-AO-MOLHO-BRANCO-E-MOLHO-SUGO.jpg", desc: "Calabresa, molho branco + sugo, bacon, requeijão", sizes: [{ size: "500g", price: 32 }, { size: "750g", price: 48 }] },
    { name: "Fraldinha ao Molho Sugo", img: "https://i.ibb.co/jvkx0bzy/FRALDINHA-AO-MOLHO-SUGO.jpg", desc: "Fraldinha desfiada, molho sugo, mussarela, bacon", sizes: [{ size: "500g", price: 34 }, { size: "750g", price: 51 }] }
];

document.addEventListener('DOMContentLoaded', () => {
    populateMenu();
    updateCart();
    setupSearch();
    setupPaymentToggle();
});

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
            <button class="add-to-cart" onclick="addToCart('${item.name}', this)">Adicionar ao Carrinho</button>
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
    container.innerHTML = cart.length === 0 ? '' : '';
    let total = 0;
    cart.forEach((item, i) => {
        total += item.price * item.qty;
        container.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong> (${item.size})<br>
                    <small>R$ ${item.price.toFixed(2)} × ${item.qty}</small>
                </div>
                <div class="qty">
                    <button onclick="updateQuantity(${i},-1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="updateQuantity(${i},1)">+</button>
                </div>
            </div>`;
    });

    const delivery = document.querySelector('input[value="delivery"]')?.checked;
    if (delivery) total += 8;

    document.getElementById('cart-total').textContent = `R$ ${total.toFixed(2)}`;
    document.getElementById('cart-count').textContent = cart.reduce((a,b)=>a+b.qty,0) || '';
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateDelivery() {
    const isDelivery = document.querySelector('input[value="delivery"]')?.checked;
    document.getElementById('address-fields').style.display = isDelivery ? 'block' : 'none';
    document.querySelectorAll('.delivery-options label').forEach(l => l.classList.toggle('active', l.querySelector('input').checked));
    updateCart();
}

function setupPaymentToggle() {
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('.payment-options label').forEach(l => l.classList.remove('active'));
            radio.parentElement.classList.add('active');
            document.getElementById('troco-field').style.display = radio.value === 'dinheiro' ? 'block' : 'none';
        });
    });
}

function toggleCart() {
    document.getElementById('cart').classList.toggle('open');
    document.getElementById('cart-overlay').classList.toggle('show');
    document.body.style.overflow = document.getElementById('cart').classList.contains('open') ? 'hidden' : '';
}

function toggleMenu() { document.getElementById('nav-links').classList.toggle('active'); }
function closeMenu() { document.getElementById('nav-links').classList.remove('active'); }

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
        if (!nome || !rua || !num || !bairro) return toast('Preencha o endereço!');
        msg += `\n\nEntrega (+R$8):\n${nome}\n${rua}, ${num} - ${bairro}, Monte Carmelo-MG`;
    } else {
        msg += "\n\nRetirada no local";
    }

    const payment = document.querySelector('input[name="payment"]:checked').value;
    msg += `\n\nPagamento: ${payment === 'dinheiro' ? 'Dinheiro' : payment === 'cartao' ? 'Cartão' : 'PIX'}`;
    
    const troco = document.getElementById('troco-value').value;
    if (troco) msg += ` (Troco para R$ ${troco})`;

    msg += "\n\nObrigado!";

    location.href = `https://wa.me/553499194464?text=${encodeURIComponent(msg)}`;
    cart = []; localStorage.removeItem('cart'); updateCart(); toggleCart();
    toast('Pedido enviado com sucesso!');
}