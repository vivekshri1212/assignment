/**
 * script.js — Maxcolor Pipes | Gushwork Assignment
 * Author: Vivek
 * Features:
 *   1. Sticky Header — appears on scroll past hero, hides on scroll up
 *   2. Image Carousel — with thumbnail navigation and prev/next buttons
 *   3. Zoom Overlay — circular zoom preview on hover
 *   4. FAQ Accordion
 *   5. Process Tabs
 *   6. Industry Carousel scroll
 *   7. Hamburger mobile menu
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. STICKY HEADER
     — Appears when user scrolls past the hero section
     — Disappears when scrolling back to top
     — This is the part I always test first when working on scrolling UX
     ============================================================ */
  const stickyHeader = document.getElementById('stickyHeader');
  const heroSection  = document.getElementById('hero');

  let lastScrollY = window.scrollY;
  let heroBottom   = 0;

  // Calculate hero bottom once, update on resize
  function updateHeroBottom() {
    heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 400;
  }
  updateHeroBottom();
  window.addEventListener('resize', updateHeroBottom);

  // Listen to scroll events — show/hide sticky header
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > heroBottom) {
      // Past the hero: show sticky header
      stickyHeader.classList.add('visible');
    } else {
      // Back near top: hide sticky header
      stickyHeader.classList.remove('visible');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });


  /* ============================================================
     2. IMAGE CAROUSEL (Hero Section)
     — Shows one image at a time
     — Prev / Next buttons
     — Thumbnail click to jump
     — Auto-play every 4 seconds
     ============================================================ */
  const track      = document.getElementById('carouselTrack');
  const slides     = document.querySelectorAll('.carousel-slide');
  const thumbs     = document.querySelectorAll('.thumb');
  const prevBtn    = document.getElementById('prevBtn');
  const nextBtn    = document.getElementById('nextBtn');

  let currentIndex = 0;
  let autoPlayTimer;

  // Move carousel to given index
  function goToSlide(index) {
    // Wrap around
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    // Translate the track
    track.style.transform = `translateX(-${index * 100}%)`;

    // Update active states
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    thumbs.forEach((thumb, i) => thumb.classList.toggle('active', i === index));

    currentIndex = index;
  }

  // Button click handlers
  prevBtn.addEventListener('click', () => {
    resetAutoPlay();
    goToSlide(currentIndex - 1);
  });

  nextBtn.addEventListener('click', () => {
    resetAutoPlay();
    goToSlide(currentIndex + 1);
  });

  // Thumbnail click
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      resetAutoPlay();
      goToSlide(parseInt(thumb.dataset.index));
    });
  });

  // Auto-play: advance every 4 seconds
  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 4000);
  }

  function resetAutoPlay() {
    // Reset the auto-play timer so the carousel does not jump
    // immediately after the user interacts with it.
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  startAutoPlay();

  // Touch / swipe support for mobile carousel
  let touchStartX = 0;
  const carouselMain = document.getElementById('carouselMain');

  carouselMain.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  carouselMain.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      resetAutoPlay();
      goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    }
  }, { passive: true });


  /* ============================================================
     3. ZOOM OVERLAY — Dynamic cursor-following zoom
     Tracks mouse position inside each carousel slide / ind-card
     and adjusts the zoom-img position accordingly
     ============================================================ */
  function initZoom(container, zoomOverlay, zoomImg) {
    container.addEventListener('mousemove', (e) => {
      const rect   = container.getBoundingClientRect();
      const xRatio = (e.clientX - rect.left)  / rect.width;
      const yRatio = (e.clientY - rect.top)   / rect.height;

      // Move zoom image to show the region under cursor
      // zoomImg is 250% wide/tall, so offset range is 0–150%
      const offsetX = xRatio * 150;
      const offsetY = yRatio * 150;
      zoomImg.style.left = `-${offsetX}%`;
      zoomImg.style.top  = `-${offsetY}%`;
    });
  }

  // Apply dynamic zoom to hero carousel slides
  document.querySelectorAll('.carousel-slide').forEach(slide => {
    const overlay = slide.querySelector('.zoom-overlay');
    const zImg    = slide.querySelector('.zoom-img');
    if (overlay && zImg) initZoom(slide, overlay, zImg);
  });

  // Apply dynamic zoom to industry cards
  document.querySelectorAll('.ind-card').forEach(card => {
    const overlay = card.querySelector('.zoom-overlay');
    const zImg    = card.querySelector('.zoom-img');
    if (overlay && zImg) initZoom(card, overlay, zImg);
  });


  /* ============================================================
     4. FAQ ACCORDION
     ============================================================ */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      const answer     = question.nextElementSibling;

      // Close all first
      faqQuestions.forEach(q => {
        q.setAttribute('aria-expanded', 'false');
        q.nextElementSibling.classList.remove('open');
      });

      // If wasn't open, open it
      if (!isExpanded) {
        question.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });


  /* ============================================================
     5. PROCESS TABS
     ============================================================ */
  const ptabs = document.querySelectorAll('.ptab');

  ptabs.forEach(tab => {
    tab.addEventListener('click', () => {
      ptabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // In a real app, you'd swap content here based on tab.dataset.tab
    });
  });


  /* ============================================================
     6. INDUSTRY CAROUSEL — Left/Right scroll buttons
     ============================================================ */
  const industryCarousel = document.getElementById('industryCarousel');
  const indPrev          = document.getElementById('indPrev');
  const indNext          = document.getElementById('indNext');
  const SCROLL_AMOUNT    = 280; // px per click

  indPrev.addEventListener('click', () => {
    industryCarousel.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  });

  indNext.addEventListener('click', () => {
    industryCarousel.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
  });


  /* ============================================================
     7. HAMBURGER MOBILE MENU
     ============================================================ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    // Animate hamburger to X
    const bars = hamburger.querySelectorAll('span');
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity   = '';
      bars[2].style.transform = '';
    }
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(bar => {
        bar.style.transform = '';
        bar.style.opacity   = '';
      });
    });
  });

}); // End DOMContentLoaded
