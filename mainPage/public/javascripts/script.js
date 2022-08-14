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

// Animacion de la barra lateral izquierda
anime({
  targets: ['.animate-thing path', '.animate-thing rect', '.animate-thing line', '.animate-thing polyline', '.animate-thing circle'],
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutSine',
  duration: 1000,
  delay: function(el, i) { return (i * 60); },
  opacity: [0, 1],
});

// Centralizacion de las secciones de la pagina:
function centralizeSection(sectionToCentralize) {
  paddingTop = (sectionToCentralize.offsetHeight - sectionToCentralize.querySelector('.secContent').offsetHeight) / 2;
  sectionToCentralize.style.paddingTop = `${paddingTop}px`;
}

// Funcion para rodear contenido de cualquier cosa a la que se le pueda hacer query
function surroundSection(elementToSurround) {
  if (typeof (elementToSurround) == "object") {
    svgContainer = elementToSurround.querySelector('.svgContainer');
  } else if (typeof (elementToSurround) == "string") {
    svgContainer = document.getElementById(elementToSurround).querySelector('.svgContainer');
  }

  svgContainer.setAttribute("points",
    `0,0 ${elementToSurround.querySelector('.secContent').offsetWidth},0
    ${elementToSurround.querySelector('.secContent').offsetWidth},${elementToSurround.querySelector('.secContent').offsetHeight} 
    0,${elementToSurround.querySelector('.secContent').offsetHeight}
    0,0`);
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
    loop: false,
  });
}

// Reajustando los recuadros cuando se reajusta la ventana
window.onresize = () => {
  document.querySelectorAll('.surroundedByBox').forEach(node => {
    surroundSection(node);
  })
};

// Animacion de las secciones
animateSurrounding(document.getElementById('aboutThisPage'))
// console.log(
//   document.getElementById('aboutThisPage').getBoundingClientRect()
// )

// Centralizacion de las secciones del documento
for (i = 0; i < document.getElementsByTagName('section').length; i++) {
  centralizeSection(document.getElementsByTagName('section')[i]);
}
// Centralizacion los elementos laterales
for (i = 0; i < document.querySelectorAll('.sideStuff').length; i++) {
  thingToCentralize = document.querySelectorAll('.sideStuff')[i];
  padding = (window.innerHeight - thingToCentralize.offsetHeight) / 2;
  console.log(padding)
  thingToCentralize.style.bottom = `${padding}px`;
}
