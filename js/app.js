// Locuspath website prototype interactive script
// Written to replace broken Squarespace React logic and make the site work 100% locally

document.addEventListener("DOMContentLoaded", () => {
  // 1. Clear initial elements opacity/transform blocks set for React animations
  clearHiddenStyles();
  
  // 2. Initialize Desktop Navigation Dropdown panels
  initDesktopNav();
  
  // 3. Initialize Mobile Navigation Hamburger and Menu Overlay
  initMobileNav();
  
  // 4. Initialize Category pills and Card Carousel
  initPillsCarousel();
  
  // 5. Initialize Accordions (FAQs, outer headings, mobile menu items)
  initAccordions();
  
  // 6. Initialize Template Slideshow (Desktop automatic slideshow & Mobile touch arrows)
  initTemplateSlideshow();
  
  // 7. Initialize Angled Carousel (Hero 3D template slider)
  
  // 8. Initialize Header Scroll Effect
  initHeaderScroll();
  initAngledCarousel();
});

// Clear initial styles to reveal elements
function clearHiddenStyles() {
  // Clear opacity:0 on load
  document.querySelectorAll('[style*="opacity:0"], [style*="opacity: 0"]').forEach(el => {
    if (!el.classList.contains('angled-carousel__card')) {
      el.style.opacity = '1';
    }
  });
  
  // Clear transform:translateY(25px) on load
  document.querySelectorAll('[style*="transform:translateY(25px)"], [style*="transform: translateY(25px)"]').forEach(el => {
    if (!el.classList.contains('angled-carousel__card')) {
      el.style.transform = 'none';
    }
  });
}

// Desktop Hover Navigation dropdowns — DISABLED (no dropdown panels)
function initDesktopNav() {
  const triggers = document.querySelectorAll('.global-navigation__nav > button.global-navigation__header-link-item');
  const desktopMenu = document.querySelector('.global-navigation__desktop-menu');
  const menu = document.querySelector('.global-navigation__menu');
  const hoverContainer = document.querySelector('.global-navigation__desktop-menu-hover-container');

  // Hide the dropdown menu elements permanently
  if (desktopMenu) desktopMenu.style.display = 'none';
  if (menu) menu.style.display = 'none';
  if (hoverContainer) hoverContainer.style.display = 'none';

  // Make nav buttons do nothing on click or hover
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    trigger.style.cursor = 'default';
  });
}

// Solutions Submenu tabs (sidebar toggles)
function initSolutionsSubmenu() {
  const submenus = document.querySelectorAll('.global-navigation__solutions-submenu');
  submenus.forEach(submenu => {
    const listItems = submenu.querySelectorAll('.global-navigation__solutions-submenu-link-item');
    const details = submenu.querySelectorAll('.global-navigation__solutions-submenu-details');
    
    function activateDetail(index) {
      listItems.forEach((item, i) => {
        // Keep active index highlight correct (we map both desktop and mobile items)
        if (i % (listItems.length / 2) === index % (listItems.length / 2)) {
          item.classList.add('global-navigation__solutions-submenu-link-item--is-active');
        } else {
          item.classList.remove('global-navigation__solutions-submenu-link-item--is-active');
        }
      });
      
      details.forEach((detail, i) => {
        if (i === index) {
          detail.classList.add('global-navigation__solutions-submenu-details--is-visible');
          detail.style.opacity = '1';
          detail.style.visibility = 'visible';
          
          // Set CSS properties for Solutions transitions
          submenu.style.setProperty('--submenu-height', `${detail.scrollHeight}px`);
          submenu.style.setProperty('--submenu-details-width', `${detail.scrollWidth}px`);
        } else {
          detail.classList.remove('global-navigation__solutions-submenu-details--is-visible');
          detail.style.opacity = '0';
          detail.style.visibility = 'hidden';
        }
      });
    }
    
    listItems.forEach((item, idx) => {
      const index = idx % details.length;
      
      item.addEventListener('mouseenter', () => activateDetail(index));
      item.addEventListener('click', (e) => {
        e.preventDefault();
        activateDetail(index);
      });
    });
    
    // Default active item
    activateDetail(0);
  });
}

// Mobile Hamburger Menu and overlay toggle
function initMobileNav() {
  const hamburger = document.querySelector('.global-navigation__hamburger');
  const mobileMenu = document.querySelector('.global-navigation__mobile-menu');
  
  if (!hamburger || !mobileMenu) return;
  
  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    
    // Toggle active state bars
    const bars = hamburger.querySelectorAll('.global-navigation__hamburger-bar');
    bars.forEach(bar => {
      bar.classList.toggle('global-navigation__hamburger-bar--is-open', !isExpanded);
    });
    
    // Toggle mobile menu overlay panel
    mobileMenu.classList.toggle('global-navigation__mobile-menu--is-open', !isExpanded);
    
    // Toggle body scroll lock
    document.body.classList.toggle('mobile-menu-open', !isExpanded);
  });
}

// Grow Your Business section tabs (pills) & horizontal card carousel
function initPillsCarousel() {
  const pillContainers = Array.from(document.querySelectorAll('.pills__pill-container')).filter(container => {
    const text = container.textContent.trim();
    return text !== 'Previous' && text !== 'Next';
  });
  
  const track = document.querySelector('.king-carousel__cards');
  const cards = document.querySelectorAll('.king-carousel__card');
  
  if (pillContainers.length === 0 || !track) return;
  
  let activeIndex = 0;

  // Single consistent active color for all pills
  const activeColor = '#000000';
  const inactiveColor = '#999999';

  // Set up persistent indicator divs and CSS transitions for each pill
  pillContainers.forEach((container, i) => {
    // Add a persistent indicator element (initially transparent)
    let indicator = container.querySelector('.pills__pill-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'pills__pill-indicator';
      container.appendChild(indicator);
    }
    indicator.style.transition = 'background-color 0.5s ease, opacity 0.5s ease';
    indicator.style.opacity = '0';

    // Add CSS transition to the pill text element
    const pillBtn = container.querySelector('.pills__pill');
    if (pillBtn) {
      pillBtn.style.transition = 'color 0.5s ease';
    }
    const pillText = container.querySelector('.pills__pill p');
    if (pillText) {
      pillText.style.transition = 'color 0.5s ease';
    }
  });
  
  function slideTo(index) {
    if (index < 0) index = pillContainers.length - 1;
    if (index >= pillContainers.length) index = 0;
    activeIndex = index;
    
    // Smoothly transition pill indicators and text colors
    pillContainers.forEach((container, i) => {
      const indicator = container.querySelector('.pills__pill-indicator');
      const pillBtn = container.querySelector('.pills__pill');
      const pillText = container.querySelector('.pills__pill p');

      if (i === index) {
        // Active pill — fade in the indicator
        if (indicator) {
          indicator.style.backgroundColor = 'rgba(0, 0, 0, 0.06)';
          indicator.style.opacity = '1';
        }
        // Active pill text — transition to active color
        if (pillText) pillText.style.color = activeColor;
        if (pillBtn) pillBtn.style.color = activeColor;
      } else {
        // Inactive pills — fade out indicator, soften text color
        if (indicator) {
          indicator.style.opacity = '0';
        }
        if (pillText) pillText.style.color = inactiveColor;
        if (pillBtn) pillBtn.style.color = inactiveColor;
      }
    });
    
    // Slide the carousel track
    track.style.transition = 'transform 0.55s cubic-bezier(0.165, 0.84, 0.44, 1)';
    track.style.transform = `translateX(calc((var(--grid-column-width) * 2) + (var(--grid-gutter-width) * 3) - (${index * 100}%)))`;
    
    // Update card opacities (index 8 to 15 represent active items 0 to 7)
    cards.forEach((card, idx) => {
      const cardIndex = idx - 8;
      const cta = card.querySelector('.king-carousel__card-cta');
      if (cta) {
        if (cardIndex === index) {
          cta.style.opacity = '1';
          cta.style.pointerEvents = 'auto';
        } else {
          cta.style.opacity = '0';
          cta.style.pointerEvents = 'none';
        }
      }
    });
  }
  
  pillContainers.forEach((container, index) => {
    container.addEventListener('click', (e) => {
      e.preventDefault();
      slideTo(index);
    });
  });
  
  // Wire up Previous/Next slider controls
  const prevButtons = document.querySelectorAll('.king-carousel__controls-prev-area button, .pills__pill-container:first-child button');
  const nextButtons = document.querySelectorAll('.king-carousel__controls-next-area button, .pills__pill-container:last-child button');
  
  prevButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      slideTo(activeIndex - 1);
    });
  });
  
  nextButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      slideTo(activeIndex + 1);
    });
  });
  
  // Set default active tab
  slideTo(0);
}

// Collapsible Accordion sections (FAQs, outer accordion titles, and mobile sub-accordions)
function initAccordions() {
  const buttons = document.querySelectorAll('.faq__accordion-title, .accordion-headline__title, .global-navigation__accordion-heading');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !isExpanded);
      
      let panel = null;
      if (btn.classList.contains('global-navigation__accordion-heading')) {
        panel = btn.nextElementSibling;
      } else {
        const ariaControls = btn.getAttribute('aria-controls');
        panel = document.getElementById(ariaControls);
      }
      
      if (panel) {
        panel.style.transition = 'height 0.35s cubic-bezier(0.165, 0.84, 0.44, 1)';
        if (isExpanded) {
          panel.style.height = '0px';
          panel.setAttribute('aria-hidden', 'true');
        } else {
          panel.style.height = `${panel.scrollHeight}px`;
          panel.setAttribute('aria-hidden', 'false');
        }
      }
      
      // Rotate icon indicator
      const svg = btn.querySelector('svg');
      if (svg) {
        svg.style.transition = 'transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)';
        svg.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(45deg)';
      }
    });
  });
}

// Template Slideshows (Desktop Automatic & Mobile Swipe/Arrows)
function initTemplateSlideshow() {
  // 1. Desktop Template Slideshow
  const desktopContainer = document.querySelector('.templates__template-carousel-cards');
  if (desktopContainer) {
    // Hide loader
    const loader = document.querySelector('.templates__template-carousel-loader');
    if (loader) loader.style.display = 'none';
    
    desktopContainer.innerHTML = '';
    
    const slidesData = [
      {
        templates: [
          { name: 'Rotate', img: 'images/rotate-500w.jpg', href: '#rotate' },
          { name: 'Reseda', img: 'images/reseda-500w.jpg', href: '#reseda' }
        ]
      },
      {
        templates: [
          { name: 'Alta Loma', img: 'images/altaloma-500w.jpg', href: '#alta-loma' }
        ]
      }
    ];
    
    const slides = [];
    slidesData.forEach((sData, sIdx) => {
      const slide = document.createElement('div');
      slide.className = 'templates__template-carousel-slide';
      slide.style.position = 'absolute';
      slide.style.left = `${sIdx * 100}%`;
      slide.style.transition = 'left 0.6s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.6s';
      slide.style.opacity = sIdx === 0 ? '1' : '0';
      slide.style.width = '100%';
      slide.style.display = 'flex';
      slide.style.gap = 'var(--grid-gutter-width)';
      
      sData.templates.forEach(t => {
        const card = document.createElement('a');
        card.className = 'template-carousel__thumbnail';
        card.href = t.href;
        card.title = t.name;
        card.style.flex = '1';
        
        card.innerHTML = `
          <div class="template-carousel__thumbnail-background-image-wrapper">
            <img class="template-carousel__thumbnail-background-image" src="${t.img}" alt="${t.name} template" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="template-carousel__thumbnail-name">
            <span class="text text--footnote text--light" style="color: white; padding: 6px 12px; display: inline-block;">${t.name}</span>
          </div>
        `;
        slide.appendChild(card);
      });
      
      desktopContainer.appendChild(slide);
      slides.push(slide);
    });
    
    let activeSlideIndex = 0;
    let autoplayInterval = null;
    let isPlaying = true;
    
    const pagingIndicator = document.querySelector('.template-carousel__toolbar .paging-indicator');
    if (pagingIndicator) {
      pagingIndicator.style.opacity = '1';
      pagingIndicator.innerHTML = '<span class="text text--footnote text--light">1 / 2</span>';
    }
    
    function showSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      activeSlideIndex = index;
      
      slides.forEach((slide, sIdx) => {
        slide.style.left = `${(sIdx - index) * 100}%`;
        slide.style.opacity = sIdx === index ? '1' : '0';
      });
      
      if (pagingIndicator) {
        pagingIndicator.innerHTML = `<span class="text text--footnote text--light">${index + 1} / ${slides.length}</span>`;
      }
    }
    
    function startAutoplay() {
      if (autoplayInterval) clearInterval(autoplayInterval);
      autoplayInterval = setInterval(() => {
        if (isPlaying) {
          showSlide(activeSlideIndex + 1);
        }
      }, 4000);
    }
    
    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }
    
    const playPauseBtn = document.querySelector('.template-carousel__toolbar-controls');
    if (playPauseBtn) {
      playPauseBtn.style.opacity = '1';
      playPauseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isPlaying = !isPlaying;
        playPauseBtn.setAttribute('aria-pressed', !isPlaying);
        
        if (isPlaying) {
          playPauseBtn.innerHTML = `
            <svg fill="none" height="10" viewBox="0 0 6 10" width="6" xmlns="http://www.w3.org/2000/svg" class="play-icon controls__button-svg">
              <path d="m.319988 9.26029c-.131849.09887-.319988.00479-.319988-.16001v-8.199999c0-.164816.188166-.258891.320011-.159992l5.466669 4.100621c.10666.08001.10665.24001-.00003.32z" fill="currentColor"></path>
            </svg>
          `;
          startAutoplay();
        } else {
          playPauseBtn.innerHTML = `
            <svg fill="currentColor" height="10" viewBox="0 0 6 10" width="6" xmlns="http://www.w3.org/2000/svg" class="pause-icon controls__button-svg">
              <rect x="0" y="1" width="2" height="8"></rect>
              <rect x="4" y="1" width="2" height="8"></rect>
            </svg>
          `;
          stopAutoplay();
        }
      });
    }
    
    startAutoplay();
  }
  
  // 2. Mobile Template Carousel (Arrow Touch areas)
  const mobileCarouselItems = document.querySelectorAll('.templates__mobile-carousel-item');
  if (mobileCarouselItems.length > 0) {
    let activeMobileIndex = 0;
    const mobileIndicator = document.querySelector('.templates__mobile .templates__mobile-carousel-paging-indicator');
    
    function showMobileTemplate(index) {
      if (index < 0) index = mobileCarouselItems.length - 1;
      if (index >= mobileCarouselItems.length) index = 0;
      activeMobileIndex = index;
      
      mobileCarouselItems.forEach((item, i) => {
        const cta = item.querySelector('.templates__mobile-carousel-item-content');
        if (i === index) {
          item.classList.add('templates__mobile-carousel-item--is-active');
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
          if (cta) {
            cta.style.opacity = '1';
            cta.setAttribute('tabindex', '0');
          }
        } else {
          item.classList.remove('templates__mobile-carousel-item--is-active');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          if (cta) {
            cta.style.opacity = '0';
            cta.setAttribute('tabindex', '-1');
          }
        }
      });
      
      if (mobileIndicator) {
        mobileIndicator.innerHTML = `<span class="text text--footnote text--light">${index + 1} / ${mobileCarouselItems.length}</span>`;
      }
    }
    
    const prevTouchBtn = document.querySelector('.templates__mobile button[aria-label="Previous template"]');
    const nextTouchBtn = document.querySelector('.templates__mobile button[aria-label="Next template"]');
    
    if (prevTouchBtn) {
      prevTouchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showMobileTemplate(activeMobileIndex - 1);
      });
    }
    if (nextTouchBtn) {
      nextTouchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showMobileTemplate(activeMobileIndex + 1);
      });
    }
    
    showMobileTemplate(0);
  }
}


// Hero 3D Angled Carousel (customer website template previews)
function initAngledCarousel() {
  const container = document.querySelector('.angled-carousel');
  const cards = document.querySelectorAll('.angled-carousel__card');
  const prevBtn = document.querySelector('.angled-carousel__controls--left button');
  const nextBtn = document.querySelector('.angled-carousel__controls--right button');
  
  if (!container || cards.length === 0) return;
  
  let activeIndex = 2; // Card 2 (Plants) is the default active card

  // Dynamic responsive iframe scaling math
  function resizeIframes() {
    cards.forEach(card => {
      const iframe = card.querySelector('iframe');
      const container = card.querySelector('.iframe-container');
      if (iframe && container) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w === 0 || h === 0) return;
        const baseWidth = 1200;
        const scale = w / baseWidth;
        const baseHeight = h / scale;
        
        iframe.style.width = baseWidth + 'px';
        iframe.style.height = baseHeight + 'px';
        iframe.style.transform = `translate(-50%, -50%) scale(${scale})`;
      }
    });
  }
  
  // Call resize initially and on page layout settle
  resizeIframes();
  setTimeout(resizeIframes, 100);
  setTimeout(resizeIframes, 500);
  
  window.addEventListener('resize', resizeIframes);

  
  // Base transforms for card position relative to the active index (cardIdx - activeIndex)
  // Matching the original Squarespace CSS/JS values
  const positionStyles = {
    "0": {
      opacity: "1",
      zIndex: "3",
      transformBase: "translateX(0px) translateY(0px) scale(1) rotate(0deg)"
    },
    "1": {
      opacity: "1",
      zIndex: "2",
      transformBase: "translateX(calc(100% + 20px)) translateY(5%) scale(0.88) rotate(2deg)"
    },
    "-1": {
      opacity: "1",
      zIndex: "2",
      transformBase: "translateX(calc(-100% - 20px)) translateY(5%) scale(0.88) rotate(-2deg)"
    },
    "2": {
      opacity: "0",
      zIndex: "1",
      transformBase: "translateX(200%) translateY(10%) scale(0.8) rotate(4deg)"
    },
    "-2": {
      opacity: "0",
      zIndex: "1",
      transformBase: "translateX(-200%) translateY(10%) scale(0.8) rotate(-4deg)"
    }
  };
  
  function updateCarousel(scrollOffset = 0) {
    cards.forEach((card, idx) => {
      // Endless loop factor calculation wrapped to [-2, 2]
      const half = Math.floor(cards.length / 2);
      let diff = idx - activeIndex;
      let factor = ((diff + half) % cards.length + cards.length) % cards.length - half;
      
      const styles = positionStyles[factor.toString()];
      if (styles) {
        card.style.transition = 'transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.8s ease, z-index 0.8s';
        card.style.opacity = styles.opacity;
        card.style.zIndex = styles.zIndex;
        
        // Add scroll-linked horizontal shift (parallax scroll effect)
        // Shifting cards horizontally as the page is scrolled
        if (factor === 0) {
          card.style.transform = `translateX(0px) translateY(0px) scale(1) rotate(0deg)`;
        } else if (factor === 1) {
          card.style.transform = `translateX(calc(100% + 20px + ${scrollOffset * 0.5}px)) translateY(5%) scale(0.88) rotate(2deg)`;
        } else if (factor === -1) {
          card.style.transform = `translateX(calc(-100% - 20px + ${scrollOffset * 0.5}px)) translateY(5%) scale(0.88) rotate(-2deg)`;
        } else if (factor === 2) {
          card.style.transform = `translateX(calc(200% + ${scrollOffset * 0.5}px)) translateY(10%) scale(0.8) rotate(4deg)`;
        } else if (factor === -2) {
          card.style.transform = `translateX(calc(-200% + ${scrollOffset * 0.5}px)) translateY(10%) scale(0.8) rotate(-4deg)`;
        }
        
        // Toggle card overlay active class (inactive cards are darkened)
        const overlay = card.querySelector('.angled-carousel__card-overlay');
        if (overlay) {
          if (idx === activeIndex) {
            overlay.classList.remove('angled-carousel__card-overlay--active');
          } else {
            overlay.classList.add('angled-carousel__card-overlay--active');
          }
        }
      }
    });
  }
  
  function getScrollOffset() {
    // Measure relative position of the carousel container to the viewport
    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Total distance is viewportHeight + rect.height
    const totalDist = viewportHeight + rect.height;
    
    if (rect.top < viewportHeight && rect.bottom > 0) {
      // Progress from 0 (enters screen at bottom) to 1 (leaves screen at top)
      const progress = 1 - (rect.bottom / totalDist);
      // Map progress to pixel shift: translate cards from +100px to -100px on scroll
      return (0.5 - progress) * 200;
    }
    return 0;
  }
  
  // Bind Scroll event
  window.addEventListener('scroll', () => {
    updateCarousel(getScrollOffset());
  });
  
  // Bind Controls
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + cards.length) % cards.length;
      updateCarousel(getScrollOffset());
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % cards.length;
      updateCarousel(getScrollOffset());
    });
  }
  
  // Bind direct card click activation
  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (idx !== activeIndex) {
        e.preventDefault();
        activeIndex = idx;
        updateCarousel(getScrollOffset());
      }
    });
    // Visual cue
    card.style.cursor = 'pointer';
  });
  
  // Initial draw
  updateCarousel(getScrollOffset());
}


// Header scroll color toggle to prevent overlapping text
function initHeaderScroll() {
  const header = document.getElementById('global-navigation');
  if (header) {
    header.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease';
    
    function checkScroll() {
      if (window.scrollY > 20) {
        header.style.backgroundColor = '#000000';
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
      } else {
        header.style.backgroundColor = 'transparent';
        header.style.boxShadow = 'none';
      }
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll();
  }
}
