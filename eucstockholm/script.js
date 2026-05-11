/* ============================================================
   EUC Stockholm – interactions
   ============================================================ */

// ----- Sticky nav -----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ----- Mobile burger -----
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  });
});

// ----- Scroll fade-in -----
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);

document.querySelectorAll(
  '.feature, .badge, .visual-card, .faq__item, .gallery__item, .pricing__card, .pricing__aside, .honest-box'
).forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// ----- Contact form → mailto -----
// UPDATE EMAIL: Change the address below when you have your eucstockholm.com email.
const CONTACT_EMAIL = 'peter.jaaskelainen@gmail.com';

const form = document.getElementById('contactForm');
form.addEventListener('submit', e => {
  e.preventDefault();

  const name         = form.name.value.trim();
  const company      = form.company.value.trim();
  const email        = form.email.value.trim();
  const phone        = form.phone.value.trim();
  const participants = form.participants.value;
  const message      = form.message.value.trim();

  const subject = encodeURIComponent(`Bokningsförfrågan – EUC Stockholm (${name})`);

  const body = encodeURIComponent(
`Ny bokningsförfrågan från eucstockholm.com

Namn:           ${name}
Företag:        ${company || '–'}
E-post:         ${email}
Telefon:        ${phone || '–'}
Antal deltagare: ${participants}

Meddelande:
${message || '–'}
`
  );

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});
