document.addEventListener('DOMContentLoaded', function() {
    emailjs.init('h8YMRmYaX6_k4AK0U');
    
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

    const mainVideo = document.querySelector('.video-container video');
    if (mainVideo) {
        mainVideo.play().catch(err => console.log('Autoplay bloqueado:', err));
    }

    function showPage(pageNumber) {
        window.scrollTo(0, 0);
        document.querySelector('.main-content')?.scrollTo(0, 0);
        
        pages.forEach(page => page.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('selected'));

        const targetPage = document.getElementById(`page-${pageNumber}`);
        const targetNavItem = document.querySelector(`[data-page="${pageNumber}"]`)?.closest('.nav-item');

        if (targetPage) targetPage.classList.add('active');
        if (targetNavItem) targetNavItem.classList.add('selected');

        if (pageNumber === '1' && mainVideo) {
            mainVideo.currentTime = 0;
            mainVideo.play().catch(err => console.log('Play error:', err));
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageNumber = this.getAttribute('data-page');
            showPage(pageNumber);
        });
    });

    if (navbarBrand) {
        navbarBrand.addEventListener('click', function(e) {
            e.preventDefault();
            showPage('1');
        });
    }

    document.querySelectorAll('.image-block[data-participation]').forEach(block => {
        block.addEventListener('click', function() {
            const participationId = this.getAttribute('data-participation');
            
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById('page-4').classList.add('active');
            
            navItems.forEach(item => item.classList.remove('selected'));
            document.querySelector('[data-page="4"]')?.closest('.nav-item')?.classList.add('selected');
            
            setTimeout(() => {
                const element = document.getElementById(participationId);
                if (element) {
                    const elementTop = element.offsetTop;
                    window.scrollTo({ top: elementTop, behavior: 'smooth' });
                }
            }, 100);
        });
    });

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

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'ENVIANDO...';
            submitButton.disabled = true;
            
            const templateParams = {
                name: this.querySelector('input[name="name"]').value,
                email: this.querySelector('input[name="email"]').value,
                message: this.querySelector('textarea[name="message"]').value
            };
            
            emailjs.send('service_m71pnlh', 'template_q1k2rxf', templateParams)
                .then(() => {
                    alert('¡Mensaje enviado correctamente! Te responderé pronto.');
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.');
                })
                .finally(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });
        });
    }

    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        const loaderWrapper = document.getElementById('loader-wrapper');
        if (loaderWrapper) loaderWrapper.style.display = 'none';
    });

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
});