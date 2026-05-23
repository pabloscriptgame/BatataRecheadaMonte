// ===== PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const colors = ['rgba(255,215,0,0.6)','rgba(255,140,0,0.5)','rgba(255,80,0,0.4)'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      left:${Math.random()*100}%;
      animation-duration:${Math.random()*15+8}s;
      animation-delay:-${Math.random()*15}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

// ===== MODALS =====
function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}
function closeModalOut(e, id) {
  if (e.target === document.getElementById(id)) closeModal(id);
}
function switchModal(from, to) {
  closeModal(from);
  setTimeout(() => openModal(to), 150);
}

// ===== FAKE AUTH =====
function fakeLogin() {
  closeModal('loginModal');
  showToast('Welcome back! 🐯 Loading your account...');
}
function fakeRegister() {
  const terms = document.querySelector('#registerModal input[type="checkbox"]');
  if (!terms.checked) { showToast('⚠️ Please accept the Terms & Conditions', 'warn'); return; }
  closeModal('registerModal');
  setTimeout(() => openModal('successModal'), 300);
}

// ===== TOAST =====
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.style.cssText = `
    position:fixed;top:90px;right:24px;z-index:99999;
    background:${type==='warn'?'#332200':'#003322'};
    border:1px solid ${type==='warn'?'#FF8C00':'#00C851'};
    color:${type==='warn'?'#FFD700':'#00FF88'};
    padding:14px 20px;border-radius:10px;font-family:Rajdhani,sans-serif;
    font-size:.95rem;font-weight:700;
    box-shadow:0 8px 32px rgba(0,0,0,.4);
    animation:slideIn .3s ease;max-width:300px;line-height:1.4;
  `;
  t.textContent = msg;
  const style = document.createElement('style');
  style.textContent = '@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}';
  document.head.appendChild(style);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(c => {
    const target = parseInt(c.dataset.target);
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(eased * target);
      c.textContent = val >= 1000000 ? (val/1000000).toFixed(1)+'M' :
                      val >= 1000 ? (val/1000).toFixed(0)+'K' : val;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounters(); observer.disconnect(); } });
}, { threshold: 0.3 });
const statsEl = document.querySelector('.stats-section');
if (statsEl) observer.observe(statsEl);

// ===== COOKIE BANNER =====
function acceptCookies() {
  document.getElementById('cookieBanner').style.display = 'none';
  localStorage.setItem('cookiesAccepted', '1');
}
if (localStorage.getItem('cookiesAccepted')) {
  const cb = document.getElementById('cookieBanner');
  if (cb) cb.style.display = 'none';
}

// ===== LIVE CHAT =====
function toggleChat() {
  const box = document.getElementById('chatBox');
  box.classList.toggle('active');
  const badge = document.querySelector('.chat-badge');
  if (badge) badge.style.display = 'none';
}

const chatResponses = [
  "I'm happy to help! Could you provide more details? 😊",
  "Great question! Our support team will assist you shortly.",
  "Your account is fully secure. Feel free to ask anything!",
  "We process withdrawals in 1-24 hours depending on method.",
  "Our Welcome Bonus is 200% up to $5,000. Would you like help claiming it?",
  "You can contact us via live chat 24/7. We're always here!",
  "Fortune Tiger is fully licensed and regulated. Play safe! 🐯"
];

function sendChatMsg() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  const msgs = document.getElementById('chatMessages');
  const userDiv = document.createElement('div');
  userDiv.className = 'chat-msg user';
  userDiv.textContent = msg;
  msgs.appendChild(userDiv);
  input.value = '';
  msgs.scrollTop = msgs.scrollHeight;
  setTimeout(() => {
    const agentDiv = document.createElement('div');
    agentDiv.className = 'chat-msg agent';
    agentDiv.textContent = chatResponses[Math.floor(Math.random()*chatResponses.length)];
    msgs.appendChild(agentDiv);
    msgs.scrollTop = msgs.scrollHeight;
  }, 1000);
}

// ===== HAMBURGER =====
document.getElementById('hamburger')?.addEventListener('click', () => {
  const nav = document.querySelector('.nav');
  if (nav.style.display === 'flex') {
    nav.style.display = '';
  } else {
    nav.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:70px;left:0;right:0;background:rgba(10,10,15,.98);padding:20px;gap:8px;z-index:999;border-bottom:1px solid rgba(255,215,0,.15);';
  }
});

// ===== SCROLL HEADER =====
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (header) header.style.boxShadow = window.scrollY > 50 ? '0 4px 30px rgba(0,0,0,.5)' : '';
});

// ===== RANDOM WIN POPUPS =====
const winners = [
  { name: 'John W.', amount: '$12,450', game: 'Fortune Tiger' },
  { name: 'Maria S.', amount: '$3,200', game: 'Dragon\'s Gold' },
  { name: 'Carlos R.', amount: '$8,750', game: 'Diamond Fever' },
  { name: 'Anna K.', amount: '$21,000', game: 'Fortune Tiger' },
  { name: 'David M.', amount: '$5,600', game: 'Lucky Clover' },
  { name: 'Sophie L.', amount: '$14,300', game: 'Fortune Tiger' },
];
let winIdx = 0;
function showWinPopup() {
  const w = winners[winIdx % winners.length];
  winIdx++;
  const popup = document.createElement('div');
  popup.style.cssText = `
    position:fixed;bottom:${window.innerWidth<=768?'90px':'30px'};left:20px;z-index:7000;
    background:linear-gradient(135deg,#1A1A28,#22223A);
    border:1px solid rgba(255,215,0,.3);border-radius:12px;
    padding:14px 18px;display:flex;align-items:center;gap:12px;
    box-shadow:0 8px 32px rgba(0,0,0,.4);
    animation:slideInLeft .4s ease;max-width:260px;
  `;
  const style = document.createElement('style');
  style.textContent = '@keyframes slideInLeft{from{transform:translateX(-120%);opacity:0}to{transform:translateX(0);opacity:1}}';
  document.head.appendChild(style);
  popup.innerHTML = `
    <div style="font-size:2rem;">🏆</div>
    <div>
      <div style="font-size:.8rem;color:#a0a0c0;font-family:Rajdhani,sans-serif;">Just won!</div>
      <div style="font-size:.95rem;font-weight:700;font-family:Rajdhani,sans-serif;color:#fff;">${w.name} won <span style="color:#FFD700;">${w.amount}</span></div>
      <div style="font-size:.78rem;color:#a0a0c0;font-family:Rajdhani,sans-serif;">${w.game}</div>
    </div>
  `;
  document.body.appendChild(popup);
  setTimeout(() => { popup.style.animation = 'slideInLeft .4s ease reverse'; setTimeout(()=>popup.remove(), 400); }, 3500);
}
setTimeout(() => { showWinPopup(); setInterval(showWinPopup, 8000); }, 3000);
