const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));

    if (!expanded) {
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '4.5rem';
      nav.style.right = '0';
      nav.style.padding = '1rem';
      nav.style.background = 'rgba(7,17,31,0.95)';
      nav.style.border = '1px solid rgba(255,255,255,0.16)';
      nav.style.borderRadius = '16px';
    } else {
      nav.removeAttribute('style');
    }
  });
}

window.addEventListener('resize', () => {
  if (window.innerWidth >= 700 && nav) {
    nav.removeAttribute('style');
  }
});
