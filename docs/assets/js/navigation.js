/**
 * Lightweight active section observer for right rail & mobile bottom nav
 */
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const railLinks = document.querySelectorAll('.rail-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!sections.length || !('IntersectionObserver' in window)) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const activeSectionMap = new Map();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSectionMap.set(entry.target.id, entry.intersectionRatio);
      } else {
        activeSectionMap.delete(entry.target.id);
      }
    });

    // Find current active section ID
    let currentActiveId = '';
    if (activeSectionMap.size > 0) {
      // Get the first section in DOM order that is currently active
      for (const section of sections) {
        if (activeSectionMap.has(section.id)) {
          currentActiveId = section.id;
          break;
        }
      }
    }

    if (currentActiveId) {
      // Update rail links
      railLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentActiveId}`) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });

      // Update mobile links
      mobileLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentActiveId}` || (currentActiveId === 'projects' && href === '#work')) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    }
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
});
