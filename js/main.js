/* Royal Reception Invitation */

const opening = document.getElementById('invitationOpening');
const envelope = document.getElementById('royalEnvelope');
const openButton = document.getElementById('openInvitation');
const mainInvitation = document.getElementById('mainInvitation');

let invitationOpened = false;

function openInvitation() {
  if (invitationOpened) return;
  invitationOpened = true;

  envelope.classList.add('is-open');
  openButton.disabled = true;

  /* Keep the opening responsive on mobile while allowing the envelope to visibly open. */
  setTimeout(() => {
    opening.classList.add('is-opening');
    mainInvitation.classList.remove('is-locked');
    mainInvitation.classList.add('is-visible');

    setTimeout(() => {
      opening.remove();
    }, 1000);
  }, 1000);
}

/* The wax seal is the only opening control. The instruction below it is visual-only. */
if (openButton) {
  openButton.addEventListener('click', openInvitation);
}

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

/* Heart scratch card
   One coordinate system is used for the larger heart, its hidden content,
   scratch layer, and reveal detection. This prevents clipping and scaling bugs. */
const canvas = document.getElementById('scratchCanvas');
const scratchTip = document.getElementById('scratchTip');

if (canvas) {
  const wrap = canvas.parentElement;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  const width = 440;
  const height = 403;
  canvas.width = width;
  canvas.height = height;

  wrap.style.width = 'min(440px, 96vw)';
  wrap.style.aspectRatio = `${width} / ${height}`;
  wrap.style.margin = '0 auto';
  wrap.style.position = 'relative';

  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.zIndex = '4';

  const revealCanvas = document.createElement('canvas');
  revealCanvas.width = width;
  revealCanvas.height = height;
  revealCanvas.setAttribute('aria-hidden', 'true');
  revealCanvas.style.position = 'absolute';
  revealCanvas.style.inset = '0';
  revealCanvas.style.width = '100%';
  revealCanvas.style.height = '100%';
  revealCanvas.style.pointerEvents = 'none';
  revealCanvas.style.zIndex = '1';
  wrap.insertBefore(revealCanvas, canvas);

  const revealCtx = revealCanvas.getContext('2d');

  function heartPath(context) {
    context.beginPath();
    context.moveTo(width * 0.50, height * 0.94);
    context.bezierCurveTo(width * 0.43, height * 0.87, width * 0.08, height * 0.65, width * 0.08, height * 0.31);
    context.bezierCurveTo(width * 0.08, height * 0.10, width * 0.32, height * 0.04, width * 0.50, height * 0.25);
    context.bezierCurveTo(width * 0.68, height * 0.04, width * 0.92, height * 0.10, width * 0.92, height * 0.31);
    context.bezierCurveTo(width * 0.92, height * 0.65, width * 0.57, height * 0.87, width * 0.50, height * 0.94);
    context.closePath();
  }

  function drawRevealHeart() {
    revealCtx.clearRect(0, 0, width, height);
    revealCtx.save();
    heartPath(revealCtx);
    revealCtx.clip();

    const bg = revealCtx.createRadialGradient(width * 0.5, height * 0.35, 10, width * 0.5, height * 0.55, width * 0.58);
    bg.addColorStop(0, '#184a38');
    bg.addColorStop(0.7, '#0b2a20');
    bg.addColorStop(1, '#06140f');
    revealCtx.fillStyle = bg;
    revealCtx.fillRect(0, 0, width, height);

    revealCtx.textAlign = 'center';
    revealCtx.textBaseline = 'middle';

    revealCtx.fillStyle = '#d4af37';
    revealCtx.font = '600 11px Montserrat, sans-serif';
    revealCtx.fillText('THE RECEPTION', width * 0.50, height * 0.28);

    revealCtx.fillStyle = '#f7e7a9';
    revealCtx.font = '500 17px Cinzel, serif';
    revealCtx.fillText('SUNDAY', width * 0.50, height * 0.39);

    revealCtx.fillStyle = '#ffffff';
    revealCtx.font = '600 25px "Cormorant Garamond", Georgia, serif';
    revealCtx.fillText('13 September 2026', width * 0.50, height * 0.50);

    revealCtx.fillStyle = '#b0c5bc';
    revealCtx.font = '500 13px Montserrat, sans-serif';
    revealCtx.fillText('3:00 PM onwards', width * 0.50, height * 0.61);

    revealCtx.restore();

    revealCtx.save();
    heartPath(revealCtx);
    revealCtx.strokeStyle = 'rgba(212, 175, 55, .55)';
    revealCtx.lineWidth = 1.5;
    revealCtx.stroke();
    revealCtx.restore();
  }

  function drawScratchLayer() {
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    heartPath(ctx);
    ctx.clip();

    const gradient = ctx.createLinearGradient(40, 20, 320, 310);
    gradient.addColorStop(0, '#8f6814');
    gradient.addColorStop(.24, '#fce08a');
    gradient.addColorStop(.50, '#d4af37');
    gradient.addColorStop(.74, '#fbf0b5');
    gradient.addColorStop(1, '#997316');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.16;
    ctx.fillStyle = '#fff3b8';
    for (let y = 15; y < height; y += 18) {
      for (let x = 15; x < width; x += 18) {
        ctx.beginPath();
        ctx.arc(x, y, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = 'rgba(59, 44, 5, .92)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 13px Montserrat, sans-serif';
    ctx.fillText('SCRATCH TO REVEAL', width * 0.50, height * 0.46);
    ctx.font = '600 10px Montserrat, sans-serif';
    ctx.fillText('THE RECEPTION DATE', width * 0.50, height * 0.53);

    ctx.restore();

    ctx.save();
    heartPath(ctx);
    ctx.strokeStyle = 'rgba(252, 224, 138, .85)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  drawRevealHeart();
  drawScratchLayer();

  let scratching = false;
  let revealed = false;
  let lastCheck = 0;
  let activePointerId = null;

  function getPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function scratch(event) {
    if (!scratching || revealed || event.pointerId !== activePointerId) return;

    event.preventDefault();
    const { x, y } = getPoint(event);

    ctx.save();
    heartPath(ctx);
    ctx.clip();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const now = performance.now();
    if (now - lastCheck > 200) {
      lastCheck = now;
      checkReveal();
    }
  }

  function startScratch(event) {
    if (revealed || scratching) return;

    scratching = true;
    activePointerId = event.pointerId;

    canvas.setPointerCapture(event.pointerId);
    event.preventDefault();
    scratch(event);
  }

  function stopScratch(event) {
    if (activePointerId !== null && event.pointerId !== activePointerId) return;

    scratching = false;

    if (activePointerId !== null && canvas.hasPointerCapture(activePointerId)) {
      canvas.releasePointerCapture(activePointerId);
    }

    activePointerId = null;
  }

  function checkReveal() {
    const pixels = ctx.getImageData(0, 0, width, height).data;
    let transparent = 0;
    let sampled = 0;

    for (let y = 55; y < 385; y += 6) {
      for (let x = 35; x < 405; x += 6) {
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
    scratching = false;

    ctx.clearRect(0, 0, width, height);
    scratchTip.textContent = 'The date is revealed';

    /* No navigation or automatic section scrolling is performed. */
    launchConfetti();
  }

  canvas.addEventListener('pointerdown', startScratch, { passive: false });
  canvas.addEventListener('pointermove', scratch, { passive: false });
  canvas.addEventListener('pointerup', stopScratch, { passive: false });
  canvas.addEventListener('pointercancel', stopScratch, { passive: false });
  canvas.addEventListener('lostpointercapture', () => {
    scratching = false;
    activePointerId = null;
  });

  canvas.addEventListener('touchstart', event => event.preventDefault(), { passive: false });
  canvas.addEventListener('touchmove', event => event.preventDefault(), { passive: false });
  canvas.addEventListener('touchend', event => event.preventDefault(), { passive: false });
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
