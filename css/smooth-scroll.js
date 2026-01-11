document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      
      // Se for apenas "#" (como no footer Home), rola para o topo
      if (targetId === '#') {
        e.preventDefault();
        customScrollTo(0, 1500); // 1500ms = 1.5 segundos
        return;
      }
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        customScrollTo(targetPosition, 1500);
      }
    });
  });

  function customScrollTo(to, duration) {
    const start = window.scrollY;
    const change = to - start;
    let startTime = null;

    function animateScroll(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      // Função de Easing (EaseInOutQuad) - Começa devagar, acelera e termina devagar
      let t = progress / duration;
      if (t > 1) t = 1;
      const val = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      
      window.scrollTo(0, start + change * val);

      if (progress < duration) {
        window.requestAnimationFrame(animateScroll);
      }
    }
    window.requestAnimationFrame(animateScroll);
  }
});