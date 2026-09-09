/* =========================================================
   FUTURE AWAITS CAMEROON (FAC) — script.js
   Menu mobile + validation de formulaire + succès animé
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Menu mobile ---------------- */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.classList.toggle('is-active', isOpen);
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- Validation du formulaire ---------------- */
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successMsg = document.getElementById('success-msg');

  const fields = {
    name:    { el: document.getElementById('name'),    test: v => v.trim().length >= 2 },
    email:   { el: document.getElementById('email'),   test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
    phone:   { el: document.getElementById('phone'),   test: v => /^[0-9\s]{8,9}$/.test(v.trim()) },
    subject: { el: document.getElementById('subject'), test: v => v.trim().length >= 3 },
    message: { el: document.getElementById('message'), test: v => v.trim().length >= 10 }
  };

  function setFieldState(name, isValid) {
    const row = fields[name].el.closest('.form-row');
    if (!row) return;
    row.classList.toggle('has-error', !isValid);
  }

  // Validation en direct dès que l'utilisateur quitte un champ
  Object.keys(fields).forEach(name => {
    const { el } = fields[name];
    el.addEventListener('blur', () => {
      if (el.value.trim() !== '') {
        setFieldState(name, fields[name].test(el.value));
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    Object.keys(fields).forEach(name => {
      const { el, test } = fields[name];
      const valid = test(el.value);
      setFieldState(name, valid);
      if (!valid) allValid = false;
    });

    if (!allValid) {
      successMsg.classList.remove('is-visible');
      const firstError = form.querySelector('.form-row.has-error input, .form-row.has-error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // Confirmation locale (aucun backend requis)
    const submitBtn = form.querySelector('.btn-submit');
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours…';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      form.reset();
      Object.keys(fields).forEach(name => setFieldState(name, true));

      successMsg.classList.remove('is-error');
      successMsg.classList.add('is-visible');
      setTimeout(() => successMsg.classList.remove('is-visible'), 5000);
    }, 600);
  });

});
