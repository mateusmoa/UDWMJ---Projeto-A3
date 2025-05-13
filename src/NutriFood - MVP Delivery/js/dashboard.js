const restaurante = {
    nome: "Nome do Restaurante",
    faturamentoSemanal: 12532.54,
    faturamentoTotal: 253526.43,
    pedidos: [
        { id: 123456, data: "12:40 | 12/05/2025", valor: 0, status: "Entregue" },
        { id: 123457, data: "12:50 | 12/05/2025", valor: 0, status: "Entregue" }
    ],
    cardapio: [
        { nome: "Shake Proteico", preco: 0 },
        { nome: "Café misturado com jack3d", preco: 0 },
        { nome: "Feijão com Frango Vegano", preco: 0 }
    ],
    resultadosSemanais: {
        score: 4.8,
        totalPedidos: 245,
        atrasados: 37,
        cancelados: 0,
        retornados: 12
    }
};

function renderDashboard() {
    const dash = document.getElementById('dashboard');
    dash.innerHTML = `
        <h2>Bem Vindo<br>(${restaurante.nome})!</h2>
        <div>
            <strong>Faturamento Semanal:</strong> R$ ${restaurante.faturamentoSemanal.toLocaleString('pt-BR', {minimumFractionDigits:2})}<br>
            <strong>Faturamento Total:</strong> R$ ${restaurante.faturamentoTotal.toLocaleString('pt-BR', {minimumFractionDigits:2})}
        </div>
        <h3>Pedidos:</h3>
        <ul class="order-list">
            ${restaurante.pedidos.map(p => `
                <li>
                    <span>#${p.id} - ${p.data}</span>
                    <span>R$ ${p.valor.toFixed(2)} - <span class="status-entregue">${p.status}</span></span>
                </li>
            `).join('')}
        </ul>
        <h3>Cardápio:</h3>
        <ul class="menu-list">
            ${restaurante.cardapio.map(c => `
                <li>
                    <span>${c.nome}</span>
                    <span>Preço: R$ ${c.preco.toFixed(2)}</span>
                </li>
            `).join('')}
        </ul>
        <div class="resultados-semanais">
            <strong>Resultados Semanais</strong><br>
            Score Semanal de Avaliações: ${restaurante.resultadosSemanais.score}<br>
            Pedidos Totais: ${restaurante.resultadosSemanais.totalPedidos}<br>
            Pedidos Atrasados: ${restaurante.resultadosSemanais.atrasados} (${Math.round((restaurante.resultadosSemanais.atrasados/restaurante.resultadosSemanais.totalPedidos)*100)}%)<br>
            Pedidos Cancelados: ${restaurante.resultadosSemanais.cancelados} (0%)<br>
            Pedidos Retornados: ${restaurante.resultadosSemanais.retornados} (${Math.round((restaurante.resultadosSemanais.retornados/restaurante.resultadosSemanais.totalPedidos)*100)}%)
        </div>
    `;
}
renderDashboard();