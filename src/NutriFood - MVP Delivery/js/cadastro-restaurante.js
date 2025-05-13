document.getElementById('cadastroRestauranteForm').onsubmit = function(e) {
    e.preventDefault();
    alert('Cadastro realizado com sucesso!');
    window.location = 'login-restaurante.html';
};