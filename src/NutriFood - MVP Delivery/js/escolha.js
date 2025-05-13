const conteudo = document.getElementById("conteudoEscolha");
const tabRestaurantes = document.getElementById("tabRestaurantes");
const tabItens = document.getElementById("tabItens");

function renderRestaurantes() {
  conteudo.innerHTML = `
    <div style="margin-bottom: 20px; font-family: sans-serif;">
    <strong style="font-size: 16px; color: #1a1a1a;">Pedidos Com Pendência (1)</strong>

    <div style="height: 270px; width: 450px; display: flex; gap: 10px; margin-top: 10px; background: #f5f5f5; padding: 15px; border-radius: 10px; border: 1px solid #ccc;">
        <!-- Lado do produto -->
        <div style="border: 2px solid #0a4d0a; border-radius: 8px; padding: 10px; text-align: center; width: 180px; background: white; margin-right: 0px;">
            <img src="img/Produto1.png" alt="Shake de Chocolate" style="width: 100%; border-radius: 4px;">
            <div style="font-size: 22px; color: #0a4d0a; margin-top: 8px;">Shake de<br>Chocolate</div>
            <div style="font-size: 24px; color: #ccc; margin-top: -6px;">★★★★★</div>
        </div>

        <!-- Lado do review -->
        <div style="flex-grow: 1; border: 2px solid #0a4d0a; border-radius: 8px; background: white; padding: 10px; margin-left: 0px; margin-right: 150px;">
            <div style="font-size: 18px; color: #0a4d0a; margin-bottom: 10px;">Review</div>
            <textarea 
  placeholder="Escreva aqui..." 
  style="height: 175px; width: 140px; border: 1px solid #0a4d0a; border-radius: 6px; padding: 8px; resize: none; box-sizing: border-box;">
</textarea>

        </div>
    </div>
    </div>

    <div style="margin-bottom:20px;">
        <strong>Recomendados</strong>
        <div class="recomendados-list" style="display:flex;gap:10px;margin-top:10px;">
            <div class="item" style="border:1px solid #ccc;padding:10px;border-radius:6px;background:#fff;"><button style="width:120px; height:155px; border:none; background-image: url('img/Produto1.png'); background-size: cover; background-position: center; border-radius:8px; cursor:pointer;"></button> <br> NutriFood<br>Salada Saudável<br><button>Carrinho +</button></div>
            <div class="item" style="border:1px solid #ccc;padding:10px;border-radius:6px;background:#fff;"><button style="width:120px; height:155px; border:none; background-image: url('img/Produto2.png'); background-size: cover; background-position: center; border-radius:8px; cursor:pointer;"></button> <br> EcoFit<br>Almoço Saudável<br><button>Carrinho +</button></div>
            <div class="item" style="border:1px solid #ccc;padding:10px;border-radius:6px;background:#fff;"><button style="width:120px; height:155px; border:none; background-image: url('img/Produto3.png'); background-size: cover; background-position: center; border-radius:8px; cursor:pointer;"></button> <br> Growth<br>Shake Proteico<br><button>Carrinho +</button></div>
        </div>
    </div>

    <div>
        <strong>Promoções</strong>
        <div class="promocoes-list" style="display:flex;gap:10px;margin-top:10px;">
            <div class="item" style="border:1px solid #ccc;padding:10px;border-radius:6px;background:#fff;"><button style="width:120px; height:120px; border:none; background-color: transparent; background-image: url('img/Imagem Produto1.png'); background-size: cover; background-position: center; border-radius:8px; cursor:pointer;"></button> <br> Pera Peruana<br>R$ 12,99<br><button>Carrinho +</button></div>
            <div class="item" style="border:1px solid #ccc;padding:10px;border-radius:6px;background:#fff;"><button style="width:120px; height:120px; border:none; background-color: transparent; background-image: url('img/Imagem Produto2.png'); background-size: cover; background-position: center; border-radius:8px; cursor:pointer;"></button> <br> Melancia<br>R$ 34,99<br><button>Carrinho +</button></div>
            <div class="item" style="border:1px solid #ccc;padding:10px;border-radius:6px;background:#fff;"><button style="width:120px; height:120px; border:none; background-color: transparent; background-image: url('img/Imagem Produto3.png'); background-size: cover; background-position: center; border-radius:8px; cursor:pointer;"></button> <br> Salada de Frutas<br>R$ 14,99<br><button>Carrinho +</button></div>
        </div>
    </div>
    `;
}
function renderItens() {
  conteudo.innerHTML = `<div>Em breve...</div>`;
}
tabRestaurantes.onclick = () => {
  tabRestaurantes.classList.add("active");
  tabItens.classList.remove("active");
  renderRestaurantes();
};
tabItens.onclick = () => {
  tabItens.classList.add("active");
  tabRestaurantes.classList.remove("active");
  renderItens();
};
renderRestaurantes();
