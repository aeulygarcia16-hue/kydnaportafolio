const modal = document.getElementById('carouselModal');
const carouselImage = document.getElementById('carouselImage');
const carouselTitle = document.getElementById('carouselTitle');
const carouselDesc = document.getElementById('carouselDesc');

let carouselData = [];
let carouselIndex = 0;

function abrirPestaña(evt, nombrePestaña) {
    document.querySelectorAll('.contenido-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-boton').forEach(btn => btn.classList.remove('active'));
    document.getElementById(nombrePestaña)?.classList.add('active');
    evt.currentTarget.classList.add('active');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

function initCarousel() {
    carouselData = Array.from(document.querySelectorAll('.gallery-card')).map(card => {
        const img = card.querySelector('img');
        return {
            src: img?.src || '',
            alt: img?.alt || '',
            title: card.querySelector('.gallery-card__head')?.textContent || '',
            desc: card.querySelector('.gallery-card__desc')?.textContent || '',
        };
    });
}

function openCarousel(index) {
    if (!carouselData.length) return;
    carouselIndex = ((index % carouselData.length) + carouselData.length) % carouselData.length;
    updateCarousel();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCarousel() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function updateCarousel() {
    const item = carouselData[carouselIndex];
    if (!item) return;
    carouselImage.src = item.src;
    carouselImage.alt = item.alt;
    carouselTitle.textContent = item.title;
    carouselDesc.textContent = item.desc;
}

function prevCarousel() {
    carouselIndex = (carouselIndex - 1 + carouselData.length) % carouselData.length;
    updateCarousel();
}

function nextCarousel() {
    carouselIndex = (carouselIndex + 1) % carouselData.length;
    updateCarousel();
}

function toggleSection(button) {
    const content = button.closest('.section-wrapper')?.querySelector('.section-content');
    const collapsed = button.classList.toggle('collapsed');
    content?.classList.toggle('collapsed', collapsed);
    button.setAttribute('aria-expanded', String(!collapsed));
}

window.addEventListener('keydown', event => {
    if (!modal.classList.contains('active')) return;
    if (event.key === 'ArrowLeft') prevCarousel();
    else if (event.key === 'ArrowRight') nextCarousel();
    else if (event.key === 'Escape') closeCarousel();
});

function createStarfield(count = 50) {
    const starfield = document.getElementById('starfield');
    const width = window.innerWidth;
    const height = window.innerHeight;
    const sizes = ['small', 'medium', 'large'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star ' + sizes[Math.floor(Math.random() * sizes.length)];
        star.style.left = `${Math.random() * width}px`;
        star.style.top = `${Math.random() * height}px`;
        star.style.animationDelay = `${Math.random() * 4}s`;
        frag.appendChild(star);
    }
    starfield.appendChild(frag);
}

window.addEventListener('load', () => {
    createStarfield();
    initCarousel();
});

