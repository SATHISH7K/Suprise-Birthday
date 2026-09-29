// Confetti and celebratory particle emitter utility for OurMoments

export function fireConfetti(originX?: number, originY?: number, count = 28) {
  const container = document.body;
  if (!container) return;

  const colors = ['#FB923C', '#F43F5E', '#F59E0B', '#ffdad3', '#ffc329', '#a93349'];
  const emojis = ['✨', '💖', '🎉', '🌟', '🌸', '🎈'];

  const startX = originX ?? window.innerWidth / 2;
  const startY = originY ?? window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const isEmoji = Math.random() > 0.65;

    el.className = 'fixed pointer-events-none z-[9999] transition-all duration-1000 ease-out';
    el.style.left = `${startX}px`;
    el.style.top = `${startY}px`;

    if (isEmoji) {
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.fontSize = `${12 + Math.random() * 14}px`;
    } else {
      const size = 6 + Math.random() * 8;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.borderRadius = Math.random() > 0.4 ? '9999px' : '2px';
    }

    container.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const velocity = 60 + Math.random() * 160;
    const targetX = Math.cos(angle) * velocity;
    const targetY = Math.sin(angle) * velocity - 40;
    const rotation = (Math.random() - 0.5) * 720;

    requestAnimationFrame(() => {
      el.style.transform = `translate(${targetX}px, ${targetY}px) rotate(${rotation}deg) scale(${0.4 + Math.random() * 0.8})`;
      el.style.opacity = '0';
    });

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1100);
  }
}
