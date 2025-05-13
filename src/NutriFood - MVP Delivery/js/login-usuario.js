// Simulação de banco de dados de usuários
const usuarios = [
    { email: 'usuario@exemplo.com', senha: '123456' },
    { email: 'teste@nutrifood.com', senha: 'senhaUsuario' }
];

document.getElementById('loginUsuarioForm').onsubmit = function(e) {
    e.preventDefault();
    const email = document.querySelector('#loginUsuarioForm input[type="email"]').value.trim();
    const senha = document.querySelector('#loginUsuarioForm input[type="password"]').value;

    const autenticado = usuarios.some(user =>
        user.email === email && user.senha === senha
    );

    if (autenticado) {
        window.location = 'escolha.html';
    } else {
        alert('Email ou senha inválidos!');
    }
};