/* ============================================
   DENTAFLOAT — INTERACTIVE SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- LOADING SCREEN ----
  const loadingScreen = document.getElementById('loadingScreen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 1200);
  });
  // Fallback: remove after 3s no matter what
  setTimeout(() => loadingScreen.classList.add('hidden'), 3000);

  // ---- NAVBAR SCROLL EFFECT ----
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  const handleNavScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ---- MOBILE NAVIGATION ----
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- SCROLL REVEAL ANIMATIONS ----
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animations for sibling cards
        const parent = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll('.animate-on-scroll')) : [];
        const siblingIndex = siblings.indexOf(entry.target);
        const delay = siblingIndex >= 0 ? siblingIndex * 100 : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => scrollObserver.observe(el));

  // ---- TIME SLOT SELECTION ----
  const timeSlots = document.querySelectorAll('.time-slot');
  let selectedTime = null;

  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('active'));
      slot.classList.add('active');
      selectedTime = slot.dataset.time;

      // Micro-interaction: ripple effect
      slot.style.transform = 'translateY(-2px) scale(0.95)';
      setTimeout(() => {
        slot.style.transform = 'translateY(-2px) scale(1)';
      }, 150);
    });
  });

  // ---- BOOKING FORM ----
  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccess = document.getElementById('bookingSuccess');
  const bookingCard = document.getElementById('bookingCard');
  const bookAnother = document.getElementById('bookAnother');

  // Set minimum date to today
  const dateInput = document.getElementById('bookingDate');
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!selectedTime) {
      // Flash time slots area to prompt selection
      const slotsContainer = document.getElementById('timeSlots');
      slotsContainer.style.outline = '2px solid #4A90E2';
      slotsContainer.style.outlineOffset = '4px';
      slotsContainer.style.borderRadius = '12px';
      setTimeout(() => {
        slotsContainer.style.outline = 'none';
      }, 2000);

      // Shake the label
      const label = document.querySelector('.time-slots-label');
      label.style.color = '#E74C3C';
      label.textContent = '⚠ Please select a time slot';
      setTimeout(() => {
        label.style.color = '';
        label.textContent = 'Select Time Slot';
      }, 2500);
      return;
    }

    // Simulate loading
    const submitBtn = document.getElementById('bookingSubmit');
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32" style="animation: dash 1.5s ease-in-out infinite;"/>
      </svg>
      Booking...
    `;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      // Show success
      bookingForm.style.display = 'none';
      bookingSuccess.classList.add('show');

      // Stop card float animation during success
      bookingCard.style.animation = 'none';

      // Reset
      submitBtn.innerHTML = originalContent;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }, 1500);
  });

  bookAnother.addEventListener('click', () => {
    bookingForm.reset();
    selectedTime = null;
    timeSlots.forEach(s => s.classList.remove('active'));
    bookingSuccess.classList.remove('show');
    bookingForm.style.display = 'flex';
    bookingCard.style.animation = 'float 8s ease-in-out infinite';
  });

  // ---- INPUT FOCUS MICRO-INTERACTIONS ----
  const formInputs = document.querySelectorAll('.form-group input, .form-group select');
  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      const group = input.closest('.form-group');
      if (group) {
        group.style.transform = 'translateY(-2px)';
        group.style.transition = '350ms cubic-bezier(0.4, 0, 0.2, 1)';
      }
    });

    input.addEventListener('blur', () => {
      const group = input.closest('.form-group');
      if (group) {
        group.style.transform = 'translateY(0)';
      }
    });
  });

  // ---- TESTIMONIALS CAROUSEL ----
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  if (track && prevBtn && nextBtn) {
    const scrollAmount = 400;

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    // Touch / drag scroll for desktop
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.style.cursor = 'grabbing';
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.style.cursor = 'grab';
    });

    track.addEventListener('mouseup', () => {
      isDown = false;
      track.style.cursor = 'grab';
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });

    track.style.cursor = 'grab';
  }

  // ---- COUNTER ANIMATION FOR STATS ----
  const animateCounter = (element, target, suffix = '') => {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);

      element.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  // Observe stat elements and animate when visible
  const statElements = document.querySelectorAll('.about-stat-value, .hero-stat-value');

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();

        // Parse number and suffix
        const match = text.match(/^([\d,.]+)(.*)$/);
        if (match) {
          const num = parseFloat(match[1].replace(/,/g, ''));
          const suffix = match[2];
          if (!isNaN(num)) {
            animateCounter(el, num, suffix);
          }
        }

        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statElements.forEach(el => statObserver.observe(el));

  // ---- PARALLAX FOR HERO ORBS ----
  const heroOrbs = document.querySelectorAll('.hero-bg-orb');
  
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    heroOrbs.forEach((orb, index) => {
      const speed = (index + 1) * 8;
      orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  }, { passive: true });

  // ---- SERVICE CARD TILT EFFECT ----
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / centerY * -3;
      const rotateY = (x - centerX) / centerX * 3;

      card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s ease-out';
    });
  });

  // ---- ACTIVE NAV LINK ON SCROLL ----
  const sections = document.querySelectorAll('section[id]');
  const navLinksArray = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinksArray.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--color-primary)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ---- ADD CSS ANIMATION KEYFRAMES FOR LOADING SPINNER ----
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes dash {
      0% { stroke-dashoffset: 32; }
      50% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: -32; }
    }
  `;
  document.head.appendChild(styleSheet);

});
