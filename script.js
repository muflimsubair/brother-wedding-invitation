/* =====================================================
   MARZOOK & LUBNA WEDDING — script.js
===================================================== */

(function () {
  'use strict';

  /* -------------------------------------------------------
     PETALS
  ------------------------------------------------------- */
  const PETAL_COLORS = [
    'rgba(201,168,76,0.8)',
    'rgba(240,204,106,0.7)',
    'rgba(180,0,0,0.6)',
    'rgba(255,200,100,0.65)',
    'rgba(220,150,60,0.55)',
  ];

  function createPetal() {
    const el = document.createElement('div');
    el.classList.add('petal');
    const size = 6 + Math.random() * 12;
    el.style.cssText = `
      left: ${Math.random() * 110 - 5}%;
      width: ${size}px;
      height: ${size}px;
      background: ${PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]};
      animation-duration: ${6 + Math.random() * 10}s;
      animation-delay: ${Math.random() * 8}s;
      border-radius: ${Math.random() > 0.5 ? '50% 0 50% 0' : '50% 50% 0 50%'};
      filter: blur(${Math.random() > 0.6 ? 1 : 0}px);
    `;
    return el;
  }

  const petalsContainer = document.getElementById('petals-container');
  const PETAL_COUNT = 30;
  for (let i = 0; i < PETAL_COUNT; i++) {
    petalsContainer.appendChild(createPetal());
  }

  /* -------------------------------------------------------
     ENVELOPE OPEN SEQUENCE
  ------------------------------------------------------- */
  const envelope      = document.getElementById('envelope');
  const flapTop       = document.getElementById('env-flap-top');
  const cardPeek      = document.getElementById('card-peek');
  const clickHint     = document.getElementById('click-hint');
  const envelopeScene = document.getElementById('envelope-scene');
  const cardScene     = document.getElementById('card-scene');
  const invitationCard = document.getElementById('invitation-card');

  let opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;

    // 1. Hide hint
    clickHint.style.opacity = '0';
    clickHint.style.pointerEvents = 'none';

    // 2. Lift envelope slightly
    envelope.style.transition = 'transform 0.4s ease, filter 0.4s ease';
    envelope.style.transform = 'translateY(-12px) scale(1.03)';
    envelope.style.filter = 'drop-shadow(0 36px 70px rgba(0,0,0,0.75))';

    // 3. Open top flap
    setTimeout(() => {
      flapTop.classList.add('open');
    }, 300);

    // 4. Card peek rises
    setTimeout(() => {
      cardPeek.classList.add('peeking');
    }, 900);

    // 5. Transition to card scene
    setTimeout(() => {
      // Fade out envelope scene
      envelopeScene.style.transition = 'opacity 0.7s ease';
      envelopeScene.style.opacity = '0';
      envelopeScene.style.pointerEvents = 'none';

      // Show card scene
      cardScene.classList.add('active');
      cardScene.removeAttribute('aria-hidden');
      envelopeScene.setAttribute('aria-hidden', 'true');

      // Animate card in
      setTimeout(() => {
        invitationCard.classList.add('visible');
      }, 100);

    }, 1800);
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });

  /* -------------------------------------------------------
     PARALLAX — gentle card movement on mouse move
  ------------------------------------------------------- */
  document.addEventListener('mousemove', (e) => {
    if (!cardScene.classList.contains('active')) return;
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    invitationCard.style.transform =
      `translateY(0) scale(1) rotateX(${-dy * 2.5}deg) rotateY(${dx * 2.5}deg)`;
    invitationCard.style.transition = 'transform 0.15s ease';
  });

  document.addEventListener('mouseleave', () => {
    invitationCard.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
    invitationCard.style.transition = 'transform 0.5s ease';
  });

  /* -------------------------------------------------------
     ENVELOPE WOBBLE on hover (touch devices)
  ------------------------------------------------------- */
  envelope.addEventListener('touchstart', () => {
    if (!opened) {
      envelope.style.transform = 'translateY(-8px) scale(1.02)';
    }
  }, { passive: true });

  envelope.addEventListener('touchend', () => {
    if (!opened) {
      envelope.style.transform = '';
      setTimeout(openEnvelope, 150);
    }
  }, { passive: true });

  /* -------------------------------------------------------
     SPARKLE EFFECT on the invitation card
     Small golden particles that randomly appear
  ------------------------------------------------------- */
  function spawnSparkle(container) {
    const spark = document.createElement('div');
    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 80;
    const size = 3 + Math.random() * 5;

    spark.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, #FFE08A 0%, rgba(201,168,76,0) 70%);
      border-radius: 50%;
      pointer-events: none;
      opacity: 0;
      transform: scale(0);
      animation: sparkleAnim ${0.6 + Math.random() * 0.8}s ease forwards;
      z-index: 10;
    `;

    if (!document.getElementById('sparkle-style')) {
      const st = document.createElement('style');
      st.id = 'sparkle-style';
      st.textContent = `
        @keyframes sparkleAnim {
          0%   { opacity: 0; transform: scale(0); }
          40%  { opacity: 1; transform: scale(1.4); }
          100% { opacity: 0; transform: scale(0.5) translateY(-10px); }
        }
      `;
      document.head.appendChild(st);
    }

    container.appendChild(spark);
    spark.addEventListener('animationend', () => spark.remove());
  }

  // Spawn sparkles periodically once card is visible
  setInterval(() => {
    if (invitationCard.classList.contains('visible')) {
      spawnSparkle(invitationCard);
    }
  }, 600);

})();
