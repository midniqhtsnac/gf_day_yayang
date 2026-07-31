// Audio Controls & Navigation Logic
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

const emojis = ['❤️', '💖', '💕', '✨', '🌸', '💘', '💗'];

function switchScreen(fromScreenId, toScreenId, callback) {
  const fromScreen = document.getElementById(fromScreenId);
  const toScreen = document.getElementById(toScreenId);

  fromScreen.style.opacity = '0';
  fromScreen.style.transform = 'translateY(-15px)';

  setTimeout(() => {
    fromScreen.classList.add('hidden');
    toScreen.classList.remove('hidden');
    
    if (callback) callback();

    setTimeout(() => {
      toScreen.style.opacity = '1';
      toScreen.style.transform = 'translateY(0)';
    }, 50);
  }, 400);
}

// TYPEWRITER Splash Screen Logic
const titleText = "Happy Girlfriend's Day, yayang! 💕";
const subtitleText = "I hope you like this little gift I prepared for you...";
const VOLUME_WARNING_DURATION = 3000; // 3 seconds (change this number anytime!)

function handleReady(isReady, event) {
  if (!isReady) {
    switchScreen('promptScreen', 'waitScreen');
    return;
  }

  // 1. Trigger Burst of Love Emojis
  if (event) {
    createEmojiBurst(event.clientX || window.innerWidth / 2, event.clientY || window.innerHeight / 2);
  }

  const promptScreen = document.getElementById('promptScreen');
  const volWarning = document.getElementById('volumeWarning');

  // 2. Hide Prompt Screen Immediately so ONLY the Volume Warning shows
  if (promptScreen) {
    promptScreen.style.opacity = '0';
    promptScreen.style.transform = 'translateY(-15px)';
    setTimeout(() => promptScreen.classList.add('hidden'), 400);
  }

  // Start background falling emojis right away for a nice visual ambiance
  startFallingEmojis();

  // 3. Show Centered Volume Warning
  if (volWarning) {
    volWarning.classList.remove('hidden');
    setTimeout(() => volWarning.classList.add('show'), 50);

    // 4. Wait for the adjustable duration before opening the Typewriter Splash Screen
    setTimeout(() => {
      // Fade out volume badge
      volWarning.classList.remove('show');
      
      setTimeout(() => {
        volWarning.classList.add('hidden');
        
        // NOW reveal the Typewriter Splash Screen & start music
        const splashScreen = document.getElementById('splashScreen');
        splashScreen.classList.remove('hidden');
        
        setTimeout(() => {
          splashScreen.style.opacity = '1';
          splashScreen.style.transform = 'translateY(0)';
          
          musicToggle.classList.remove('hidden');
          music.play().then(() => {
            musicToggle.innerText = '🎵 Pause Music';
          }).catch(err => {
            console.log("Autoplay waiting for interaction:", err);
          });

          startTypewriterIntro();
        }, 50);

      }, 400); // Smooth fade-out delay
    }, VOLUME_WARNING_DURATION);
  }
}

function startTypewriterIntro() {
  const titleElem = document.getElementById('splashTitle');
  const subElem = document.getElementById('splashSubtitle');
  const continueBtn = document.getElementById('splashContinueBtn');

  titleElem.innerText = '';
  subElem.innerText = '';
  titleElem.classList.add('typing-cursor');

  let titleIndex = 0;
  let subIndex = 0;

  // Step 1: Type Title
  function typeTitle() {
    if (titleIndex < titleText.length) {
      titleElem.innerText += titleText.charAt(titleIndex);
      titleIndex++;
      setTimeout(typeTitle, 55); // Typing speed
    } else {
      titleElem.classList.remove('typing-cursor');
      subElem.classList.add('typing-cursor');
      setTimeout(typeSubtitle, 300);
    }
  }

  // Step 2: Type Subtitle
  function typeSubtitle() {
    if (subIndex < subtitleText.length) {
      subElem.innerText += subtitleText.charAt(subIndex);
      subIndex++;
      setTimeout(typeSubtitle, 45);
    } else {
      subElem.classList.remove('typing-cursor');
      // Step 3: Reveal Continue Button
      if (continueBtn) continueBtn.classList.remove('hidden');
    }
  }

  typeTitle();
}

// Transition from Splash Intro to Main Dashboard with Entrance Animations
function transitionToDashboard() {
  const splashContent = document.querySelector('.splash-content');
  const mainScreen = document.getElementById('mainScreen');

  // Step 1: Trigger Splash Title slide-up & fade-out
  if (splashContent) {
    splashContent.classList.add('sliding-up');
  }

  // Step 2: Switch to main screen and trigger header slide-down & dashboard slide-up
  setTimeout(() => {
    switchScreen('splashScreen', 'mainScreen', () => {
      if (mainScreen) {
        mainScreen.classList.add('active-screen');
      }
    });
  }, 450);
}

function backToPrompt() {
  switchScreen('waitScreen', 'promptScreen');
}

function toggleMusic() {
  if (music.paused) {
    music.play();
    musicToggle.innerText = '🎵 Pause Music';
  } else {
    music.pause();
    musicToggle.innerText = '🔇 Play Music';
  }
}

function createEmojiBurst(startX, startY) {
  const particleCount = 35;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'burst-particle';
    particle.innerText = emojis[Math.floor(Math.random() * emojis.length)];

    const angle = Math.random() * Math.PI * 2;
    const velocity = 80 + Math.random() * 160;
    const tx = Math.cos(angle) * velocity + 'px';
    const ty = Math.sin(angle) * velocity + 'px';
    const rot = (Math.random() - 0.5) * 360 + 'deg';

    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    particle.style.setProperty('--tx', tx);
    particle.style.setProperty('--ty', ty);
    particle.style.setProperty('--rot', rot);

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 1200);
  }
}

let rainInterval = null;

function startFallingEmojis() {
  if (rainInterval) return;

  const container = document.getElementById('emojiBg');

  rainInterval = setInterval(() => {
    const emojiElem = document.createElement('div');
    emojiElem.className = 'falling-emoji';
    emojiElem.innerText = emojis[Math.floor(Math.random() * emojis.length)];

    const leftPos = Math.random() * 100;
    const duration = 4 + Math.random() * 4;
    const size = 0.9 + Math.random() * 0.6;

    emojiElem.style.left = leftPos + 'vw';
    emojiElem.style.setProperty('--duration', duration + 's');
    emojiElem.style.fontSize = size + 'rem';

    container.appendChild(emojiElem);

    setTimeout(() => emojiElem.remove(), duration * 1000);
  }, 400);
}

// Accordion Toggle (Only One Module Open at a Time)
function toggleModule(moduleId) {
  const targetModule = document.getElementById(moduleId);
  const allModules = document.querySelectorAll('.module-card');

  if (targetModule) {
    const isAlreadyOpen = targetModule.classList.contains('open');

    // Close all other accordion cards
    allModules.forEach(mod => {
      mod.classList.remove('open');
    });

    // Toggle the target card (if it wasn't open already)
    if (!isAlreadyOpen) {
      targetModule.classList.add('open');
    }
  }
}

// Letter Modal State Machine Controls
function openLetterModal() {
  const modal = document.getElementById('letterModal');
  const envelope = document.getElementById('videoEnvelope');
  const hint = document.getElementById('envelopeHint');
  const putAwayBtn = document.getElementById('putAwayBtn');

  if (envelope) {
    envelope.classList.remove('opened', 'enlarged');
  }
  if (hint) {
    hint.innerText = "Tap the envelope to open 💌";
    hint.style.opacity = '1';
  }
  if (putAwayBtn) putAwayBtn.classList.add('hidden');

  document.body.classList.add('modal-open');
  modal.classList.remove('hidden');
  setTimeout(() => modal.classList.add('active'), 10);
}

function handleEnvelopeClick(e) {
  if (e) e.stopPropagation();
  const envelope = document.getElementById('videoEnvelope');
  const hint = document.getElementById('envelopeHint');

  if (envelope && !envelope.classList.contains('opened')) {
    envelope.classList.add('opened');
    if (hint) hint.innerText = "Tap letter to enlarge ✨";
  }
}

function enlargeLetter(e) {
  if (e) e.stopPropagation();
  const envelope = document.getElementById('videoEnvelope');
  const hint = document.getElementById('envelopeHint');
  const putAwayBtn = document.getElementById('putAwayBtn');

  if (envelope && envelope.classList.contains('opened')) {
    envelope.classList.add('enlarged');
    if (hint) hint.style.opacity = '0';
    if (putAwayBtn) putAwayBtn.classList.remove('hidden');
  }
}

function putLetterAway(e) {
  if (e) e.stopPropagation();
  const envelope = document.getElementById('videoEnvelope');
  const hint = document.getElementById('envelopeHint');
  const putAwayBtn = document.getElementById('putAwayBtn');

  if (envelope) {
    envelope.classList.remove('enlarged');
    
    setTimeout(() => {
      envelope.classList.remove('opened');
      if (hint) {
        hint.innerText = "Tap the envelope to open 💌";
        hint.style.opacity = '1';
      }
    }, 300);
  }

  if (putAwayBtn) putAwayBtn.classList.add('hidden');
}

function closeLetterModal() {
  const modal = document.getElementById('letterModal');
  const envelope = document.getElementById('videoEnvelope');
  const putAwayBtn = document.getElementById('putAwayBtn');

  document.body.classList.remove('modal-open');
  modal.classList.remove('active');

  setTimeout(() => {
    modal.classList.add('hidden');
    if (envelope) envelope.classList.remove('opened', 'enlarged');
    if (putAwayBtn) putAwayBtn.classList.add('hidden');
  }, 400);
}

// Gallery Carousel Modal Controls
let currentSlide = 0;

function openGalleryModal() {
  const modal = document.getElementById('galleryModal');
  document.body.classList.add('modal-open');
  modal.classList.remove('hidden');
  setTimeout(() => modal.classList.add('active'), 10);
  showSlide(0);
}

function closeGalleryModal() {
  const modal = document.getElementById('galleryModal');
  document.body.classList.remove('modal-open');
  modal.classList.remove('active');
  setTimeout(() => modal.classList.add('hidden'), 400);
}

function showSlide(index) {
  const track = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const counter = document.getElementById('imageCounter');

  if (index >= slides.length) currentSlide = 0;
  else if (index < 0) currentSlide = slides.length - 1;
  else currentSlide = index;

  if (track) {
    track.scrollTo({
      left: track.clientWidth * currentSlide,
      behavior: 'smooth'
    });
  }

  // Update counter text dynamically (e.g., "1 / 3")
  if (counter && slides.length > 0) {
    counter.innerText = `${currentSlide + 1} / ${slides.length}`;
  }
}

function changeSlide(direction) {
  showSlide(currentSlide + direction);
}

function flipCard(card) {
  card.classList.toggle('flipped');
}

const track = document.getElementById('carouselTrack');
let touchStartX = 0;
let touchEndX = 0;

if (track) {
  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
}

function handleSwipe() {
  if (touchStartX - touchEndX > 50) {
    changeSlide(1);
  }
  if (touchEndX - touchStartX > 50) {
    changeSlide(-1);
  }
}

// Reset Everything & Return to Prompt Screen
function restartExperience() {
  const mainScreen = document.getElementById('mainScreen');
  const splashContent = document.querySelector('.splash-content');

  // Reset screen animation classes
  if (mainScreen) mainScreen.classList.remove('active-screen');
  if (splashContent) splashContent.classList.remove('sliding-up');

  // Pause music and reset time
  if (music) {
    music.pause();
    music.currentTime = 0;
  }
  if (musicToggle) {
    musicToggle.classList.add('hidden');
  }

  // Smoothly switch back to Prompt Screen
  switchScreen('mainScreen', 'promptScreen');
}