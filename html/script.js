// Gestion du menu actif lors du scroll
const navLinks = document.querySelectorAll('.nav-menu li a');
const sections = document.querySelectorAll('.section');
const menuToggle = document.getElementById('menu-toggle');

window.addEventListener('scroll', () => {
  let current = '';
  const scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').substring(1) === current) {
      link.classList.add('active');
    }
  });
});

// Fermer le menu mobile quand on clique sur un lien
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    
    // Fermer le menu hamburger
    if (menuToggle) {
      menuToggle.checked = false;
    }
    
    // Scroll vers la section
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Animation d'apparition progressive au chargement
window.addEventListener('DOMContentLoaded', () => {
  const presentation = document.querySelector('.presentation');
  if (presentation) {
    presentation.classList.add('fade-in');
  }
});
