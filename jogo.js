const animais = [
    { nome : "Capivara", imagem: "assets/imagem/capivara.jpg", som: "assets/audio/audio-capivara.mp3"},
    { nome : "Tuiuiu", imagem: "assets/imagem/tuiuiu.jpg", som: "assets/audio/audio-tuiuiu.mp3"},
    { nome : "Arara-azul", imagem: "assets/imagem/arara.jpg", som: "assets/audio/audio-arara-azul.mp3"},
    { nome : "Jacare", imagem: "assets/imagem/jacare.jpg", som: "assets/audio/audio-jacare.mp3"},
    { nome : "ariranha", imagem: "assets/imagem/ariranha.jpg", som: "assets/audio/audio-ariranha.mp3"},
    { nome : "Seriema", imagem: "assets/imagem/seriema.jpg", som: "assets/audio/audio-seriema.mp3"},
];

let cartas = [];
animais.forEach(animal => {
    cartas.push({ ...animal, tipo: 'imagem' });
    cartas.push({ ...animal, tipo: 'som' });
});

let conhecaDiv;
let btnNormal;
let btnTempo;
let telaInicial;
let areaJogo;
let pontuacaoEl;
let timerEl;
let tempoRestante = 60;
let timerInterval = null;
let jogoAtivo = false;
let cartasViradas = [];
let cartasCombinadas = [];
let audioEmReproducao = null;

function inicializarTelaInicial() {
    conhecaDiv = document.getElementById('animais-conheca');
    btnNormal = document.getElementById('btn-normal');
    btnTempo = document.getElementById('btn-tempo');
    telaInicial = document.getElementById('tela-inicial');
    areaJogo = document.getElementById('area-jogo');
    pontuacaoEl = document.getElementById('pontuacao');
    timerEl = document.getElementById('timer');

    animais.forEach(animal => {
        const img = document.createElement('img');
        img.src = animal.imagem;
        img.alt = animal.nome;
        img.addEventListener('click', () => {
            if (audioEmReproducao) {
                audioEmReproducao.pause();
                audioEmReproducao.currentTime = 0;
            }
            audioEmReproducao = new Audio(animal.som);
            audioEmReproducao.play();
        });
        conhecaDiv.appendChild(img);
    });

    btnNormal.addEventListener('click', () => iniciarJogo('normal'));
    btnTempo.addEventListener('click', () => iniciarJogo('tempo'));
}

document.addEventListener('DOMContentLoaded', inicializarTelaInicial);

function iniciarJogo(modo) {
    telaInicial.style.display = 'none';
    areaJogo.style.display = 'grid';
    jogoAtivo = true;
    cartasCombinadas = [];
    cartasViradas = [];
    embaralharCartas();
    criarCartas();

    if (modo === 'tempo') {
        tempoRestante = 60;
        timerEl.style.display = 'block';
        timerEl.querySelector('#tempo-restante').textContent = tempoRestante;
        clearInterval(timerInterval);
        timerInterval = setInterval(atualizarTimer, 1000);
    } else {
        timerEl.style.display = 'none';
        clearInterval(timerInterval);
    }
}

function atualizarTimer() {
    tempoRestante -= 1;
    timerEl.querySelector('#tempo-restante').textContent = tempoRestante;
    if (tempoRestante <= 0) {
        clearInterval(timerInterval);
        finalizarJogo('tempo');
    }
}

function finalizarJogo() {
    jogoAtivo = false;
    clearInterval(timerInterval);
    setTimeout(retornarTelaInicial, 2000);
}

function retornarTelaInicial() {
    areaJogo.style.display = 'none';
    telaInicial.style.display = 'block';
    timerEl.style.display = 'none';
    areaJogo.innerHTML = '';
}

function embaralharCartas() {
    for (let i = cartas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
    }
}

function criarCartas() {
    areaJogo.innerHTML = '';
    cartas.forEach((carta, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.dataset.index = index;
        cardDiv.addEventListener('click', () => virarCarta(cardDiv, carta));
        areaJogo.appendChild(cardDiv);
    });
}

function virarCarta(cardDiv, carta) {
    if (!jogoAtivo || cardDiv.classList.contains('flipped') || cartasViradas.length >= 2) return;
    cardDiv.classList.add('flipped');

    if (carta.tipo === 'imagem') {
        const img = document.createElement('img');
        img.src = carta.imagem;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        cardDiv.appendChild(img);
    } else {
        const img = document.createElement('img');
        img.src = 'assets/imagem/som.jpg';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        cardDiv.appendChild(img);
        if (audioEmReproducao) {
            audioEmReproducao.pause();
            audioEmReproducao.currentTime = 0;
        }
        audioEmReproducao = new Audio(carta.som);
        audioEmReproducao.play();
    }

    cartasViradas.push({ div: cardDiv, carta });
    if (cartasViradas.length === 2) {
        setTimeout(verificarCombinacao, 1000);
    }
}

function verificarCombinacao() {
    const [carta1, carta2] = cartasViradas;
    if (carta1.carta.nome === carta2.carta.nome && carta1.carta.tipo !== carta2.carta.tipo) {
        cartasCombinadas.push(carta1, carta2);
        pontuacaoEl.textContent = parseInt(pontuacaoEl.textContent, 10) + 10;
    } else {
        carta1.div.classList.remove('flipped');
        carta1.div.innerHTML = '';
        carta2.div.classList.remove('flipped');
        carta2.div.innerHTML = '';
    }

    cartasViradas = [];

    if (cartasCombinadas.length === cartas.length) {
        finalizarJogo();
    }
}
       