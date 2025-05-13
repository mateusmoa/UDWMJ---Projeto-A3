document.getElementById('cadastroUsuarioForm').onsubmit = function(e) {
    e.preventDefault();
    alert('Cadastro realizado com sucesso!');
    window.location = 'login-usuario.html';
};