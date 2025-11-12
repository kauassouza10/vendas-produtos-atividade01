let produtos = [];
let produtosExibidos = 0;
const produtosPorPagina = 8;
let carrinho = [];

const container = document.getElementById("produtos-container");
const btnCarregar = document.getElementById("btn-carregar");
const modalCompra = document.getElementById("modal-compra");
const modalCarrinho = document.getElementById("modal-carrinho");
const closeModalCompra = document.querySelector(".close");
const closeModalCarrinho = document.querySelector(".close-carrinho");
const cartCount = document.getElementById("cart-count");
const qrCodeImg = document.getElementById("qrcode");
const btnCarrinho = document.getElementById("btn-carrinho");
const listaCarrinho = document.getElementById("lista-carrinho");
const totalCarrinho = document.getElementById("total-carrinho");
const btnFinalizar = document.getElementById("btn-finalizar");


fetch("https://dummyjson.com/products")
  .then(res => res.json())
  .then(data => {
    produtos = data.products;
    mostrarProdutos();
  })
  .catch(err => {
    container.innerHTML = "<p>Erro ao carregar produtos.</p>";
    console.error(err);
  });


function mostrarProdutos() {
  const novos = produtos.slice(produtosExibidos, produtosExibidos + produtosPorPagina);
  novos.forEach(produto => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${produto.thumbnail}" alt="${produto.title}">
      <h2>${produto.title}</h2>
      <p>${produto.description}</p>
      <div class="price">Preço: R$ ${produto.price}</div>
      <div class="rating">⭐ ${produto.rating}</div>
      <div class="btn-container">
        <button class="btn btn-carrinho">Adicionar ao carrinho</button>
        <button class="btn btn-comprar">Comprar</button>
      </div>
    `;
    container.appendChild(card);

    card.querySelector(".btn-carrinho").addEventListener("click", () => adicionarCarrinho(produto));
    card.querySelector(".btn-comprar").addEventListener("click", () => abrirModalCompra(produto));
  });

  produtosExibidos += novos.length;
  if (produtosExibidos >= produtos.length) btnCarregar.style.display = "none";
}


function adicionarCarrinho(produto) {
  carrinho.push(produto);
  cartCount.textContent = carrinho.length;
  atualizarCarrinho();
}


function atualizarCarrinho() {
  listaCarrinho.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, index) => {
    total += item.price;
    const div = document.createElement("div");
    div.classList.add("item-carrinho");
    div.innerHTML = `
      <span>${item.title} - R$ ${item.price}</span>
      <button class="btn-remover" data-index="${index}">Remover</button>
    `;
    listaCarrinho.appendChild(div);
  });

  totalCarrinho.textContent = `Total: R$ ${total.toFixed(2)}`;


  document.querySelectorAll(".btn-remover").forEach(btn => {
    btn.addEventListener("click", e => {
      const i = e.target.dataset.index;
      carrinho.splice(i, 1);
      cartCount.textContent = carrinho.length;
      atualizarCarrinho();
    });
  });
}


btnCarrinho.addEventListener("click", () => {
  atualizarCarrinho();
  modalCarrinho.style.display = "block";
});
closeModalCarrinho.addEventListener("click", () => (modalCarrinho.style.display = "none"));


function abrirModalCompra(produto) {
  qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?data=Pagamento%20do%20produto%20${encodeURIComponent(produto.title)}&size=200x200`;
  modalCompra.style.display = "block";
}
closeModalCompra.addEventListener("click", () => (modalCompra.style.display = "none"));


btnFinalizar.addEventListener("click", () => {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }
  const listaProdutos = carrinho.map(p => p.title).join(", ");
  qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?data=Pagamento%20dos%20itens:%20${encodeURIComponent(listaProdutos)}&size=200x200`;
  modalCarrinho.style.display = "none";
  modalCompra.style.display = "block";
  carrinho = [];
  cartCount.textContent = 0;
  atualizarCarrinho();
});


window.addEventListener("click", e => {
  if (e.target === modalCompra) modalCompra.style.display = "none";
  if (e.target === modalCarrinho) modalCarrinho.style.display = "none";
});

// ====== CARREGAR MAIS ======
btnCarregar.addEventListener("click", mostrarProdutos);