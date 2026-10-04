/* ===================================================
   GERENCIAMENTO DE PLATAFORMA E MENUS
   =================================================== */
const plataformas = document.querySelectorAll('input[name="plataforma"]');
const seletorPlataforma = document.getElementById('seletor-plataforma');
const menuPrincipal = document.getElementById('menu-principal'); 
const plataformaSelecionadaTexto = document.getElementById('plataforma-selecionada');

// Clique na escolha de plataforma (Computador / Celular)
plataformas.forEach((radio) => {
  radio.addEventListener('change', () => {
    if (!radio.checked) return;

    const plataformaSelecionada = radio.value;
    const nomePlataforma = plataformaSelecionada === 'computador' ? 'Computador' : 'Celular';

    seletorPlataforma.classList.add('hidden');
    menuPrincipal.classList.remove('hidden'); 
    plataformaSelecionadaTexto.textContent = nomePlataforma; 
  });
});

// Função para abrir menus e ocultar os outros
function abrirMenu(idDoMenu) {
  const paineis = document.querySelectorAll('.painel');
  paineis.forEach((painel) => painel.classList.add('hidden'));

  const menuAlvo = document.getElementById(idDoMenu);
  if (menuAlvo) {
    menuAlvo.classList.remove('hidden');
  }
}

// Voltar para o menu principal
function voltarPrincipal() {
  document.body.classList.remove('modo-historia');
  abrirMenu('menu-principal');
}

// Sair do jogo
function fecharJogo() {
  alert("Obrigado por jogar!");
  window.close(); 
}

/* ===================================================
   FLUXO DA DEMO (RPG DE TURNO 2D - MUNDO LINEAR)
   =================================================== */
const textosIntro = [
    // 1. Tutorial da Exploração Linear 2D
    "Bem-vindo a Nova Esperança (1980).\n\n[TUTORIAL 2D]: Use 'A / D' ou as 'Setas' para andar pelo caminho linear da cidade. Pressione 'E' para conversar ou entrar em locais.",
    
    // 2. Lore / Contexto do Pai
    "A vida da minha família mudou da noite para o dia... Meu pai desapareceu misteriosamente, deixando para trás apenas contas acumuladas e dívidas perigosas.",
    
    // 3. Trabalho & Tutorial de Batalha por Turno
    "Para ajudar minha mãe, comecei a trabalhar como entregador de jornais e fazendo pequenos serviços.\n\n[TUTORIAL DE TURNO]: Nas batalhas, você e os inimigos agem por turnos. Escolha entre Atacar, Economizar ou Usar Habilidades de Gestão.",
    
    // 4. Apresentação dos Inimigos do Jogo
    "Pelas ruas, enfrentei personificações da crise: o 'Consumista' tentando me fazer gastar sem pensar, e o 'Sr. Juros' acumulando dívidas a cada turno...",
    
    // 5. Percepção da Fonte
    "Percebi que os moradores de Nova Esperança estão presos num ciclo repetitivo. 'A Fonte' se alimenta do desespero e da desinformação de todos nós.",
    
    // 6. Voltar a Casa (Ponto de Descanso/Save)
    "Depois das entregas, volto para casa. O almoço em família recupera minha energia e me prepara para os próximos desafios.",
    
    // 7. A Escola (Início do Jogo / Desbloqueio da Árvore de Habilidades)
    "Agora é hora de ir para a Escola. É lá que vou aprender novas habilidades por turno para derrotar os vilões financeiros e salvar a cidade!"
];

let linhaAtual = 0;

function iniciarNovoJogo() {
    const caixaTexto = document.getElementById('caixa-texto-intro');
    const btnAvancar = document.getElementById('btn-avancar-intro');

    linhaAtual = 0;
    if (caixaTexto) caixaTexto.textContent = textosIntro[linhaAtual];
    if (btnAvancar) btnAvancar.textContent = "Continuar";
    
    document.body.classList.add('modo-historia');
    abrirMenu('menu-novo-jogo');
}

function avancarIntro() {
    const caixaTexto = document.getElementById('caixa-texto-intro');
    const btnAvancar = document.getElementById('btn-avancar-intro');

    linhaAtual++;
    
    if (linhaAtual < textosIntro.length) {
        if (caixaTexto) caixaTexto.textContent = textosIntro[linhaAtual];
        
        if (linhaAtual === textosIntro.length - 1 && btnAvancar) {
            btnAvancar.textContent = "Entrar na Escola (Iniciar Demo)";
        }
    } else {
        // Final da introdução, iniciar o jogo
        document.body.classList.remove('modo-historia');
        abrirMenu('Jogo-rodando');
        iniciarDemo();
    }
}
/* ===================================================
   Jogo 2D Linear + Batalha por Turno (Demo)
   =================================================== */
let andar = 0; // Variável global para controlar o movimento do personagem
let interagir = false; // Variável global para controlar a interação com NPCs ou objetos
const jogoRodando = document.getElementById('Jogo-rodando');
let playerX = 0; // Posição X do personagem
let playerY = 0; // Posição Y do personagem
let player;

document.addEventListener('keydown'), (event) => { // Movimentação... Sem sprite e object do player, apenas um quadrado representando o personagem (que foda...)
  if (jogoRodando && !jogoRodando.classList.contains('hidden')) {
    switch (event.key) {
      case 'ArrowLeft':
        playerX = Math.max(0, playerX - 1);
        break;
      case 'ArrowRight':
        playerX = Math.min(9, playerX + 1);
        break;
    case 'ArrowUp':
        playerY = Math.max(0, playerY - 1);
        break;
        case 'ArrowDown':
        playerY = Math.min(9, playerY + 1);
        break;
      }
   if (jogoRodando) {
    player.style.left = `${playerX * 50}px`;
    player.style.top = `${playerY * 50}px`; 
  } 
  }
}
