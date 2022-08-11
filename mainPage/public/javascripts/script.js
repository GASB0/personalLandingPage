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

// anime.timeline({
//   easing: 'easeOutQuad',
// }).add({
//   targets: '.polymorph',
//   points: [
//     { value: '70 24 119.574 60.369 100.145 117.631 50.855 101.631 3.426 54.369' },
//     { value: '70 41 118.574 59.369 111.145 132.631 60.855 84.631 20.426 60.369' },
//     { value: '70 6 119.574 60.369 100.145 117.631 39.855 117.631 55.426 68.369' },
//     { value: '70 57 136.574 54.369 89.145 100.631 28.855 132.631 38.426 64.369' },
//     { value: '70 24 119.574 60.369 100.145 117.631 50.855 101.631 3.426 54.369' }
//   ],
//   easing: 'easeOutQuad',
//   direction: 'alternate',
//   loop: true,
//   duration: 2000,
// });


// Animacion del about
var animation = anime({
  targets: '.polygonalContainer',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'cubicBezier(.5, .05, .1, .3)',
  duration: 1500,
  autoplay: true,
  delay: function(el, i) { return i * 250 },
  loop: false,
});
