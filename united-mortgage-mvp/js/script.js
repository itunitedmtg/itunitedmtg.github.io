const reveals = document.querySelectorAll('.reveal');
const revealCards = document.querySelectorAll('.reveal-card');
const cards = document.querySelectorAll('.cards .card');

const revealOnScroll = () => {
  const windowHeight = window.innerHeight;
  const revealPoint = 150;

  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - revealPoint) el.classList.add('reveal-active');
  });

  revealCards.forEach(card => {
    const top = card.getBoundingClientRect().top;
    const delay = Number(card.dataset.delay || 0);
    if (top < windowHeight - revealPoint) {
      setTimeout(() => card.classList.add('reveal-active'), delay);
    }
  });

  cards.forEach((card, idx) => {
    const top = card.getBoundingClientRect().top;
    if (top < windowHeight - revealPoint) {
      setTimeout(() => card.classList.add('card-active'), 200 + idx * 320);
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);