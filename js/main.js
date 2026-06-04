/**
 * NORTHSTAR MEDICAL — MAIN JAVASCRIPT
 * Features: Navbar scroll, Scroll animations, Back to Top, Smooth UX
 */

$(document).ready(function () {

  /* ============================================================
     1. NAVBAR — SCROLL BEHAVIOUR
  ============================================================ */
  const $navbar = $('#mainNavbar');

  $(window).on('scroll.navbar', function () {
    if ($(this).scrollTop() > 60) {
      $navbar.addClass('scrolled');
    } else {
      $navbar.removeClass('scrolled');
    }
  });

  /* Active nav link highlight based on section in viewport */
  const $sections = $('section[id]');
  $(window).on('scroll.activeNav', function () {
    const scrollPos = $(this).scrollTop() + 120;
    $sections.each(function () {
      const top    = $(this).offset().top;
      const bottom = top + $(this).outerHeight();
      const id     = $(this).attr('id');
      if (scrollPos >= top && scrollPos < bottom) {
        $('.ns-navbar .nav-link').removeClass('active');
        $('.ns-navbar .nav-link[href="#' + id + '"]').addClass('active');
      }
    });
  });

  /* ============================================================
     2. SMOOTH SCROLL for anchor links
  ============================================================ */
  $(document).on('click', 'a[href^="#"]', function (e) {
    const target = $(this).attr('href');
    if (target === '#' || target.length <= 1) return;
    const $target = $(target);
    if ($target.length) {
      e.preventDefault();
      const offset = $navbar.outerHeight() + 12;
      $('html, body').animate({ scrollTop: $target.offset().top - offset }, 600, 'swing');
      // Close mobile menu if open
      if ($('#navMenu').hasClass('show')) {
        $('#navMenu').collapse('hide');
      }
    }
  });

  /* ============================================================
     3. SCROLL-TRIGGERED ANIMATIONS (IntersectionObserver)
  ============================================================ */
  const animObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt($(el).data('delay') || 0, 10);
        setTimeout(function () {
          $(el).addClass('animate-in');
        }, delay);
        animObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  $('[data-animate]').each(function () {
    animObserver.observe(this);
  });

  /* ============================================================
     4. BACK TO TOP BUTTON
  ============================================================ */
  const $backTop = $('#backToTop');

  $(window).on('scroll.backTop', function () {
    if ($(this).scrollTop() > 400) {
      $backTop.addClass('visible');
    } else {
      $backTop.removeClass('visible');
    }
  });

  $backTop.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600, 'swing');
  });

  /* ============================================================
     5. SERVICE CARDS — TILT EFFECT (subtle, desktop only)
  ============================================================ */
  if (window.innerWidth >= 992) {
    $('.ns-service-card, .ns-trust-card, .ns-step-card').on('mousemove', function (e) {
      const card   = $(this);
      const rect   = this.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const tiltX  = ((y - cy) / cy) * 4;
      const tiltY  = ((x - cx) / cx) * -4;
      card.css('transform', 'translateY(-6px) perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)');
    }).on('mouseleave', function () {
      $(this).css('transform', '');
    });
  }

  /* ============================================================
     6. HERO — PARALLAX SCROLL (light)
  ============================================================ */
  $(window).on('scroll.parallax', function () {
    const scrollTop = $(this).scrollTop();
    if (scrollTop < window.innerHeight) {
      $('.ns-hero-img').css('transform', 'scale(1) translateY(' + (scrollTop * 0.18) + 'px)');
    }
  });

  /* ============================================================
     7. NAVBAR HAMBURGER ANIMATION
  ============================================================ */
  $('#navMenu').on('show.bs.collapse', function () {
    $('.ns-toggler span:nth-child(1)').css({ transform: 'translateY(7px) rotate(45deg)' });
    $('.ns-toggler span:nth-child(2)').css({ opacity: '0', transform: 'scaleX(0)' });
    $('.ns-toggler span:nth-child(3)').css({ transform: 'translateY(-7px) rotate(-45deg)' });
  }).on('hide.bs.collapse', function () {
    $('.ns-toggler span').css({ transform: '', opacity: '' });
  });

  /* ============================================================
     8. PRICING CARDS — HOVER COUNTER ANIMATION
  ============================================================ */
  function animateValue(el, start, end, duration) {
    let startTime = null;
    const step = function (timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      $(el).text(Math.floor(eased * (end - start) + start));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* Animate hero stats on load */
  let statsAnimated = false;
  const statsObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });
  if ($('.ns-hero-stats').length) statsObserver.observe($('.ns-hero-stats')[0]);

  /* ============================================================
     9. TRUST CARDS — STAGGER REVEAL ON SECTION ENTER
  ============================================================ */
  const trustObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      $('.ns-trust-card').each(function (i) {
        const $card = $(this);
        setTimeout(function () {
          $card.addClass('animate-in').css({ opacity: 1, transform: 'translateY(0)' });
        }, i * 100);
      });
      trustObserver.disconnect();
    }
  }, { threshold: 0.1 });
  if ($('.ns-trust').length) trustObserver.observe($('.ns-trust')[0]);

  /* ============================================================
     10. STEP CARDS — SEQUENTIAL HIGHLIGHT
  ============================================================ */
  const stepObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      $('.ns-step-card').each(function (i) {
        const $card = $(this);
        setTimeout(function () {
          $card.css({
            'box-shadow': '0 20px 60px rgba(13,148,136,.18)',
            'border-top': '3px solid var(--ns-teal)'
          });
        }, i * 200);
      });
      stepObserver.disconnect();
    }
  }, { threshold: 0.3 });
  if ($('.ns-hiw').length) stepObserver.observe($('.ns-hiw')[0]);

  /* ============================================================
     11. TESTIMONIAL CARDS — FADE IN SEQUENCE
  ============================================================ */
  const testiObserver = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      $('.ns-testimonial-card').each(function (i) {
        const $card = $(this);
        setTimeout(function () {
          $card.css({ opacity: 1, transform: 'translateY(0)' });
        }, i * 150);
      });
      testiObserver.disconnect();
    }
  }, { threshold: 0.1 });
  if ($('.ns-testimonials').length) testiObserver.observe($('.ns-testimonials')[0]);

  /* ============================================================
     12. CTA BANNER — PULSING GLOW ON BUTTONS
  ============================================================ */
  setInterval(function () {
    $('.ns-btn-cta-primary').toggleClass('btn-pulse');
  }, 2800);

  /* ============================================================
     13. BENEFIT ITEMS — HOVER COUNTER
  ============================================================ */
  $('.ns-benefit-item').on('mouseenter', function () {
    $(this).css('border-left-color', 'var(--ns-blue-mid)');
  }).on('mouseleave', function () {
    $(this).css('border-left-color', 'var(--ns-teal)');
  });

  /* ============================================================
     14. PRICING — TOGGLE MONTHLY / ANNUAL (placeholder)
  ============================================================ */
  // Placeholder for future pricing toggle feature
  // This can be extended to add annual/monthly switching

  /* ============================================================
     15. INITIAL TRIGGER — Fire scroll once on load
  ============================================================ */
  $(window).trigger('scroll.navbar');
  $(window).trigger('scroll.backTop');

  /* ============================================================
     16. PAGE LOAD — Fade in body content
  ============================================================ */
  $('body').css({ opacity: 0 }).animate({ opacity: 1 }, 400);

});
