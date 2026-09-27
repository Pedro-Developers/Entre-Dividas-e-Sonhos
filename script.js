const plataformas = document.querySelectorAll('input[name="plataforma"]');
const seletorPlataforma = document.getElementById('seletor-plataforma');
const menuJogo = document.getElementById('menu-jogo');
const plataformaSelecionadaTexto = document.getElementById('plataforma-selecionada');

plataformas.forEach((radio) => {
  radio.addEventListener('change', () => {
    if (!radio.checked) return;

    const plataformaSelecionada = radio.value;
    const nomePlataforma = plataformaSelecionada === 'computador' ? 'Computador' : 'Celular';

    console.log('Plataforma escolhida:', plataformaSelecionada);

    seletorPlataforma.classList.add('hidden');
    menuJogo.classList.remove('hidden');
    plataformaSelecionadaTexto.textContent = nomePlataforma;
  });
});