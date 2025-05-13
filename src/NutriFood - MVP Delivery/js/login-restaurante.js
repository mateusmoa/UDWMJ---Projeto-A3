// Simulação de banco de dados de restaurantes
const restaurantes = [
    { emailCnpj: 'restaurante@exemplo.com', senha: '123456' },
    { emailCnpj: '12345678000199', senha: 'senhaCnpj' }
];

document.getElementById('loginRestauranteForm').onsubmit = function(e) {
    e.preventDefault();
    const emailCnpj = document.getElementById('emailCnpj').value.trim();
    const senha = document.getElementById('senha').value;

    const autenticado = restaurantes.some(user =>
        user.emailCnpj === emailCnpj && user.senha === senha
    );

    if (autenticado) {
        window.location = 'dashboard.html';
    } else {
        alert('Email/CNPJ ou senha inválidos!');
    }
};