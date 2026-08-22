const state = { categories: [], visibleItems: [], carouselIndex: 0 };
const elements = { starfield: document.getElementById('starfield'), filters: document.getElementById('filter-tabs'), sections: document.getElementById('portfolio-sections'), modal: document.getElementById('carouselModal'), image: document.getElementById('carouselImage'), title: document.getElementById('carouselTitle'), desc: document.getElementById('carouselDesc') };

function createStarfield(count = 42) {
    if (!elements.starfield) return;
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < count; index += 1) {
        const star = document.createElement('i');
        star.className = `star ${['small', 'medium', 'large'][Math.floor(Math.random() * 3)]}`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 4}s`;
        fragment.appendChild(star);
    }
    elements.starfield.appendChild(fragment);
}

function makeFilter(label, value, active = false) {
    const button = document.createElement('button');
    button.className = 'filter-tab'; button.type = 'button'; button.dataset.category = value;
    button.setAttribute('role', 'tab'); button.setAttribute('aria-selected', String(active)); button.textContent = label;
    button.addEventListener('click', () => renderPortfolio(value));
    return button;
}

function renderFilters() {
    elements.filters.appendChild(makeFilter('Todo', 'all', true));
    state.categories.forEach(category => elements.filters.appendChild(makeFilter(category.title, category.id)));
}

function createCard(item, index) {
    const card = document.createElement('article'); card.className = 'gallery-card';
    const button = document.createElement('button'); button.type = 'button'; button.className = 'gallery-card-button';
    button.setAttribute('aria-label', `Ver ${item.title}`);
    const image = document.createElement('img'); image.src = item.image; image.alt = item.title; image.loading = 'lazy';
    const content = document.createElement('span'); content.className = 'gallery-card-content';
    const title = document.createElement('strong'); title.textContent = item.title;
    const description = document.createElement('span'); description.textContent = item.description || '';
    content.append(title, description); button.append(image, content); button.addEventListener('click', () => openCarousel(index)); card.appendChild(button);
    return card;
}

function renderPortfolio(filter = 'all') {
    elements.sections.replaceChildren();
    document.querySelectorAll('.filter-tab').forEach(button => { const active = button.dataset.category === filter; button.classList.toggle('active', active); button.setAttribute('aria-selected', String(active)); });
    const categories = filter === 'all' ? state.categories : state.categories.filter(category => category.id === filter);
    state.visibleItems = categories.flatMap(category => category.items);
    categories.forEach(category => {
        const section = document.createElement('div'); section.className = 'portfolio-group';
        const heading = document.createElement('div'); heading.className = 'group-heading';
        const eyebrow = document.createElement('p'); eyebrow.className = 'kicker'; eyebrow.textContent = category.eyebrow;
        const title = document.createElement('h3'); title.textContent = category.title;
        const description = document.createElement('p'); description.textContent = category.description;
        heading.append(eyebrow, title, description);
        const grid = document.createElement('div'); grid.className = 'gallery-container';
        category.items.forEach(item => grid.appendChild(createCard(item, state.visibleItems.indexOf(item))));
        section.append(heading, grid); elements.sections.appendChild(section);
    });
}

function updateCarousel() {
    const item = state.visibleItems[state.carouselIndex]; if (!item) return;
    elements.image.src = item.image; elements.image.alt = item.title; elements.title.textContent = item.title; elements.desc.textContent = item.description || '';
}

function openCarousel(index) {
    state.carouselIndex = index; updateCarousel(); elements.modal.classList.add('active'); elements.modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open'); document.getElementById('carouselClose').focus();
}

function closeCarousel() { elements.modal.classList.remove('active'); elements.modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open'); }

function moveCarousel(step) {
    if (!state.visibleItems.length) return;
    state.carouselIndex = (state.carouselIndex + step + state.visibleItems.length) % state.visibleItems.length; updateCarousel();
}

async function loadPortfolio() {
    try {
        const response = await fetch('gallery.json'); if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json(); state.categories = data.categories || []; renderFilters(); renderPortfolio();
    } catch (error) {
        elements.sections.innerHTML = '<p class="loading">No se pudo cargar el catalogo. Abre la pagina desde un servidor local.</p>'; console.error('No se pudo cargar gallery.json:', error);
    }
}

document.getElementById('carouselClose').addEventListener('click', closeCarousel);
document.getElementById('carouselPrev').addEventListener('click', () => moveCarousel(-1));
document.getElementById('carouselNext').addEventListener('click', () => moveCarousel(1));
elements.modal.addEventListener('click', event => { if (event.target === elements.modal) closeCarousel(); });
document.addEventListener('keydown', event => {
    if (!elements.modal.classList.contains('active')) return;
    if (event.key === 'Escape') closeCarousel(); if (event.key === 'ArrowLeft') moveCarousel(-1); if (event.key === 'ArrowRight') moveCarousel(1);
});
createStarfield(); loadPortfolio();

const siteHeader = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 40);
}, { passive: true });