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
}).add({
  targets: '#sampleText1',
  opacity: [1, 0],
  translateY: [0, 30],
  duration: 500,
})


// Animacion de links bonitos
