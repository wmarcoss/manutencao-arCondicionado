document.addEventListener('DOMContentLoaded', () => {
    fetch('./components/header/header.html')
      .then(response => response.text())
      .then(data => {
        document.querySelector('header-geral').innerHTML = data;
      });
  
    fetch('../footer/footer.html')
      .then(response => response.text())
      .then(data => {
        document.querySelector('footer-geral').innerHTML = data;
      });
  });