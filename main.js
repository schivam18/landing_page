// Subtle canvas particles and rotating hero copy

const headlines = [
  'Next-gen AI and Machine learning providing analytics and insights (with Human verification) in the Oncology landscape',
  'Cutting the noise and only focusing on the key elements'
];

let idx = 0;
const headlineEl = document.getElementById('heroHeadline');

function rotateCopy(){
  if (!headlineEl) return;
  idx = (idx + 1) % headlines.length;
  headlineEl.style.opacity = '0';
  setTimeout(()=>{
    headlineEl.textContent = headlines[idx];
    headlineEl.style.opacity = '1';
  }, 800);
}
setInterval(rotateCopy, 9000);

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Smooth scrolling with header offset and active state
const EXTRA_GAP_PX = 10; // small gap under header for anchors

function findAnchorTarget(hash){
  const el = document.querySelector(hash);
  if (!el) return null;
  // Prefer headline inside section to avoid top padding gap
  return el.querySelector('h2, h1') || el;
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    // Special-case Home to scroll to very top
    if (href === '#hero'){
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
      this.classList.add('active');
      return;
    }
    const targetEl = findAnchorTarget(href);
    if (!targetEl) return;
    e.preventDefault();
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;
    const top = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - EXTRA_GAP_PX;
    window.scrollTo({ top, behavior: 'smooth' });

    // update active link
    document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
    this.classList.add('active');
  });
});

// Handle on-load and hash changes with same offset
function scrollToHash(hash){
  const targetEl = findAnchorTarget(hash);
  if (!targetEl) return;
  const header = document.querySelector('.site-header');
  const headerHeight = header ? header.offsetHeight : 0;
  const top = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - EXTRA_GAP_PX;
  window.scrollTo({ top, behavior: 'smooth' });
}

window.addEventListener('load', ()=>{
  if (window.location.hash) scrollToHash(window.location.hash);
});

window.addEventListener('hashchange', ()=>{
  if (window.location.hash) scrollToHash(window.location.hash);
});

// IntersectionObserver to highlight nav on scroll
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const sectionObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry =>{
    if (entry.isIntersecting){
      const id = '#' + entry.target.id;
      navLinks.forEach(link =>{
        link.classList.toggle('active', link.getAttribute('href') === id);
      });
    }
  });
},{ rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });
sections.forEach(sec => sectionObserver.observe(sec));

// Canvas particles
const canvas = document.getElementById('dataCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function spawnParticles(count){
  particles = Array.from({length: count}, ()=>({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    z: Math.random()*1+0.2,
    vx: (Math.random()-0.5)*0.3,
    vy: (Math.random()-0.5)*0.3,
    r: Math.random()*1.6+0.3,
    a: Math.random()*0.4+0.2
  }));
}
spawnParticles(Math.min(250, Math.floor((canvas.width*canvas.height)/3000)));

function tick(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (const p of particles){
    p.x += p.vx * p.z;
    p.y += p.vy * p.z;
    if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    // Pull accent color from CSS variable
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#0ea5e9';
    // Convert hex to rgb
    const r = parseInt(accent.slice(1,3),16);
    const g = parseInt(accent.slice(3,5),16);
    const b = parseInt(accent.slice(5,7),16);
    ctx.fillStyle = `rgba(${r},${g},${b},${p.a})`;
    ctx.fill();
  }
  requestAnimationFrame(tick);
}
tick();


