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
const bgMusic = document.getElementById('bg-music')
const musicIcon = document.getElementById('music-icon')
const musicIconOff = document.getElementById('music-icon-off')
const enterBtn = document.getElementById('enter-btn')
const overlay = document.getElementById('entrance-overlay')

let isPlaying = false

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

  // Play background music (Chopin)
  bgMusic.play().then(() => {
    isPlaying = true;
    musicIcon.style.display = 'block';
    musicIconOff.style.display = 'none';
  }).catch(err => console.log('Autoplay blocked or URL failed:', err));

  enterBtn.classList.add('hide');
  document.getElementById('envelope-flap').classList.add('open');

  setTimeout(() => {
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
  if (isPlaying) {
    bgMusic.pause()
    musicIcon.style.display = 'none'
    musicIconOff.style.display = 'block'
  } else {
    bgMusic.play()
    musicIcon.style.display = 'block'
    musicIconOff.style.display = 'none'
  }
  isPlaying = !isPlaying
  gsap.fromTo(musicToggle, { scale: 0.7 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
})

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
