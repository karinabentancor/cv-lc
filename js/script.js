document.addEventListener('DOMContentLoaded', function() {

    // ── EmailJS ──────────────────────────────────────────────────────────────
    if (typeof emailjs !== 'undefined') {
        emailjs.init('h8YMRmYaX6_k4AK0U');
    }

    // ── Loader ───────────────────────────────────────────────────────────────
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        const loaderWrapper = document.getElementById('loader-wrapper');
        if (loaderWrapper) loaderWrapper.style.display = 'none';
    });

    // ── Nav: marcar página activa según URL ──────────────────────────────────
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (
            href === currentPage ||
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')
        ) {
            link.closest('.nav-item')?.classList.add('selected');
        }
    });

    // ── Video autoplay ───────────────────────────────────────────────────────
    const mainVideo = document.querySelector('.video-container video');
    if (mainVideo) {
        mainVideo.play().catch(err => console.log('Autoplay bloqueado:', err));
    }

    // ── Modal de visuales ────────────────────────────────────────────────────
    const modal = document.getElementById('visual-modal');
    const modalImg = document.getElementById('visual-modal-img');
    const modalTitle = document.getElementById('visual-modal-title');
    const modalDesc = document.getElementById('visual-modal-desc');
    const modalYear = document.getElementById('visual-modal-year');
    const closeModal = document.querySelector('.visual-modal-close');

    document.querySelectorAll('.effect-julia').forEach(figure => {
        figure.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.getAttribute('data-visual-title');
            const desc = this.getAttribute('data-visual-desc');
            const year = this.getAttribute('data-visual-year');

            if (modal && modalImg) {
                modalImg.src = img.src;
                modalTitle.textContent = title;
                modalDesc.textContent = desc;
                modalYear.textContent = year;
                modal.style.display = 'flex';
            }
        });
    });

    closeModal?.addEventListener('click', () => { modal.style.display = 'none'; });
    modal?.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal?.style.display === 'flex') modal.style.display = 'none';
    });

    // ── Índice de poemas: scroll suave ───────────────────────────────────────
    document.querySelectorAll('.poem-index a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const element = document.getElementById(targetId);
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ── Scroll a participación desde anchor en URL ───────────────────────────
    if (window.location.hash) {
        setTimeout(() => {
            const el = document.getElementById(window.location.hash.substring(1));
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    // ── Formulario de contacto ───────────────────────────────────────────────
    const contactForm = document.getElementById('contact-form');
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
                .catch(error => {
                    console.error('Error:', error);
                    alert('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.');
                })
                .finally(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });
        });
    }

    // ── Animación de entrada en galería ──────────────────────────────────────
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.effect-julia').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ── Hover en botones ─────────────────────────────────────────────────────
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