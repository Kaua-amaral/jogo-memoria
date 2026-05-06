const animais = [
    { nome : "Capivara", imagem: "assets/imagem/capivara.jpg", som: "assets/audio/audio-capivara.mp3"},
    { nome : "Tuiuiu", imagem: "assets/imagem/tuiuiu.jpg", som: "assets/audio/audio-tuiuiu.mp3"},
    { nome : "Arara-azul", img: "assets/imagem/arara.jpg", som: "assets/audio/audio-arara-azul.mp3"},
    { nome : "Jacare", imagem: "assets/imagem/jacare.jpg", som: "assets/audio/audio-jacare.mp3"},
    { nome : "ariranha", imagem: "assets/imagem/ariranha.jpg", som: "assets/audio/audio-ariranha.mp3"},
    { nome : "Seriema", imagem: "assets/imagem/seriema.jpg", som: "assets/audio/audio-seriema.mp3"},
];

let cartas = [];
animais.forEach(animal => {
    cartas.push({ ...animal, tipo: 'imagem' });
    cartas.push({ ...animal, tipo: 'som' });
});
