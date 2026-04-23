/**
 * LUXXE EYEWEAR — Main JavaScript
 * Features: Navbar scroll, smooth scroll, product filter,
 * modal population, form validation, animations, wishlist
 */

$(document).ready(function () {

  /* ============================================================
     1. NAVBAR — Scroll Behaviour
  ============================================================ */
  const $nav = $('#mainNav');

  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 50) {
      $nav.addClass('scrolled');
    } else {
      $nav.removeClass('scrolled');
    }
  });

  // Active nav link highlight based on scroll position
  $(window).on('scroll', function () {
    let scrollPos = $(this).scrollTop() + 100;
    $('section[id]').each(function () {
      let sectionTop    = $(this).offset().top;
      let sectionBottom = sectionTop + $(this).outerHeight();
      let sectionId     = $(this).attr('id');

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        $('.luxxe-link').removeClass('active');
        $(`.luxxe-link[href="#${sectionId}"]`).addClass('active');
      }
    });
  });


  /* ============================================================
     2. SMOOTH SCROLLING — All anchor links
  ============================================================ */
  $('a[href^="#"]').on('click', function (e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      const offset = $nav.outerHeight() + 10;
      $('html, body').animate({
        scrollTop: target.offset().top - offset
      }, 700, 'swing');
      // Close mobile menu if open
      $('#navMenu').collapse('hide');
    }
  });


  /* ============================================================
     3. BACK TO TOP BUTTON
  ============================================================ */
  const $backTop = $('#backToTop');

  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 400) {
      $backTop.addClass('show');
    } else {
      $backTop.removeClass('show');
    }
  });

  $backTop.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });


  /* ============================================================
     4. SCROLL-TRIGGERED ANIMATIONS (Intersection Observer)
  ============================================================ */
  const animElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el    = entry.target;
          const delay = parseInt(el.getAttribute('data-delay')) || 0;
          setTimeout(() => el.classList.add('animated'), delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12 });

    animElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: just show all
    animElements.forEach(el => el.classList.add('animated'));
  }


  /* ============================================================
     5. PRODUCT FILTER TABS
  ============================================================ */
  $('.filter-btn').on('click', function () {
    const filter = $(this).data('filter');

    // Update active state
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    if (filter === 'all') {
      // Show all with staggered animation
      $('.product-item').each(function (i) {
        const $item = $(this);
        setTimeout(function () {
          $item.removeClass('hidden');
          $item.css('opacity', 0).animate({ opacity: 1 }, 350);
        }, i * 60);
      });
    } else {
      // Hide non-matching
      $('.product-item').each(function () {
        const $item    = $(this);
        const category = $item.data('category');

        if (category === filter) {
          $item.removeClass('hidden');
          $item.css('opacity', 0).animate({ opacity: 1 }, 350);
        } else {
          $item.addClass('hidden');
        }
      });
    }
  });


  /* ============================================================
     6. PRODUCT MODAL — Dynamic Data Population
  ============================================================ */
  $('#productModal').on('show.bs.modal', function (e) {
    const trigger = $(e.relatedTarget);

    const img   = trigger.data('img');
    const name  = trigger.data('name');
    const price = trigger.data('price');
    const desc  = trigger.data('desc');

    // Populate modal fields
    $('#modalImg').attr('src', img).attr('alt', name);
    $('#modalName').text(name);
    $('#modalPrice').text(price);
    $('#modalDesc').text(desc);
  });


  /* ============================================================
     7. WISHLIST TOGGLE (Heart Button)
  ============================================================ */
  // Product card wishlist buttons
  $(document).on('click', '.wishlist-btn', function () {
    const $btn  = $(this);
    const $icon = $btn.find('i');

    $btn.toggleClass('active');

    if ($btn.hasClass('active')) {
      $icon.removeClass('far').addClass('fas');
      showToast('Added to wishlist ♥');
    } else {
      $icon.removeClass('fas').addClass('far');
      showToast('Removed from wishlist');
    }
  });

  // Modal wishlist button
  $(document).on('click', '.wishlist-modal-btn', function () {
    const $btn = $(this);
    $btn.toggleClass('active');

    if ($btn.hasClass('active')) {
      $btn.html('<i class="fas fa-heart me-2" style="color:#e53935"></i> Saved to Wishlist');
      showToast('Added to wishlist ♥');
    } else {
      $btn.html('<i class="far fa-heart me-2"></i> Add to Wishlist');
    }
  });


  /* ============================================================
     8. CONTACT FORM VALIDATION (jQuery + Vanilla)
  ============================================================ */
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();
    let valid = true;

    // Clear previous states
    clearFormErrors();

    // --- Name Validation ---
    const name = $.trim($('#contactName').val());
    if (!name) {
      setError('#contactName', '#nameError', 'Please enter your full name.');
      valid = false;
    } else if (name.length < 2) {
      setError('#contactName', '#nameError', 'Name must be at least 2 characters.');
      valid = false;
    } else {
      setValid('#contactName');
    }

    // --- Email Validation ---
    const email     = $.trim($('#contactEmail').val());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('#contactEmail', '#emailError', 'Please enter your email address.');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setError('#contactEmail', '#emailError', 'Please enter a valid email (e.g. name@email.com).');
      valid = false;
    } else {
      setValid('#contactEmail');
    }

    // --- Phone Validation (optional but must be numbers if provided) ---
    const phone     = $.trim($('#contactPhone').val());
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,20}$/;
    if (phone && !phoneRegex.test(phone)) {
      setError('#contactPhone', '#phoneError', 'Phone must contain numbers only (7–20 digits).');
      valid = false;
    } else if (phone) {
      setValid('#contactPhone');
    }

    // --- Message Validation ---
    const message = $.trim($('#contactMsg').val());
    if (!message) {
      setError('#contactMsg', '#msgError', 'Please enter your message.');
      valid = false;
    } else if (message.length < 10) {
      setError('#contactMsg', '#msgError', 'Message must be at least 10 characters.');
      valid = false;
    } else {
      setValid('#contactMsg');
    }

    // --- Submit if valid ---
    if (valid) {
      const $btn = $('.contact-submit');
      $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i> Sending...');

      // Simulate API call
      setTimeout(function () {
        $('#contactForm')[0].reset();
        clearFormErrors();
        $btn.prop('disabled', false).html('<span class="submit-text">Send Message</span><i class="fas fa-arrow-right ms-2"></i>');
        $('#formSuccess').fadeIn(400);

        // Hide success after 5s
        setTimeout(function () {
          $('#formSuccess').fadeOut(400);
        }, 5000);
      }, 1500);
    }
  });

  // Real-time validation feedback on blur
  $('#contactName').on('blur', function () {
    const val = $.trim($(this).val());
    if (!val) {
      setError('#contactName', '#nameError', 'Name is required.');
    } else if (val.length < 2) {
      setError('#contactName', '#nameError', 'Name must be at least 2 characters.');
    } else {
      setValid('#contactName');
      $('#nameError').text('');
    }
  });

  $('#contactEmail').on('blur', function () {
    const val = $.trim($(this).val());
    const re  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      setError('#contactEmail', '#emailError', 'Email is required.');
    } else if (!re.test(val)) {
      setError('#contactEmail', '#emailError', 'Enter a valid email address.');
    } else {
      setValid('#contactEmail');
      $('#emailError').text('');
    }
  });

  $('#contactPhone').on('input', function () {
    // Only allow: digits, spaces, +, -, (, )
    const cleaned = $(this).val().replace(/[^0-9\s\+\-\(\)]/g, '');
    $(this).val(cleaned);
  });

  $('#contactMsg').on('blur', function () {
    const val = $.trim($(this).val());
    if (!val) {
      setError('#contactMsg', '#msgError', 'Message is required.');
    } else if (val.length < 10) {
      setError('#contactMsg', '#msgError', 'Message too short (min 10 characters).');
    } else {
      setValid('#contactMsg');
      $('#msgError').text('');
    }
  });

  /**
   * Set field error state
   * @param {string} fieldSel - jQuery selector for input
   * @param {string} errSel   - jQuery selector for error message div
   * @param {string} msg      - Error message text
   */
  function setError(fieldSel, errSel, msg) {
    $(fieldSel).removeClass('is-valid').addClass('is-error');
    $(errSel).text(msg);
  }

  /**
   * Set field valid state
   * @param {string} fieldSel - jQuery selector for input
   */
  function setValid(fieldSel) {
    $(fieldSel).removeClass('is-error').addClass('is-valid');
  }

  /**
   * Clear all form error states
   */
  function clearFormErrors() {
    $('.luxxe-input').removeClass('is-error is-valid');
    $('.error-msg').text('');
  }


  /* ============================================================
     9. NEWSLETTER SUBSCRIPTION
  ============================================================ */
  $('#newsletterBtn').on('click', function () {
    const email   = $.trim($('#newsletterEmail').val());
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const $btn    = $(this);
    const $input  = $('#newsletterEmail');

    if (!email || !emailRe.test(email)) {
      $input.css({ borderColor: '#e53935' });
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    $input.css({ borderColor: '' });
    $btn.prop('disabled', true).text('Subscribing...');

    // Simulate subscription
    setTimeout(function () {
      $btn.prop('disabled', false).text('Subscribed ✓');
      $btn.css({ background: '#43a047' });
      $input.val('');
      showToast('Welcome to the LUXXE Inner Circle!');

      setTimeout(function () {
        $btn.text('Subscribe').css({ background: '' });
      }, 3000);
    }, 1200);
  });

  // Subscribe on Enter key
  $('#newsletterEmail').on('keypress', function (e) {
    if (e.which === 13) $('#newsletterBtn').click();
  });


  /* ============================================================
     10. TOAST NOTIFICATION HELPER
  ============================================================ */
  /**
   * Show a toast notification
   * @param {string} msg   - Message to display
   * @param {string} type  - 'success' | 'error' (default: 'success')
   */
  function showToast(msg, type) {
    // Remove existing toast
    $('.luxxe-toast').remove();

    const bgColor = (type === 'error') ? '#e53935' : '#1a1a1a';
    const $toast  = $(`
      <div class="luxxe-toast" role="alert" style="
        position: fixed;
        bottom: 28px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: ${bgColor};
        color: #fff;
        padding: 12px 24px;
        font-family: 'Jost', sans-serif;
        font-size: 0.82rem;
        font-weight: 400;
        letter-spacing: 0.06em;
        border-radius: 2px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s ease;
        white-space: nowrap;
      ">${msg}</div>
    `);

    $('body').append($toast);

    // Animate in
    setTimeout(function () {
      $toast.css({ opacity: 1, transform: 'translateX(-50%) translateY(0)' });
    }, 10);

    // Animate out
    setTimeout(function () {
      $toast.css({ opacity: 0, transform: 'translateX(-50%) translateY(20px)' });
      setTimeout(function () { $toast.remove(); }, 350);
    }, 2800);
  }


  /* ============================================================
     11. HERO SECTION — Parallax (subtle)
  ============================================================ */
  $(window).on('scroll', function () {
    const scrolled = $(this).scrollTop();
    const $heroBg  = $('.hero-bg-text');
    if ($heroBg.length) {
      $heroBg.css('transform', `translateY(${scrolled * 0.15}px)`);
    }
  });


  /* ============================================================
     12. CATEGORY CARD — Animate on hover entrance
  ============================================================ */
  // Already handled via CSS, but add JS fallback tilt for desktop
  if (window.matchMedia('(hover: hover)').matches) {
    $('.product-card').on('mousemove', function (e) {
      const rect   = this.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const centerX = rect.width  / 2;
      const centerY = rect.height / 2;
      const rotateX =  ((y - centerY) / centerY) * 3;
      const rotateY = -((x - centerX) / centerX) * 3;
      $(this).css('transform', `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`);
    }).on('mouseleave', function () {
      $(this).css('transform', '');
    });
  }


  /* ============================================================
     13. CAROUSEL — Sync custom indicators with Bootstrap
  ============================================================ */
  const carouselEl = document.getElementById('featuredCarousel');
  if (carouselEl) {
    carouselEl.addEventListener('slide.bs.carousel', function (e) {
      const idx = e.to;
      $('.carousel-indicators-custom button').removeClass('active');
      $(`.carousel-indicators-custom button[data-bs-slide-to="${idx}"]`).addClass('active');
    });
  }


  /* ============================================================
     14. LAZY IMAGE LOADING — Ensure browser native + fallback
  ============================================================ */
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      img.src = img.getAttribute('src');
    });
  } else {
    // Fallback: Intersection Observer
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('src');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });

    lazyImages.forEach(img => imgObserver.observe(img));
  }


  /* ============================================================
     15. NUMBER COUNTER ANIMATION (Hero Stats)
  ============================================================ */
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    $('.stat-number').each(function () {
      const $el   = $(this);
      const text  = $el.text();
      const num   = parseInt(text.replace(/\D/g, ''));
      const suffix = text.replace(/[0-9]/g, '');

      if (!isNaN(num)) {
        $({ counter: 0 }).animate({ counter: num }, {
          duration: 1200,
          easing:   'swing',
          step: function () {
            $el.text(Math.floor(this.counter) + suffix);
          },
          complete: function () {
            $el.text(num + suffix);
          }
        });
      }
    });
  }

  // Trigger counter when hero section is in view
  const heroObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setTimeout(animateCounters, 800);
        heroObs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const heroSection = document.getElementById('home');
  if (heroSection) heroObs.observe(heroSection);


  /* ============================================================
     16. CURSOR HIGHLIGHT (subtle gold follow for desktop)
  ============================================================ */
  if (window.matchMedia('(pointer: fine) and (hover: hover)').matches) {
    const $cursor = $('<div id="luxxe-cursor" style="position:fixed;top:0;left:0;width:6px;height:6px;background:rgba(201,169,110,0.7);border-radius:50%;pointer-events:none;z-index:99998;transition:transform 0.12s ease,opacity 0.2s ease;transform:translate(-50%,-50%);mix-blend-mode:multiply;"></div>');
    $('body').append($cursor);

    $(document).on('mousemove', function (e) {
      $cursor.css({ left: e.clientX, top: e.clientY, opacity: 1 });
    }).on('mouseleave', function () {
      $cursor.css('opacity', 0);
    });

    $('a, button, .product-card, .category-card').on('mouseenter', function () {
      $cursor.css('transform', 'translate(-50%, -50%) scale(4)');
    }).on('mouseleave', function () {
      $cursor.css('transform', 'translate(-50%, -50%) scale(1)');
    });
  }

}); // END document.ready
