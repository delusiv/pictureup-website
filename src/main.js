/*****************************************************
 * 1. CHECK TOUCH DEVICE
 *****************************************************/
const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0);

/*****************************************************
 * 2. SPLIT TEXT INTO WORDS & MAKE THEM INVISIBLE
 *****************************************************/
function setupInvisibleWords(selector) {
  const animElements = document.querySelectorAll(selector);
  animElements.forEach(anim => {
    const words = anim.textContent.trim().split(/\s+/);
    anim.innerHTML = ""; // Clear original text
    words.forEach((word, index) => {
      // Add a space if it's not the last word
      const space = index < words.length - 1 ? " " : "";
      anim.innerHTML += `<span>${word}</span>${space}`;
    });
  });
}

/*****************************************************
 * 3. REVEAL ANIMATION USING INTERSECTION OBSERVER
 *****************************************************/
function observeAndReveal(selector) {
  const targets = document.querySelectorAll(selector);

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const spans = entry.target.querySelectorAll('span');
        spans.forEach((span, index) => {
          setTimeout(() => {
            span.classList.add('visible');
          }, index * 80);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(target => observer.observe(target));
}

/*****************************************************
 * 4. LANDING ARROW TOGGLE & VIDEO CONTROL
 *****************************************************/
function initLandingArrow(arrowSelector, videoSelector, headerSelector) {
  const arrowBtn = document.querySelector(arrowSelector);
  const videoEl = document.querySelector(videoSelector);
  const headerEl = document.querySelector(headerSelector);
  const portfolioEl = document.querySelector('.portfolio');
  const textEl = document.querySelector('.center'); // Grab the text element

  if (!arrowBtn || !videoEl || !headerEl || !portfolioEl || !textEl) return;

  let arrowClicked = false;

  // Hover handlers (desktop)
  function pauseVideo() { videoEl.pause(); }
  function playVideo() { videoEl.play(); }

  // Attach hover listeners initially (desktop only)
  if (!isTouchDevice) {
    arrowBtn.addEventListener('mouseenter', pauseVideo);
    arrowBtn.addEventListener('mouseleave', playVideo);
  }

  // Tap toggles video (touch devices)
  if (isTouchDevice) {
    arrowBtn.addEventListener('touchstart', () => {
      if (videoEl.paused) {
        playVideo();
      } else {
        pauseVideo();
      }
    });
  }

  // Click => toggle logic
  arrowBtn.addEventListener('click', () => {
    if (!arrowClicked) {
      // FIRST CLICK: Pause video, rotate arrow, change text and scroll to .portfolio
      pauseVideo();
      arrowBtn.classList.add('rotated');
      if (!isTouchDevice) {
        arrowBtn.removeEventListener('mouseenter', pauseVideo);
        arrowBtn.removeEventListener('mouseleave', playVideo);
      }
      portfolioEl.scrollIntoView({ behavior: 'smooth' });
      
      // Change text to "Unpause Me"
      textEl.textContent = 'Unpause Me.';

      arrowClicked = true;
    } else {
      // SECOND CLICK: Play video, unrotate arrow, change text and scroll back to header
      playVideo();
      arrowBtn.classList.remove('rotated');
      if (!isTouchDevice) {
        arrowBtn.addEventListener('mouseenter', pauseVideo);
        arrowBtn.addEventListener('mouseleave', playVideo);
      }
      headerEl.scrollIntoView({ behavior: 'smooth' });
      
      // Revert text back to "Check out our latest."
      textEl.textContent = 'Check out our latest work.';

      arrowClicked = false;
    }
  });
}

/*****************************************************
 * 5. HOVER/TOUCH VIDEO LOGIC FOR PORTFOLIO BOXES
 *****************************************************/
function setupHoverVideo(containerSelector, videoSelector) {
  const videoContainer = document.querySelector(containerSelector);
  const videoEl = document.querySelector(videoSelector);
  if (!videoContainer || !videoEl) return;

  if (isTouchDevice) {
    // Tap toggles video on touch devices
    videoContainer.addEventListener('touchstart', () => {
      if (videoEl.paused) {
        videoEl.play();
      } else {
        videoEl.pause();
      }
    });
  } else {
    // Hover to play/pause on desktop
    videoContainer.addEventListener('mouseenter', () => {
      videoEl.play();
    });
    videoContainer.addEventListener('mouseleave', () => {
      videoEl.pause();
      videoEl.currentTime = 0; // Reset video
    });
  }
}

/**
 * Setup scroll behavior for *all* elements matching buttonSelector
 */
function setupScrollButton(buttonSelector, targetSelector, videoSelector) {
  const buttonEls = document.querySelectorAll(buttonSelector);
  const targetEl = document.querySelector(targetSelector);
  const videoEl = document.querySelector(videoSelector);

  // If there's no target or video, do nothing
  if (!targetEl || !videoEl) return;

  // For each button that matches the selector
  buttonEls.forEach(buttonEl => {
    // Attach click
    buttonEl.addEventListener('click', () => {
      videoEl.pause();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    });
  });
}


// Already present:
const hamburgerBtn = document.querySelector('.hamburger');
const menuOverlay = document.querySelector('.menu-overlay');

// ADD THIS: get the landing arrow
const landingArrow = document.querySelector('.landing-arrowdown');

// Track whether hamburger is currently fixed
let isFixed = false;

hamburgerBtn.addEventListener('click', () => {
  // Toggle the overlay and body scroll lock (your existing logic)
  menuOverlay.classList.toggle('open');
  hamburgerBtn.classList.toggle('open');
  document.body.classList.toggle('no-scroll-y');

  // Instead of hiding the landing arrow, disable or enable it
  if (menuOverlay.classList.contains('open')) {
    landingArrow.disabled = true;
  } else {
    landingArrow.disabled = false;
  }

  // Now handle the "fixed position" toggle
  if (!isFixed) {
    // First click => fix the hamburger
    hamburgerBtn.classList.add('fixed-position');
    isFixed = true;
  } else {
    // Second click => revert to default
    hamburgerBtn.classList.remove('fixed-position');
    isFixed = false;
  }
});

// Close overlay when clicking menu links (existing logic)
const menuLinks = document.querySelectorAll('.menu-overlay a');
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuOverlay.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    document.body.classList.remove('no-scroll-y');

    // Re-enable the landing arrow when the menu is closed
    landingArrow.disabled = false;

    // Optionally remove the fixed-position
    hamburgerBtn.classList.remove('fixed-position');
    isFixed = false;
  });
});

/*****************************************************
 * 7. INITIALIZE EVERYTHING
 *****************************************************/

// 7.1 Split words & reveal on scroll
setupInvisibleWords('.anim');
observeAndReveal('.anim');

// 7.2 Landing arrow logic
initLandingArrow('.landing-arrowdown', '.back-video', 'header');

// 7.3 Setup portfolio box hovers
setupHoverVideo('.box1', '.box1video');
setupHoverVideo('.box2', '.box2video');
setupHoverVideo('.box3', '.box3video');

// 7.4 Setup scroll buttons for Work, About, Contact
// 7.4 Setup scroll buttons for both "w-button" and "o-w-button" at once
setupScrollButton('.w-button, .o-w-button', '.portfolio', '.back-video');

// 7.5 Setup scroll buttons for both "a-button" and "o-a-button" at once
setupScrollButton('.a-button, .o-a-button', '.about-section', '.back-video');

// 7.6 Setup scroll buttons for both "c-button" and "o-c-button" at once
setupScrollButton('.c-button, .o-c-button', '.contact-section', '.back-video');


/*****************************************************
 *  HIDE/SHOW BACKGROUND VIDEO BASED ON .PORTFOLIO
 *****************************************************/
function hideBackVideoWhenPortfolioVisible(portfolioSelector, videoSelector) {
  const portfolioEl = document.querySelector(portfolioSelector);
  const backVideoEl = document.querySelector(videoSelector);
  if (!portfolioEl || !backVideoEl) return;

  // Create an intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio === 1) {
        // If .portfolio is fully in view, hide the video
        backVideoEl.style.display = 'none';
      } else {
        // Otherwise, show the video
        backVideoEl.style.display = 'block';
      }
    });
  }, {
    threshold: 1.0 // 100% of the .portfolio element must be visible
  });

  observer.observe(portfolioEl);
}
// Call it with your specific selectors:
hideBackVideoWhenPortfolioVisible('.portfolio', '.back-video');
