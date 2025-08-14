
// Slide navigation and background orbs with modal controls
let current = 0;
const slides = document.getElementById('slides');
const total = document.querySelectorAll('.slide').length;
const pagination = document.getElementById('pagination');

for (let i=0;i<total;i++){
  const d = document.createElement('div');
  d.className = 'dot' + (i===0? ' active': '');
  d.dataset.index = i;
  d.onclick = ()=> goSlide(i);
  pagination.appendChild(d);
}

function goSlide(i){
  current = Math.max(0, Math.min(total-1, i));
  const x = -current * window.innerWidth;
  slides.style.transform = `translateX(${x}px)`;
  document.querySelectorAll('.dot').forEach((el,idx)=> el.classList.toggle('active', idx===current));
  if (current===1) fillBars();
}

document.addEventListener('keydown', (e)=> {
  if (e.key === 'ArrowRight') goSlide(current+1);
  if (e.key === 'ArrowLeft') goSlide(current-1);
});
window.addEventListener('resize', ()=> { goSlide(current); });

function fillBars(){
  document.querySelectorAll('.fill').forEach(f=> {
    const pct = f.dataset.fill || '60';
    f.style.width = pct + '%';
  });
}

// background canvas orbs
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let orbs = [];
function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);
function rand(min,max){ return Math.random()*(max-min)+min; }
function initOrbs(n=20){
  orbs = [];
  for (let i=0;i<n;i++){
    orbs.push({x:rand(0,canvas.width), y:rand(0,canvas.height), r:rand(8,36), vx:rand(-0.45,0.45), vy:rand(-0.25,0.25), hue:rand(150,320)});
  }
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const g = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
  g.addColorStop(0,'rgba(6,10,20,0.12)');
  g.addColorStop(1,'rgba(6,4,12,0.12)');
  ctx.fillStyle = g; ctx.fillRect(0,0,canvas.width,canvas.height);

  orbs.forEach(o=> {
    o.x += o.vx; o.y += o.vy;
    if (o.x < -50) o.x = canvas.width + 50;
    if (o.x > canvas.width + 50) o.x = -50;
    if (o.y < -50) o.y = canvas.height + 50;
    if (o.y > canvas.height + 50) o.y = -50;
    const grad = ctx.createRadialGradient(o.x,o.y,o.r*0.1, o.x,o.y,o.r*1.5);
    grad.addColorStop(0, `hsla(${o.hue},90%,70%,0.16)`);
    grad.addColorStop(0.6, `hsla(${o.hue},80%,60%,0.06)`);
    grad.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(o.x,o.y,o.r,0,Math.PI*2);
    ctx.fill();
  });
  requestAnimationFrame(draw);
}

initOrbs(22); draw();

// profile modal
function openProfileModal(){
  const modal = document.getElementById('profileModal');
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}
function closeProfileModal(){
  const modal = document.getElementById('profileModal');
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}

// copy email helper
function copyEmail(){
  const email = 'sruthisahu3104@gmail.com';
  if (navigator.clipboard) navigator.clipboard.writeText(email).then(()=> alert('Email copied: ' + email));
  else prompt('Copy email', email);
}

goSlide(0);
