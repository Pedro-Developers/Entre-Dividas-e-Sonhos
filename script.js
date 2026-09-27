const plataformas = document.querySelectorAll('input[name="plataforma"]');

plataformas.forEach((radio) => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      const plataformaSelecionada = radio.value;
      console.log("Plataforma escolhida:", plataformaSelecionada);
      alert("Você está jogando no: " + plataformaSelecionada);
    }
  });
});