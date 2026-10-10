import './style.css'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// ----------------------------------------------------
// Smooth Scroll
// ----------------------------------------------------
const lenis = new Lenis({
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

lenis.stop();

lenis.on('scroll', (e) => {
  const scrolled = e.scroll;
  gsap.to('.hero-image-container', {
    y: scrolled * 0.4,
    ease: 'none',
    duration: 0
  });
});

// ----------------------------------------------------
// High-Performance Particles
// ----------------------------------------------------
function createParticles() {
  const container = document.getElementById('particles-container');
  const numParticles = 40; 

  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    container.appendChild(particle);

    gsap.to(particle, {
      y: `random(-150, 150)`,
      x: `random(-80, 80)`,
      opacity: `random(0.1, 0.9)`,
      duration: `random(4, 12)`,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }
}

// ----------------------------------------------------
// Juicy GSAP Entrance Animations
// ----------------------------------------------------
function playJuicyHeroAnimation() {
  const tl = gsap.timeline();

  tl.fromTo('.hero-image-container', 
    { scale: 1.2, opacity: 0 }, 
    { scale: 1, opacity: 1, duration: 1.5, ease: 'expo.out' }
  )
  .fromTo('.hero-glass-pill', 
    { y: -30, opacity: 0, scale: 0.5 }, 
    { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'elastic.out(1, 0.5)' }, '-=1'
  )
  .fromTo('.hero-name', 
    { y: 50, opacity: 0, scale: 0.8 }, 
    { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.6)' }, '-=0.8'
  )
  .fromTo('.hero-date-box', 
    { y: 30, opacity: 0, rotation: -5 }, 
    { y: 0, opacity: 1, rotation: 0, duration: 1, ease: 'elastic.out(1, 0.5)' }, '-=1'
  )
  .fromTo('.scroll-indicator', 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5'
  );
}

gsap.utils.toArray('.stagger-item').forEach(item => {
  gsap.fromTo(item, 
    { y: 60, opacity: 0, scale: 0.95 },
    {
      y: 0, opacity: 1, scale: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
      }
    }
  )
})

// ----------------------------------------------------
// Sound Feedback & Entrance Overlay Logic
// ----------------------------------------------------
const musicToggle = document.getElementById('music-toggle')
const musicIcon = document.getElementById('music-icon')
const musicIconOff = document.getElementById('music-icon-off')
const enterBtn = document.getElementById('enter-btn')
const overlay = document.getElementById('entrance-overlay')

let isPlaying = false
let ytPlayer = null;

window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('youtube-player', {
    height: '0',
    width: '0',
    videoId: 'x1WJ22hHk48', // Tiempo de Vals - Chayanne
    playerVars: { 'autoplay': 0, 'controls': 0, 'playsinline': 1, 'loop': 1, 'playlist': 'x1WJ22hHk48' }
  });
};

// Synthesize a magical chime sound effect offline using AudioContext
function playMagicChime() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  
  // Play a C Major 9 arpeggio for a magical sound
  const notes = [523.25, 659.25, 783.99, 987.77, 1174.66]; // C5, E5, G5, B5, D6
  
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const startTime = ctx.currentTime + (index * 0.08);
    osc.start(startTime);
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5);
    
    osc.stop(startTime + 1.5);
  });
}

enterBtn.addEventListener('click', () => {
  // Play the synthesized magic sound
  playMagicChime();

  // Play YouTube background music (Tiempo de Vals)
  if (ytPlayer && ytPlayer.playVideo) {
    ytPlayer.playVideo();
    isPlaying = true;
    musicIcon.style.display = 'block';
    musicIconOff.style.display = 'none';
  }

  enterBtn.classList.add('hide');
  document.getElementById('envelope-flap').classList.add('open');

  setTimeout(() => {
    document.querySelector('.envelope-container').style.display = 'none';
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    document.body.style.overflow = 'auto'; 
    lenis.start();
    
    window.scrollTo(0,0);
    createParticles();
    playJuicyHeroAnimation();
  }, 1200);
})

musicToggle.addEventListener('click', () => {
  if (!ytPlayer || !ytPlayer.playVideo) return;
  
  if (isPlaying) {
    ytPlayer.pauseVideo();
    musicIcon.style.display = 'none';
    musicIconOff.style.display = 'block';
  } else {
    ytPlayer.playVideo();
    musicIcon.style.display = 'block';
    musicIconOff.style.display = 'none';
  }
  isPlaying = !isPlaying;
  gsap.fromTo(musicToggle, { scale: 0.7 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
});

// ----------------------------------------------------
// Countdown Logic
// ----------------------------------------------------
const countdownDate = new Date("Oct 24, 2026 21:30:00").getTime();
const x = setInterval(function() {
  const now = new Date().getTime();
  const distance = countdownDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerHTML = days < 10 ? "0" + days : days;
  document.getElementById("hours").innerHTML = hours < 10 ? "0" + hours : hours;
  document.getElementById("minutes").innerHTML = minutes < 10 ? "0" + minutes : minutes;
  document.getElementById("seconds").innerHTML = seconds < 10 ? "0" + seconds : seconds;

  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = "<h3 style='color:#d4af37; font-family: Playfair Display'>¡Es hoy!</h3>";
  }
}, 1000);

// ----------------------------------------------------
// Copy Alias Logic
// ----------------------------------------------------
const copyAliasBtn = document.getElementById('copy-alias-btn')
const toast = document.getElementById('toast')
let toastTimeout;

if (copyAliasBtn) {
  copyAliasBtn.addEventListener('click', () => {
    navigator.clipboard.writeText("maria.658.1822").then(() => {
      copyAliasBtn.innerHTML = '<i class="ph-bold ph-check"></i> ¡Copiado!'
      gsap.to(copyAliasBtn, {
        scale: 0.8, yoyo: true, repeat: 1, duration: 0.15, ease: 'power2.out',
        onComplete: () => {
          toast.classList.add('show')
          clearTimeout(toastTimeout)
          toastTimeout = setTimeout(() => {
            toast.classList.remove('show')
            copyAliasBtn.innerHTML = '<i class="ph-bold ph-copy"></i> Copiar Alias'
          }, 3000)
        }
      })
    })
  })
}

// ----------------------------------------------------
// RSVP Form Logic
// ----------------------------------------------------
const rsvpForm = document.getElementById('rsvp-form');
const rsvpSuccess = document.getElementById('rsvp-success');
const btnMinus = document.getElementById('btn-minus');
const btnPlus = document.getElementById('btn-plus');
const countDisplay = document.getElementById('rsvp-count');
const inputNombre = document.getElementById('rsvp-nombre');
const inputMensaje = document.getElementById('rsvp-mensaje');
const errorMsg = document.getElementById('rsvp-error');
const btnEdit = document.getElementById('btn-edit-rsvp');

if (rsvpForm) {
  let personasCount = 1;

  btnMinus.addEventListener('click', () => {
    if (personasCount > 1) {
      personasCount--;
      countDisplay.textContent = personasCount;
      if (personasCount === 1) btnMinus.disabled = true;
      btnPlus.disabled = false;
      gsap.fromTo(countDisplay, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' });
    }
  });

  btnPlus.addEventListener('click', () => {
    if (personasCount < 10) {
      personasCount++;
      countDisplay.textContent = personasCount;
      btnMinus.disabled = false;
      if (personasCount === 10) btnPlus.disabled = true;
      gsap.fromTo(countDisplay, { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' });
    }
  });

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = inputNombre.value.trim();
    if (nombre.length < 2) {
      errorMsg.textContent = 'Contanos tu nombre para saber quién confirma.';
      inputNombre.classList.add('error');
      gsap.fromTo(inputNombre, { x: -8 }, { x: 8, yoyo: true, repeat: 3, duration: 0.08, ease: 'power1.inOut' });
      return;
    }
    errorMsg.textContent = '';
    inputNombre.classList.remove('error');

    let mensajeTexto = `¡Hola! Soy ${nombre} y confirmo mi asistencia a los XV de María Luz.\nPersonas: ${personasCount}`;
    const mensajeExtra = inputMensaje.value.trim();
    if (mensajeExtra) {
      mensajeTexto += `\n\nMensaje para María Luz: ${mensajeExtra}`;
    }

    window.open(`https://wa.me/5493874824080?text=${encodeURIComponent(mensajeTexto)}`, '_blank', 'noopener');
    
    // Confetti
    import('canvas-confetti').then((confetti) => {
      const opts = { particleCount: 110, spread: 80, startVelocity: 50, colors: ['#1d44c4', '#4f7cf0', '#9dbcff', '#ffffff', '#c9d8ff'], shapes: ['star', 'circle'], disableForReducedMotion: true, zIndex: 10000 };
      confetti.default({ ...opts, angle: 60, origin: { x: 0, y: 0.85 } });
      confetti.default({ ...opts, angle: 120, origin: { x: 1, y: 0.85 } });
    });

    gsap.to(rsvpForm, { opacity: 0, height: 0, duration: 0.4, onComplete: () => {
      rsvpForm.style.display = 'none';
      rsvpSuccess.style.display = 'block';
      gsap.fromTo(rsvpSuccess, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' });
    }});
  });

  btnEdit.addEventListener('click', () => {
    gsap.to(rsvpSuccess, { opacity: 0, height: 0, duration: 0.3, onComplete: () => {
      rsvpSuccess.style.display = 'none';
      rsvpForm.style.display = 'flex';
      gsap.fromTo(rsvpForm, { opacity: 0, height: 0 }, { opacity: 1, height: 'auto', duration: 0.4 });
    }});
  });
}
