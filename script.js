const cursor = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('[data-placeholder]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    alert(`Add your ${link.dataset.placeholder} profile URL here in index.html.`);
  });
});
