document.addEventListener('DOMContentLoaded', function() {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const navItems = document.querySelectorAll('.nav-item');
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const contactForm = document.getElementById('contact-form');
    const notification = document.getElementById('notification');

    function showPage(pageNumber) {
        pages.forEach(page => page.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('selected'));

        const targetPage = document.getElementById(`page-${pageNumber}`);
        const targetNavItem = document.querySelector(`[data-page="${pageNumber}"]`).closest('.nav-item');

        if (targetPage) {
            targetPage.classList.add('active');
        }
        if (targetNavItem) {
            targetNavItem.classList.add('selected');
        }

        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageNumber = this.getAttribute('data-page');
            showPage(pageNumber);
        });
    });

    document.querySelector('.tm-intro-btn').addEventListener('click', function(e) {
        e.preventDefault();
        const pageNumber = this.getAttribute('data-page');
        showPage(pageNumber);
    });

    mobileMenu.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
    });

    function initCarousel(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const inner = carousel.querySelector('.carousel-inner');
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        const indicators = carousel.querySelectorAll('.carousel-indicators button');
        
        let currentIndex = 0;

        function showSlide(index) {
            items.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });

            if (indicators.length > 0) {
                indicators.forEach((indicator, i) => {
                    indicator.classList.toggle('active', i === index);
                });
            }

            if (inner) {
                inner.style.transform = `translateX(-${index * 100}%)`;
            }
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % items.length;
            showSlide(currentIndex);
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            showSlide(currentIndex);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentIndex = index;
                showSlide(currentIndex);
            });
        });

        setInterval(nextSlide, 5000);
    }

    initCarousel('main-carousel');
    initCarousel('carousel-1');
    initCarousel('carousel-2');
    initCarousel('carousel-3');

    function showNotification(message, type = 'success') {
        notification.textContent = message;
        notification.className = `notification notification-${type}`;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
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

    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });

        input.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    });

    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        setTimeout(() => {
            const loaderWrapper = document.getElementById('loader-wrapper');
            if (loaderWrapper) {
                loaderWrapper.style.display = 'none';
            }
        }, 1500);
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

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

    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(12, 33, 216, 0.3)';
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            const currentPageElement = document.querySelector('.page.active');
            if (currentPageElement) {
                const currentPageId = currentPageElement.id;
                const currentPageNumber = parseInt(currentPageId.split('-')[1]);
                
                if (diff > 0 && currentPageNumber < 5) {
                    showPage(currentPageNumber + 1);
                } else if (diff < 0 && currentPageNumber > 1) {
                    showPage(currentPageNumber - 1);
                }
            }
        }
    }

    document.addEventListener('keydown', function(e) {
        const currentPageElement = document.querySelector('.page.active');
        if (currentPageElement) {
            const currentPageId = currentPageElement.id;
            const currentPageNumber = parseInt(currentPageId.split('-')[1]);
            
            if (e.key === 'ArrowRight' && currentPageNumber < 5) {
                showPage(currentPageNumber + 1);
            } else if (e.key === 'ArrowLeft' && currentPageNumber > 1) {
                showPage(currentPageNumber - 1);
            }
        }
    });
});