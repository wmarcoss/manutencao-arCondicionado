document.addEventListener("DOMContentLoaded", function() {
  // Carregar o Header
  const headerElement = document.getElementById('header-geral');
  fetch('../header/header.html')
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro ao carregar o header.');
          }
          return response.text();
      })
      .then(data => {
          headerElement.innerHTML = data;
      })
      .catch(error => {
          console.error('Erro ao carregar o header:', error);
      });

  // Carregar o Footer
  const footerElement = document.getElementById('footer-geral');
  fetch('../footer/footer.html')
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro ao carregar o footer.');
          }
          return response.text();
      })
      .then(data => {
          footerElement.innerHTML = data;
      })
      .catch(error => {
          console.error('Erro ao carregar o footer:', error);
      });
});