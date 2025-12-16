document.addEventListener('DOMContentLoaded', function() {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const navItems = document.querySelectorAll('.nav-item');
    const navbarBrand = document.querySelector('.navbar-brand');
    const contactForm = document.getElementById('contact-form');
    const notification = document.getElementById('notification');
    const modal = document.getElementById('visual-modal');
    const modalImg = document.getElementById('visual-modal-img');
    const modalTitle = document.getElementById('visual-modal-title');
    const modalDesc = document.getElementById('visual-modal-desc');
    const modalYear = document.getElementById('visual-modal-year');
    const closeModal = document.querySelector('.visual-modal-close');

    // Inicializar video con autoplay y loop
    const mainVideo = document.querySelector('.video-container video');
    if (mainVideo) {
        mainVideo.play().catch(err => console.log('Autoplay bloqueado:', err));
    }

    // FUNCIÓN PARA MOSTRAR PÁGINAS - Siempre vuelve arriba
    function showPage(pageNumber) {
        // Scroll arriba SIEMPRE
        window.scrollTo(0, 0);
        document.querySelector('.main-content')?.scrollTo(0, 0);
        
        pages.forEach(page => page.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('selected'));

        const targetPage = document.getElementById(`page-${pageNumber}`);
        const targetNavItem = document.querySelector(`[data-page="${pageNumber}"]`)?.closest('.nav-item');

        if (targetPage) targetPage.classList.add('active');
        if (targetNavItem) targetNavItem.classList.add('selected');

        // Reiniciar video cuando vuelves a page-1
        if (pageNumber === '1' && mainVideo) {
            mainVideo.currentTime = 0;
            mainVideo.play().catch(err => console.log('Play error:', err));
        }
    }

    // NAVEGACIÓN - Links normales
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageNumber = this.getAttribute('data-page');
            showPage(pageNumber);
        });
    });

    // NAVEGACIÓN - Logo (vuelve a página 1)
    if (navbarBrand) {
        navbarBrand.addEventListener('click', function(e) {
            e.preventDefault();
            showPage('1');
        });
    }

    // CLICKS EN IMÁGENES DEL HOME - Van a participaciones específicas
    document.querySelectorAll('.image-block[data-participation]').forEach(block => {
        block.addEventListener('click', function() {
            const participationId = this.getAttribute('data-participation');
            
            // Cambiar a página 4
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById('page-4').classList.add('active');
            
            navItems.forEach(item => item.classList.remove('selected'));
            document.querySelector('[data-page="4"]')?.closest('.nav-item')?.classList.add('selected');
            
            // Scroll directo al elemento SIN mostrar lo de arriba
            setTimeout(() => {
                const element = document.getElementById(participationId);
                if (element) {
                    const elementTop = element.offsetTop;
                    window.scrollTo({ top: elementTop, behavior: 'smooth' });
                }
            }, 100);
        });
    });

    // ÍNDICE DE POEMAS - Scroll suave
    document.querySelectorAll('.poem-index a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const element = document.getElementById(targetId);
            
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // MODAL DE VISUALES
    document.querySelectorAll('.effect-julia').forEach(figure => {
        figure.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.getAttribute('data-visual-title');
            const desc = this.getAttribute('data-visual-desc');
            const year = this.getAttribute('data-visual-year');
            
            modalImg.src = img.src;
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalYear.textContent = year;
            modal.style.display = 'flex';
        });
    });

    closeModal?.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    modal?.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal?.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });

    // FORMULARIO DE CONTACTO
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Mensaje enviado correctamente');
            this.reset();
        });
    }

    // LOADER
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        const loaderWrapper = document.getElementById('loader-wrapper');
        if (loaderWrapper) loaderWrapper.style.display = 'none';
    });

    // INTERSECTION OBSERVER para animaciones
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.effect-julia, .tm-bg-dark').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // HOVER EN BOTONES
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 5px 15px rgba(255, 255, 255, 0.3)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = 'none';
        });
    });

    // NAVEGACIÓN TÁCTIL (swipe)
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', e => touchStartY = e.changedTouches[0].screenY);
    document.addEventListener('touchend', e => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const currentPageElement = document.querySelector('.page.active');
        if (!currentPageElement) return;

        const currentPageNumber = parseInt(currentPageElement.id.split('-')[1]);
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) showPage(Math.min(currentPageNumber + 1, pages.length));
            else showPage(Math.max(currentPageNumber - 1, 1));
        }
    }

    // NAVEGACIÓN CON TECLADO
    document.addEventListener('keydown', e => {
        const currentPageElement = document.querySelector('.page.active');
        if (!currentPageElement) return;

        const currentPageNumber = parseInt(currentPageElement.id.split('-')[1]);
        if (e.key === 'ArrowRight') showPage(Math.min(currentPageNumber + 1, pages.length));
        if (e.key === 'ArrowLeft') showPage(Math.max(currentPageNumber - 1, 1));
    });
});