const plataformas = document.querySelectorAll('input[name="plataforma"]');
const seletorPlataforma = document.getElementById('seletor-plataforma');
const menuPrincipal = document.getElementById('menu-principal'); 
const plataformaSelecionadaTexto = document.getElementById('plataforma-selecionada');

plataformas.forEach((radio) => {
  radio.addEventListener('change', () => {
    if (!radio.checked) return;

    const plataformaSelecionada = radio.value;
    const nomePlataforma = plataformaSelecionada === 'computador' ? 'Computador' : 'Celular';

    console.log('Plataforma escolhida:', plataformaSelecionada);

    seletorPlataforma.classList.add('hidden');
    menuPrincipal.classList.remove('hidden'); 
    plataformaSelecionadaTexto.textContent = nomePlataforma; 
  });
});

// Função genérica para alternar telas
function abrirMenu(idDoMenu) {
  let paineis = document.querySelectorAll('.painel');
  
  paineis.forEach(function(painel) {
    painel.classList.add('hidden');
  });

  document.getElementById(idDoMenu).classList.remove('hidden');
}

function voltarPrincipal() {
  abrirMenu('menu-principal');
}

function fecharJogo() {
  alert("Obrigado por jogar!");
  window.close(); 
}

/* ===================================================
   SISTEMA DE LORE / INTRODUÇÃO (NOVO JOGO)
   =================================================== */
const textosIntro = [
    "Final da década de 1980. O país vive a 'Década Perdida' — marcada por hiperinflação, desemprego e incertezas.",
    "Na cidade de Nova Esperança, os preços mudam a cada hora e os salários perdem o valor antes do fim do dia.",
    "Meu nome é Lucas. Desde que meu pai desapareceu após se envolver com dívidas perigosas, trabalho em pequenos serviços para ajudar minha mãe e meu avô.",
    "Mas algo estranho está acontecendo... Moradores e comerciantes estão presos em ciclos financeiros sem fim, perdendo todos os seus sonhos.",
    "Existe uma força oculta por trás disso: 'A Fonte'. Ela se alimenta da ganância, do consumismo impulsivo e da desinformação.",
    "Para salvar minha família e Nova Esperança, preciso ajudar a cidade a tomar o controle de suas vidas..."
];

let linhaAtual = 0;
const caixaTexto = document.getElementById('caixa-texto-intro');
const btnAvancar = document.getElementById('btn-avancar-intro');

function iniciarNovoJogo() {
    linhaAtual = 0;
    caixaTexto.textContent = textosIntro[linhaAtual];
    btnAvancar.textContent = "Continuar";
    abrirMenu('menu-novo-jogo');
}

function avancarIntro() {
    linhaAtual++;
    
    if (linhaAtual < textosIntro.length) {
        caixaTexto.textContent = textosIntro[linhaAtual];
        
        if (linhaAtual === textosIntro.length - 1) {
            btnAvancar.textContent = "Começar Aventura";
        }
    } else {
        // Quando acabar a introdução, aqui será a transição para a gameplay (GameMaker / Canvas)
        alert("Educação financeira não é sobre ficar rico. É sobre ter liberdade para continuar sonhando.\n\n[Carregando o jogo...]");
        voltarPrincipal(); 
    }
}
/* ===================================================
   SISTEMA DE LORE / INTRODUÇÃO (NOVO JOGO)
   =================================================== */

function iniciarNovoJogo() {
    linhaAtual = 0;
    caixaTexto.textContent = textosIntro[linhaAtual];
    btnAvancar.textContent = "Continuar";
    
    // 1. Liga o fundo 100% preto
    document.body.classList.add('modo-historia');
    
    abrirMenu('menu-novo-jogo');
}

function voltarPrincipal() {
    // 2. Desliga o fundo preto ao voltar para o menu
    document.body.classList.remove('modo-historia');
    
    abrirMenu('menu-principal');
}

function avancarIntro() {
    linhaAtual++;
    
    if (linhaAtual < textosIntro.length) {
        caixaTexto.textContent = textosIntro[linhaAtual];
        
        if (linhaAtual === textosIntro.length - 1) {
            btnAvancar.textContent = "Começar Aventura";
        }
    } else {
        alert("Educação financeira não é sobre ficar rico. É sobre ter liberdade para continuar sonhando.\n\n[Carregando o jogo...]");
        
        // 3. Remove o fundo preto caso o jogo recarregue ou volte ao menu
        document.body.classList.remove('modo-historia');
        voltarPrincipal(); 
    }
}