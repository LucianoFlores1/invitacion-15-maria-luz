import './style.css'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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

// Parallax background sync
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
  // Increase particles heavily for the juicy feel requested
  const numParticles = 40; 

  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random size and position
    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    container.appendChild(particle);

    // Bouncy, organic floating animation
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

  // "Juicy" bouncy entrance
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

// Initialize immediately (No Loader)
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  playJuicyHeroAnimation();
});

// Juicy Scroll Triggered Animations for all sections
gsap.utils.toArray('.stagger-item').forEach(item => {
  gsap.fromTo(item, 
    { y: 80, opacity: 0, scale: 0.9 },
    {
      y: 0, opacity: 1, scale: 1,
      duration: 1,
      ease: 'elastic.out(1, 0.75)',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
      }
    }
  )
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
// Spotify Interaction Logic
// ----------------------------------------------------
const songInput = document.getElementById('song-input')
const suggestBtn = document.getElementById('suggest-btn')
const toast = document.getElementById('toast')
let toastTimeout;

suggestBtn.addEventListener('click', () => {
  const song = songInput.value.trim()
  if (!song) {
    // Juicy error shake
    gsap.to(songInput, { x: [-10, 10, -8, 8, -5, 5, 0], duration: 0.5, ease: 'power2.inOut' })
    return
  }
  suggestBtn.innerHTML = '¡Enviada!'
  // Juicy success bounce
  gsap.to(suggestBtn, {
    scale: 0.8, yoyo: true, repeat: 1, duration: 0.15, ease: 'power2.out',
    onComplete: () => {
      toast.classList.add('show')
      clearTimeout(toastTimeout)
      toastTimeout = setTimeout(() => {
        toast.classList.remove('show')
        suggestBtn.innerHTML = 'Sugerir'
        songInput.value = ''
      }, 3000)
    }
  })
})

songInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') suggestBtn.click()
})

// ----------------------------------------------------
// Background Music Logic
// ----------------------------------------------------
const musicToggle = document.getElementById('music-toggle')
const bgMusic = document.getElementById('bg-music')
const musicIcon = document.getElementById('music-icon')
const musicIconOff = document.getElementById('music-icon-off')

let isPlaying = false

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
