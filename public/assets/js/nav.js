document.addEventListener('DOMContentLoaded', function() {
  // Obtiene el botón de hamburguesa
  var navToggle = document.getElementById('nav-toggle');

  // Obtiene el menú de navegación
  var navMenu = document.querySelector('nav ul');

  // Agrega un evento de clic al botón de hamburguesa
  navToggle.addEventListener('click', function() {
    // Alterna la clase 'show' para mostrar/ocultar el menú
    navMenu.classList.toggle('show');
  });
});
