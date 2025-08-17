
var gallery = undefined;
var currentPage = 1;
var isTransitioning = false;
var autoSlideInterval = null;

// Cerrar menú móvil
function closeMenu() {
  $(".navbar-collapse").removeClass("show"); 
}

// Resaltar elemento del menú activo
function highlightMenu(no) {
  $(".navbar .navbar-nav > .nav-item").removeClass('selected');
  $(".navbar .navbar-nav > .nav-item > .nav-link[data-no='" + no + "']").parent().addClass('selected');
  
  // Animación suave del círculo
  $(".navbar .navbar-nav > .nav-item .circle").removeClass('active');
  $(".navbar .navbar-nav > .nav-item > .nav-link[data-no='" + no + "']").siblings('.circle').addClass('active');
}

// Configurar galería con mejores animaciones
function setupGallery() {
  gallery = $('.gallery-slider').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    fade: false,
    cssEase: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  });

  // Agregar efectos de hover mejorados
  $('.gallery-slider .item').hover(
    function() {
      $(this).find('img').css('transform', 'scale(1.1)');
    },
    function() {
      $(this).find('img').css('transform', 'scale(1)');
    }
  );
}

// Configurar carousel automático para la página principal
function setupHomeCarousel() {
  $('#carouselExample').carousel({
    interval: 4000,
    pause: 'hover'
  });
}

// Abrir página con animaciones mejoradas
function openPage(no) {
  if (isTransitioning) return;
  
  isTransitioning = true;
  currentPage = no;
  
  // Limpiar intervalos anteriores
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
  }

  // Animación de salida
  $('.cd-hero-slider li:visible').fadeOut(300, function() {
    
    // Configuraciones específicas por página
    switch(no) {
      case 1:
        setupHomeCarousel();
        break;
      case 2:
        if(gallery == undefined) {
          setupGallery();
        } else {
          $('.gallery-slider').slick('unslick');
          setupGallery();
        }
        break;
      case 3:
        // Animación para textos de poesía
        animateTextElements();
        break;
      case 4:
        // Configurar carousels de participaciones
        setupParticipationCarousels();
        break;
      case 5:
        // Configurar formulario de contacto
        setupContactForm();
        break;
    }
    
    // Animación de entrada
    $('.cd-hero-slider li[data-page-no="' + no + '"]')
      .fadeIn(500, function() {
        isTransitioning = false;
        
        // Añadir clase para animaciones CSS
        $(this).addClass('page-active');
        
        // Animaciones específicas después de cargar
        if (no === 1) {
          startPageAnimations();
        }
      });
  });
}

// Animaciones para elementos de texto
function animateTextElements() {
  $('.tm-bg-dark h3').each(function(index) {
    $(this).css({
      'opacity': '0',
      'transform': 'translateY(30px)'
    }).delay(index * 200).animate({
      'opacity': '1'
    }, 800).css('transform', 'translateY(0px)');
  });
}

// Configurar carousels de participaciones
function setupParticipationCarousels() {
  $('[id^="carouselExample"]').each(function() {
    $(this).carousel({
      interval: 5000,
      pause: 'hover'
    });
  });
}

// Configurar formulario de contacto con validación
function setupContactForm() {
  $('.contact-form input, .contact-form textarea').on('focus', function() {
    $(this).parent().addClass('focused');
  }).on('blur', function() {
    if ($(this).val() === '') {
      $(this).parent().removeClass('focused');
    }
  });

  // Validación del formulario
  $('.contact-form').on('submit', function(e) {
    e.preventDefault();
    
    var isValid = true;
    var formData = {};
    
    $(this).find('input, textarea').each(function() {
      var field = $(this);
      var value = field.val().trim();
      
      if (value === '') {
        field.addClass('error');
        isValid = false;
      } else {
        field.removeClass('error');
        formData[field.attr('name')] = value;
      }
    });
    
    if (isValid) {
      submitForm(formData);
    } else {
      showNotification('Por favor completa todos los campos', 'error');
    }
  });
}

// Enviar formulario
function submitForm(data) {
  // Mostrar loading
  $('.contact-form button[type="submit"]').addClass('loading').prop('disabled', true);
  
  $.ajax({
    url: 'contacto.php',
    method: 'POST',
    data: data,
    success: function(response) {
      showNotification('Mensaje enviado correctamente', 'success');
      $('.contact-form')[0].reset();
    },
    error: function() {
      showNotification('Error al enviar el mensaje', 'error');
    },
    complete: function() {
      $('.contact-form button[type="submit"]').removeClass('loading').prop('disabled', false);
    }
  });
}

// Mostrar notificaciones
function showNotification(message, type) {
  var notification = $('<div class="notification notification-' + type + '">' + message + '</div>');
  $('body').append(notification);
  
  setTimeout(function() {
    notification.addClass('show');
  }, 100);
  
  setTimeout(function() {
    notification.removeClass('show');
    setTimeout(function() {
      notification.remove();
    }, 300);
  }, 3000);
}

// Iniciar animaciones de la página principal
function startPageAnimations() {
  // Animación del título
  $('.navbar-brand').addClass('animate-title');
  
  // Animación de los elementos del carousel
  $('.carousel-item.active img').addClass('zoom-in');
  
  // Efecto parallax sutil en el video de fondo
  $(window).on('scroll', function() {
    var scroll = $(window).scrollTop();
    $('#bg-video').css('transform', 'translateY(' + scroll * 0.5 + 'px)');
  });
}

// Navegación con teclado
function setupKeyboardNavigation() {
  $(document).keydown(function(e) {
    if (!isTransitioning) {
      switch(e.which) {
        case 37: // Flecha izquierda
          if (currentPage > 1) {
            var prevPage = currentPage - 1;
            openPage(prevPage);
            highlightMenu(prevPage);
          }
          break;
        case 39: // Flecha derecha
          if (currentPage < 5) {
            var nextPage = currentPage + 1;
            openPage(nextPage);
            highlightMenu(nextPage);
          }
          break;
        case 27: // Escape
          closeMenu();
          break;
      }
    }
  });
}

// Smooth scroll para enlaces internos
function setupSmoothScroll() {
  $('a[href^="#"]').on('click', function(e) {
    e.preventDefault();
    var target = $(this.getAttribute('href'));
    if (target.length) {
      $('html, body').stop().animate({
        scrollTop: target.offset().top - 100
      }, 1000);
    }
  });
}

// Lazy loading para imágenes
function setupLazyLoading() {
  $('img[data-src]').each(function() {
    var img = $(this);
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          img.attr('src', img.data('src'));
          img.addClass('loaded');
          observer.unobserve(entry.target);
        }
      });
    });
    observer.observe(this);
  });
}

// Event listeners principales
$(window).on('load', function() {
  // Remover loader
  setTimeout(function() {
    $('body').addClass('loaded');
    openPage(1);
    highlightMenu(1);
  }, 1000);
  
  // Configuraciones iniciales
  setupKeyboardNavigation();
  setupSmoothScroll();
  setupLazyLoading();
});

$(document).ready(function() {
  // Enlaces de página
  $('.tm-page-link').on('click', function(e) {
    e.preventDefault();
    var pageNo = $(this).data('page-no');
    openPage(pageNo);
    highlightMenu(pageNo);
  });

  // Enlaces del menú
  $(".navbar .navbar-nav > .nav-item > a.nav-link").on('click', function(e) {
    e.preventDefault();
    var pageNo = $(this).data('no');
    
    openPage(pageNo);
    highlightMenu(pageNo);
    closeMenu();
  });

  // Cerrar menú al hacer clic fuera
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.navbar').length) {
      closeMenu();
    }
  });

  // Efecto hover en botones
  $('.btn').hover(
    function() {
      $(this).addClass('btn-hover');
    },
    function() {
      $(this).removeClass('btn-hover');
    }
  );

  // Mejorar carousel indicators
  $('.carousel-indicators button').on('click', function() {
    $(this).addClass('active-indicator');
  });
});

// Optimización para móviles
if ('ontouchstart' in window) {
  // Gestos táctiles para navegación
  var startX, startY;
  
  $(document).on('touchstart', function(e) {
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
  });
  
  $(document).on('touchend', function(e) {
    if (!startX || !startY) return;
    
    var endX = e.changedTouches[0].pageX;
    var endY = e.changedTouches[0].pageY;
    var diffX = startX - endX;
    var diffY = startY - endY;
    
    // Swipe horizontal
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 100) {
      if (diffX > 0 && currentPage < 5) {
        // Swipe left - siguiente página
        var nextPage = currentPage + 1;
        openPage(nextPage);
        highlightMenu(nextPage);
      } else if (diffX < 0 && currentPage > 1) {
        // Swipe right - página anterior
        var prevPage = currentPage - 1;
        openPage(prevPage);
        highlightMenu(prevPage);
      }
    }
    
    startX = startY = null;
  });
}