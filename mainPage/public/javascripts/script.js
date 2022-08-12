// const anime = require("animejs");

// Blinking cursor animation
const blinkingObject = document.getElementById('blinkingCursor')
let showObj = true;
setInterval(() => {
  if (showObj) {
    blinkingObject.style.color = "transparent";
    showObj = !showObj;
  } else {
    blinkingObject.style.color = "inherit";
    showObj = !showObj;
  }
}, 550);

// Efecto cuando recien se carga la pagina
var tl = anime.timeline({
  easing: 'easeOutExpo',
});

tl.add({
  targets: '#line',
  opacity: [0.5, 1],
  scaleX: [0, 1],
  easing: "easeInOutExpo",
  duration: 700
}).add({
  targets: '#upper',
  opacity: [0, 1],
  translateY: [30, 0],
  easing: "easeOutExpo",
  duration: 600,
}, "-=100").add({
  targets: '#lower',
  opacity: [0, 1],
  translateY: [-30, 0],
  easing: "easeOutExpo",
  duration: 600,
}, "-=600").add({
  delay: 2000,
  targets: '#sampleText1',
  opacity: [0, 1],
  translateY: [30, 0],
  duration: 1000,
})


// Funcion para rodear contenido de un div con un rectangulo SVG
function surroundSection(elementToSurround) {
  svgContainer = elementToSurround.querySelector('.svgContainer')
  svgContainer.setAttribute("points", `0,0 ${elementToSurround.offsetWidth - 5},0 ${elementToSurround.offsetWidth - 5},
                                           ${elementToSurround.offsetHeight - 5} 0,${elementToSurround.offsetHeight - 5}`);
}

// Funcion para animar el rodeado de un div con rectangulo SVG
function animateSurrounding(sectionToAnimate) {
  surroundSection(sectionToAnimate);
  anime({
    targets: sectionToAnimate.querySelector('.svgContainer'),
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'cubicBezier(.5, .05, .1, .3)',
    duration: 1500,
    autoplay: true,
    delay: function(el, i) { return i * 250 },
    loop: false,
  });
}

// Animacion del about
animateSurrounding(document.getElementById('aboutThisPage'))
