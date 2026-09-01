/* Royal Reception Invitation */

const opening = document.getElementById('invitationOpening');
const envelope = document.getElementById('royalEnvelope');
const openButton = document.getElementById('openInvitation');
const mainInvitation = document.getElementById('mainInvitation');

openButton.addEventListener('click', () => {
  envelope.classList.add('is-open');
  openButton.disabled = true;

  setTimeout(() => {
    opening.classList.add('is-opening');
    mainInvitation.classList.remove('is-locked');
    mainInvitation.classList.add('is-visible');

    setTimeout(() => {
      opening.remove();
    }, 1000);
  }, 1250);
});

/* Scroll reveal */
const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

revealItems.forEach(item => revealObserver.observe(item));

/* Heart scratch card */
const canvas = document.getElementById('scratchCanvas');
const scratchTip = document.getElementById('scratchTip');
const dateReveal = document.getElementById('dateReveal');

if (canvas) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const width = 290;
  const height = 270;

  canvas.width = width;
  canvas.height = height;

  function heartPath(context) {
    context.beginPath();
    context.moveTo(145, 250);
    context.bezierCurveTo(125, 230, 30, 166, 30, 91);
    context.bezierCurveTo(30, 44, 85, 25, 117, 61);
    context.lineTo(145, 91);
    context.lineTo(173, 61);
    context.bezierCurveTo(205, 25, 260, 44, 260, 91);
    context.bezierCurveTo(260, 166, 165, 230, 145, 250);
    context.closePath();
  }

  function drawScratchLayer() {
    ctx.clearRect(0, 0, width, height);

    heartPath(ctx);
    ctx.save();
    ctx.clip();

    const gradient = ctx.createLinearGradient(25, 20, 260, 245);
    gradient.addColorStop(0, '#8f6814');
    gradient.addColorStop(.28, '#fce08a');
    gradient.addColorStop(.5, '#d4af37');
    gradient.addColorStop(.75, '#fbf0b5');
    gradient.addColorStop(1, '#997316');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(59, 44, 5, .9)';
    ctx.font = '600 12px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH TO REVEAL', 145, 116);

    ctx.font = '600 10px Montserrat, sans-serif';
    ctx.fillText('THE RECEPTION DATE', 145, 138);

    ctx.restore();

    /* Royal outline */
    ctx.save();
    heartPath(ctx);
    ctx.strokeStyle = 'rgba(252, 224, 138, .75)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  drawScratchLayer();

  let scratching = false;
  let revealed = false;
  let lastCheck = 0;

  function getPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const source = event.touches ? event.touches[0] : event;

    return {
      x: (source.clientX - rect.left) * (canvas.width / rect.width),
      y: (source.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function scratch(event) {
    if (!scratching || revealed) return;

    event.preventDefault();
    const { x, y } = getPoint(event);

    ctx.save();
    heartPath(ctx);
    ctx.clip();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const now = performance.now();
    if (now - lastCheck > 250) {
      lastCheck = now;
      checkReveal();
    }
  }

  function startScratch(event) {
    if (revealed) return;
    scratching = true;
    scratch(event);
  }

  function stopScratch() {
    scratching = false;
  }

  function checkReveal() {
    const pixels = ctx.getImageData(0, 0, width, height).data;
    let transparent = 0;
    let sampled = 0;

    for (let y = 35; y < 250; y += 5) {
      for (let x = 30; x < 260; x += 5) {
        const index = (y * width + x) * 4;
        sampled++;
        if (pixels[index + 3] < 80) transparent++;
      }
    }

    if (transparent / sampled > 0.55) {
      revealDate();
    }
  }

  function revealDate() {
    if (revealed) return;
    revealed = true;

    ctx.clearRect(0, 0, width, height);
    scratchTip.textContent = 'The date is revealed';
    dateReveal.classList.add('is-revealed');

    launchConfetti();
    dateReveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  canvas.addEventListener('pointerdown', startScratch);
  canvas.addEventListener('pointermove', scratch);
  window.addEventListener('pointerup', stopScratch);
}

/* Confetti celebration */
function launchConfetti() {
  const pieces = 90;
  const symbols = ['✦', '◆', '•', '❦'];

  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.textContent = symbols[i % symbols.length];

    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.fontSize = `${8 + Math.random() * 10}px`;
    piece.style.animationDuration = `${2.4 + Math.random() * 2.4}s`;
    piece.style.setProperty('--drift', `${-100 + Math.random() * 200}px`);
    piece.style.setProperty('--rotation', `${360 + Math.random() * 720}deg`);

    /* Use the existing royal palette without introducing a new theme. */
    piece.style.color = i % 3 === 0 ? '#fce08a' : (i % 3 === 1 ? '#d4af37' : '#f7e7a9');

    document.body.appendChild(piece);

    setTimeout(() => piece.remove(), 5200);
  }
}

/* Reception countdown: 13 September 2026, 3:00 PM local time */
const receptionDate = new Date(2026, 8, 13, 15, 0, 0).getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = receptionDate - now;

  const dEl = document.getElementById('days');
  const hEl = document.getElementById('hours');
  const mEl = document.getElementById('mins');
  const sEl = document.getElementById('secs');

  if (!dEl || !hEl || !mEl || !sEl) return;

  if (diff <= 0) {
    dEl.textContent = '00';
    hEl.textContent = '00';
    mEl.textContent = '00';
    sEl.textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  dEl.textContent = String(days).padStart(2, '0');
  hEl.textContent = String(hours).padStart(2, '0');
  mEl.textContent = String(minutes).padStart(2, '0');
  sEl.textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);
