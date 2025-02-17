(function () {
  /*****************************************************
   * 1. CHECK TOUCH DEVICE
   *****************************************************/
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /*****************************************************
   * 2. SPLIT TEXT INTO WORDS & MAKE THEM INVISIBLE
   *****************************************************/
  const setupInvisibleWords = (selector) => {
    document.querySelectorAll(selector).forEach(el => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');
    });
  };

  /*****************************************************
   * 3. REVEAL ANIMATION USING INTERSECTION OBSERVER
   *****************************************************/
  const observeAndReveal = (selector) => {
    const targets = document.querySelectorAll(selector);
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('span').forEach((span, index) => {
            setTimeout(() => span.classList.add('visible'), index * 80);
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    targets.forEach(target => observer.observe(target));
  };

  /*****************************************************
   * 4. SETUP SCROLL BUTTONS
   *****************************************************/
  const setupScrollButton = (buttonSelector, targetSelector, videoSelector) => {
    const buttonEls = document.querySelectorAll(buttonSelector);
    const targetEl = document.querySelector(targetSelector);
    const videoEl = document.querySelector(videoSelector);
    if (!targetEl || !videoEl) return;
    buttonEls.forEach(buttonEl => {
      buttonEl.addEventListener('click', () => {
        videoEl.pause();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      });
    });
  };

  /*****************************************************
   * 5. HIDE/SHOW BACKGROUND VIDEO BASED ON PORTFOLIO VISIBILITY
   *****************************************************/
  const hideBackVideoWhenPortfolioVisible = (portfolioSelector, videoSelector) => {
    const portfolioEl = document.querySelector(portfolioSelector);
    const backVideoEl = document.querySelector(videoSelector);
    if (!portfolioEl || !backVideoEl) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          backVideoEl.style.display =
            entry.isIntersecting && entry.intersectionRatio === 1
              ? 'none'
              : 'block';
        });
      },
      { threshold: 1.0 }
    );
    observer.observe(portfolioEl);
  };

  /*****************************************************
   * 6. INITIALIZATION OF CUSTOM FUNCTIONS
   *****************************************************/
  const init = () => {
    setupInvisibleWords('.anim');
    observeAndReveal('.anim');
    hideBackVideoWhenPortfolioVisible('.portfolio', '.back-video');
    // Setup scroll buttons for different sections:
    setupScrollButton('.o-w-button', '.portfolio', '.back-video');
    setupScrollButton('.o-a-button', '.about-section', '.back-video');
    setupScrollButton('.o-c-button', '.contact-section', '.back-video');
    setupScrollButton('.b-landing', '.contact-section', '.back-video');
  };

  /*****************************************************
   * 7. HAMBURGER & MENU OVERLAY TOGGLE
   *****************************************************/
  const initHamburger = () => {
    const navIcon = document.getElementById('nav-icon1');
    const menuOverlay = document.querySelector('.menu-overlay');
    if (!navIcon || !menuOverlay) return;

    // Toggle hamburger, overlay, and no-scroll-y on body when navIcon is clicked
    navIcon.addEventListener('click', function() {
      this.classList.toggle('open');
      menuOverlay.classList.toggle('open');
      if (menuOverlay.classList.contains('open')) {
        document.body.classList.add('no-scroll-y');
      } else {
        document.body.classList.remove('no-scroll-y');
      }
    });

    // When any button inside the overlay is clicked, close the overlay, reset hamburger, and remove no-scroll-y from body
    document.querySelectorAll('.menu-overlay button').forEach(button => {
      button.addEventListener('click', () => {
        navIcon.classList.remove('open');
        menuOverlay.classList.remove('open');
        document.body.classList.remove('no-scroll-y');
      });
    });
  };

// Select all portfolio buttons
const portfolioButtons = document.querySelectorAll('.portfolio button');

portfolioButtons.forEach((button) => {
  // Find the video element within the current button
  const video = button.querySelector('video');
  
  // Play the video on mouse enter
  button.addEventListener('mouseenter', () => {
    video.play();
  });
  
  // Pause, reset the video, and force the poster on mouse leave
  button.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
    video.load(); // This reloads the video element, showing the poster
  });
});



  /*****************************************************
   * 8. DOCUMENT READY (Vanilla JS)
   *****************************************************/
  document.addEventListener('DOMContentLoaded', () => {
    init();
    initHamburger();
  });
})();


