document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastroForm");

  form.addEventListener("submit", function (e) {
    let valido = true;
    document.querySelectorAll(".erro").forEach(el => el.textContent = "");

    const campos = [
      { id: "codigo", min: 1, msg: "Informe o código." },
      { id: "descricao", min: 3, msg: "Descrição deve ter ao menos 3 caracteres." },
      { id: "fabricante", min: 3, msg: "Fabricante deve ter ao menos 3 caracteres." }
    ];

    campos.forEach(c => {
      const val = form[c.id].value.trim();
      if (val.length < c.min) {
        document.getElementById("erro-" + c.id).textContent = c.msg;
        valido = false;
      }
    });

    // Preços
    ["precoCusto", "precoVenda"].forEach(id => {
      const val = form[id].value.trim();
      if (!/^\d{1,6}(,\d{2})$/.test(val)) {
        document.getElementById("erro-" + id).textContent = "Formato de R$ 0,00";
        valido = false;
      }
    });

    // Validade
    const validade = form.validade.value.trim();
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(validade)) {
      document.getElementById("erro-validade").textContent = "Formato DD/MM/AAAA";
      valido = false;
    }

    // Estoque
    const estoque = parseInt(form.estoque.value);
    if (isNaN(estoque) || estoque < 0) {
      document.getElementById("erro-estoque").textContent = "Estoque inválido";
      valido = false;
    }

    if (!valido) {
      e.preventDefault();
    }
  });

  // Máscaras: preço
  ["precoCusto", "precoVenda"].forEach(id => {
    const input = form[id];
    input.addEventListener("input", () => {
      let v = input.value.replace(/\D/g, "");
      v = (parseInt(v || 0) / 100).toFixed(2).replace(".", ",");
      input.value = v;
    });
  });

  // Máscara: validade
  form.validade.addEventListener("input", () => {
    let v = form.validade.value.replace(/\D/g, "");
    if (v.length >= 2) v = v.slice(0,2) + "/" + v.slice(2);
    if (v.length >= 5) v = v.slice(0,5) + "/" + v.slice(5,9);
    form.validade.value = v;
  });
});
