document.addEventListener('DOMContentLoaded', function() {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const navItems = document.querySelectorAll('.nav-item');
    const contactForm = document.getElementById('contact-form');
    const notification = document.getElementById('notification');

    function showPage(pageNumber) {
        pages.forEach(page => page.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('selected'));

        const targetPage = document.getElementById(`page-${pageNumber}`);
        const targetNavItem = document.querySelector(`[data-page="${pageNumber}"]`)?.closest('.nav-item');

        if (targetPage) targetPage.classList.add('active');
        if (targetNavItem) targetNavItem.classList.add('selected');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageNumber = this.getAttribute('data-page');
            showPage(pageNumber);
        });
    });

    document.querySelectorAll('.tm-intro-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const pageNumber = this.getAttribute('data-page');
            showPage(pageNumber);
        });
    });

    function initCarousel(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        const indicators = carousel.querySelectorAll('.carousel-indicators button');
        let currentIndex = 0;

        function showSlide(index) {
            items.forEach((item, i) => item.classList.toggle('active', i === index));
            indicators.forEach((indicator, i) => indicator.classList.toggle('active', i === index));
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % items.length;
            showSlide(currentIndex);
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            showSlide(currentIndex);
        }

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentIndex = index;
                showSlide(currentIndex);
            });
        });

        setInterval(nextSlide, 5000);
    }

    // Inicializar todos los carouseles
    ['main-carousel','carousel-1','carousel-2','carousel-3'].forEach(id => initCarousel(id));

    function showNotification(message, type = 'success') {
        if (!notification) return;
        notification.textContent = message;
        notification.className = `notification notification-${type} show`;
        setTimeout(() => notification.classList.remove('show'), 3000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            if (!name || !email || !message) {
                showNotification('Por favor completa todos los campos', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Por favor ingresa un email válido', 'error');
                return;
            }

            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'ENVIANDO...';
            btn.disabled = true;

            setTimeout(() => {
                showNotification('¡Mensaje enviado con éxito!', 'success');
                this.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1000);
        });
    }

    // Inputs focus / blur
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('blur', function() {
            this.classList.toggle('error', this.value.trim() === '');
        });
        input.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    });

    // Loader fadeout
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        const loaderWrapper = document.getElementById('loader-wrapper');
        if (loaderWrapper) loaderWrapper.style.display = 'none';
    });

    // Animaciones de entrada
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

    // Botones hover
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 5px 15px rgba(12, 33, 216, 0.3)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = 'none';
        });
    });

    // Swipe para móviles
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', e => touchStartY = e.changedTouches[0].screenY);
    document.addEventListener('touchend', e => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        const currentPageElement = document.querySelector('.page.active');
        if (!currentPageElement) return;

        const currentPageNumber = parseInt(currentPageElement.id.split('-')[1]);
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) showPage(Math.min(currentPageNumber + 1, pages.length));
            else showPage(Math.max(currentPageNumber - 1, 1));
        }
    }
    document.addEventListener('keydown', e => {
        const currentPageElement = document.querySelector('.page.active');
        if (!currentPageElement) return;

        const currentPageNumber = parseInt(currentPageElement.id.split('-')[1]);
        if (e.key === 'ArrowRight') showPage(Math.min(currentPageNumber + 1, pages.length));
        if (e.key === 'ArrowLeft') showPage(Math.max(currentPageNumber - 1, 1));
    });
});
