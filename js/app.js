const whatsappNumber = '244953245071';
document.documentElement.classList.add('js');
const products = [
  { id: 1, name: 'Garrafa térmica', price: 6500, category: 'Casa', description: 'Prática para acompanhar o seu dia a dia.', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85', featured: true, available: true },
  { id: 2, name: 'Conjunto de 3', price: 20000, category: 'Cozinha', description: 'Uma seleção simples para a rotina da sua casa.', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1000&q=85', featured: false, available: true }
];
const faqs = [
  ['Como faço uma encomenda?', 'Escolha um produto e fale connosco pelo WhatsApp. Tratamos do resto consigo.'],
  ['Quais são as formas de pagamento?', 'Aceitamos TPA, transferência, cash e Express.'],
  ['Fazem entregas?', 'Fale connosco pelo WhatsApp para saber mais.'],
  ['Quanto custa a entrega?', 'O valor da entrega é combinado diretamente consigo.'],
  ['Como posso acompanhar o meu pedido?', 'A nossa equipa acompanha consigo diretamente pelo WhatsApp.'],
  ['Posso falar diretamente pelo WhatsApp?', 'Sim. Estamos à distância de uma mensagem.']
];
const formatPrice = price => `${new Intl.NumberFormat('pt-AO').format(price)} Kz`;
const productMessage = product => `Olá KoiZinhas! Tenho interesse no produto ${product.name} que vi no site por ${formatPrice(product.price)}. Gostaria de saber como posso comprar.`;
const whatsappLink = product => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(productMessage(product))}`;
const productById = id => products.find(product => product.id === Number(id));
const trackEvent = (eventType, product = {}) => {
  const events = JSON.parse(localStorage.getItem('koi_events') || '[]');
  events.push({ event: eventType, product: product.name || '', price: product.price || '', source: document.referrer || 'direct', createdAt: new Date().toISOString() });
  localStorage.setItem('koi_events', JSON.stringify(events.slice(-100)));
};

function renderCategories() {
  const container = document.querySelector('#categories');
  if (!container) return;
  const categories = ['Todos', ...new Set(products.map(product => product.category))];
  container.innerHTML = categories.map((category, index) => `<button class="category-button ${index === 0 ? 'active' : ''}" type="button" data-category="${category}">${category}</button>`).join('');
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-category]').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    renderProducts(button.dataset.category);
  }));
}
function productCard(product) {
  return `<article class="product-card reveal"><a class="product-image" href="produto.html?id=${product.id}" data-product-view="${product.id}"><img src="${product.image}" alt="${product.name}" loading="lazy"><span class="image-action">Ver produto <b>↗</b></span></a><div class="product-meta"><div><h3>${product.name}</h3><p>${product.description}</p></div><strong>${formatPrice(product.price)}</strong></div><p class="availability">${product.available ? 'Disponível' : 'Esgotado'}</p><div class="product-actions">${product.available ? `<a class="buy-button" data-whatsapp-product="${product.id}" href="${whatsappLink(product)}" target="_blank" rel="noopener">Comprar pelo WhatsApp <span>↗</span></a>` : ''}<a class="details-button" href="produto.html?id=${product.id}">Ver detalhes</a></div></article>`;
}
function renderProducts(category = 'Todos') {
  const container = document.querySelector('#product-grid');
  if (!container) return;
  const filtered = category === 'Todos' ? products : products.filter(product => product.category === category);
  container.innerHTML = filtered.length ? filtered.map(productCard).join('') : `<div class="empty-category"><p class="eyebrow">Em breve</p><h2>Estamos a preparar esta seleção.</h2><p>Ainda não existem produtos publicados nesta categoria. Fale connosco pelo WhatsApp para saber o que está disponível.</p><a class="buy-button" href="https://wa.me/${whatsappNumber}" target="_blank" rel="noopener">Falar pelo WhatsApp</a></div>`;
  bindProductEvents(container);
}
function bindProductEvents(container = document) {
  container.querySelectorAll('[data-product-view]').forEach(link => link.addEventListener('click', () => trackEvent('product_view', productById(link.dataset.productView))));
    container.querySelectorAll('[data-whatsapp-product]').forEach(link => link.addEventListener('click', () => trackEvent('whatsapp_click', productById(link.dataset.whatsappProduct))));
  observeReveals(container);
}
function renderFeature() {
  const container = document.querySelector('#destaque');
  if (!container) return;
  const product = products.find(item => item.featured);
  container.innerHTML = `<div class="feature-wrap"><img src="${product.image}" alt="${product.name}" loading="lazy"><div class="feature-copy"><p class="eyebrow">Em destaque</p><h2>${product.name}</h2><p>${product.description}</p><strong>${formatPrice(product.price)}</strong><a class="buy-button" href="${whatsappLink(product)}" target="_blank" rel="noopener">Comprar pelo WhatsApp</a></div></div>`;
}
function renderFaq() {
  const container = document.querySelector('#faq-list');
  if (!container) return;
  container.innerHTML = faqs.map(([question, answer]) => `<div class="faq-item"><button class="faq-question" type="button">${question}<span>+</span></button><div class="faq-answer">${answer}</div></div>`).join('');
  container.querySelectorAll('.faq-question').forEach(button => button.addEventListener('click', () => { const item = button.parentElement; item.classList.toggle('open'); button.querySelector('span').textContent = item.classList.contains('open') ? '−' : '+'; }));
}
function openDetails(product) {
  trackEvent('product_view', product);
  document.querySelector('#dialog-content').innerHTML = `<div class="dialog-product"><img src="${product.image}" alt="${product.name}"><div class="dialog-copy"><p class="eyebrow">${product.category}</p><h2>${product.name}</h2><p>${product.description}</p><strong>${formatPrice(product.price)}</strong><p class="availability">${product.available ? 'Disponível' : 'Esgotado'}</p>${product.available ? `<a class="buy-button" href="${whatsappLink(product)}" target="_blank" rel="noopener">Comprar pelo WhatsApp</a>` : ''}</div></div>`;
  document.querySelector('#product-dialog').showModal();
}
function renderProductPage() {
  const container = document.querySelector('#product-page');
  if (!container) return;
  const product = productById(new URLSearchParams(window.location.search).get('id')) || products[0];
  trackEvent('product_view', product);
  document.title = `${product.name} | KoiZinhas de Angola`;
  const galleryImages = [product.image, product.secondaryImage].filter(Boolean);
  container.innerHTML = `<div class="product-detail"><div class="product-gallery reveal is-visible"><div class="gallery-main"><img id="gallery-image" src="${galleryImages[0]}" alt="${product.name}"></div><div class="gallery-thumbs">${galleryImages.map((image, index) => `<button class="gallery-thumb ${index === 0 ? 'active' : ''}" type="button" data-image="${image}"><img src="${image}" alt="Ver ${product.name}, imagem ${index + 1}"></button>`).join('')}</div></div><div class="product-information reveal is-visible"><p class="eyebrow">${product.category}</p><h1>${product.name}</h1><p class="product-detail-price">${formatPrice(product.price)}</p><p class="product-detail-description">${product.description}</p><p class="availability">${product.available ? 'Disponível' : 'Esgotado'}</p>${product.available ? `<a class="button dark product-buy" data-whatsapp-product="${product.id}" href="${whatsappLink(product)}" target="_blank" rel="noopener">Comprar pelo WhatsApp <span>↗</span></a>` : '<p class="unavailable-message">Fale connosco para saber mais sobre este produto.</p>'}<div class="product-note"><span>Compra simples</span><span>Pagamento por WhatsApp</span></div></div></div><section class="section product-aftercare"><p class="eyebrow">Da KoiZinhas para si</p><h2>Pequenos detalhes para o dia a dia.</h2><a class="underlined-link" href="produtos.html">Continuar a explorar <span>↗</span></a></section>`;
  container.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => { container.querySelector('#gallery-image').src = button.dataset.image; container.querySelectorAll('.gallery-thumb').forEach(item => item.classList.remove('active')); button.classList.add('active'); }));
  container.querySelectorAll('[data-whatsapp-product]').forEach(link => link.addEventListener('click', () => trackEvent('whatsapp_click', product)));
}

function observeReveals(scope = document) {
  const elements = scope.querySelectorAll('.reveal:not(.is-visible)');
  if (!('IntersectionObserver' in window)) { elements.forEach(element => element.classList.add('is-visible')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.12 });
  elements.forEach(element => observer.observe(element));
}
function setupPageMotion() {
  document.querySelectorAll('main > section, .hero-copy, .hero-image, .category-tile, .feature-wrap').forEach(element => element.classList.add('reveal'));
  document.querySelectorAll('a[href$=".html"], a[href="index.html"]').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || link.target === '_blank' || link.origin !== window.location.origin) return;
    event.preventDefault(); document.body.classList.add('page-leaving'); window.setTimeout(() => { window.location.href = link.href; }, 140);
  }));
  observeReveals();
  const header = document.querySelector('.site-header');
  if (header) window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 18), { passive: true });
}

const requestedCategory = new URLSearchParams(window.location.search).get('category');
renderCategories();
renderProducts(requestedCategory && products.some(product => product.category === requestedCategory) ? requestedCategory : 'Todos');
if (requestedCategory) {
  document.querySelectorAll('[data-category]').forEach(button => button.classList.toggle('active', button.dataset.category === requestedCategory));
}
renderFeature();
renderFaq();
renderProductPage();
setupPageMotion();
const dialog = document.querySelector('#product-dialog');
if (dialog) document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
const menuButton = document.querySelector('.menu-button');
if (menuButton) menuButton.addEventListener('click', event => { const isOpen = event.currentTarget.getAttribute('aria-expanded') === 'true'; event.currentTarget.setAttribute('aria-expanded', String(!isOpen)); document.querySelector('.main-nav').classList.toggle('open', !isOpen); document.body.classList.toggle('menu-open', !isOpen); });
document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => { document.querySelector('.main-nav')?.classList.remove('open'); document.body.classList.remove('menu-open'); menuButton?.setAttribute('aria-expanded', 'false'); }));
document.querySelectorAll('a[href*="wa.me"]:not([data-whatsapp-product])').forEach(link => link.addEventListener('click', () => trackEvent('whatsapp_click')));
