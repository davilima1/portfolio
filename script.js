// Minimal interactivity: nav switching + sidebar expand + skill animation
document.addEventListener('DOMContentLoaded', () => {
  // NAV links
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const pages = document.querySelectorAll('.page');

  navLinks.forEach(btn => {
    btn.addEventListener('click', () => {
      navLinks.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.target;
      pages.forEach(p => {
        if (p.dataset.page === target) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });

      // trigger skill bars when opening resume
      if (target === 'resume') animateSkills();
    });
  });

  // sidebar show contacts
  const sidebarBtn = document.querySelector('[data-sidebar-btn]');
  const sidebarMore = document.querySelector('.sidebar-info_more');
  sidebarBtn.addEventListener('click', () => {
    const expanded = sidebarBtn.getAttribute('aria-expanded') === 'true';
    sidebarBtn.setAttribute('aria-expanded', String(!expanded));
    if (expanded) {
      sidebarMore.hidden = true;
      sidebarBtn.querySelector('.chev').style.transform = 'rotate(0deg)';
    } else {
      sidebarMore.hidden = false;
      sidebarBtn.querySelector('.chev').style.transform = 'rotate(180deg)';
    }
  });

  // skill animation
  function animateSkills() {
    const fills = document.querySelectorAll('.skill-progress-fill');
    fills.forEach(fill => {
      const width = fill.style.width || '0%';
      // animate to the width already set in style attribute
      fill.style.width = '0';
      setTimeout(() => fill.style.width = width, 30);
    });
  }

  // initial animate if resume active on load
  const activePage = document.querySelector('.page.active');
  if (activePage && activePage.dataset.page === 'resume') animateSkills();

  // simple project click example (pulse)
  document.querySelectorAll('[data-project="pulsemind"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      alert('PulseMind — MVP em desenvolvimento. Repositório: https://github.com/davilima1 (adicione mais infos no README).');
    });
  });
});
