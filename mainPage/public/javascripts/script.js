var anime = require('animejs');
var TypeIt = require('typeit');

// Title animation:
var titleWrapper = document.getElementById('upper')
titleWrapper.innerHTML = titleWrapper.textContent.replace(/( {2,})/g, "").replace(/(.)/g, "<div class='titleLetter' style='float: left;'>$&</div>");

// Page loading animation
var tl = anime.timeline({ easing: 'easeOutExpo' });
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
  targets: '#lower',
  opacity: [1, 0],
  translateY: [0, 30],
  duration: 1000,
}).finished.then(() => {
  document.getElementById('upperWrap').style.overflow = 'visible';
  document.getElementById('upper').addEventListener('mouseenter', () => {
    if (!pageTitleOnHoverAnimation.began || !(pageTitleOnHoverAnimation.remaining > 0)) {
      pageTitleOnHoverAnimation.play();
    }
  })
  document.getElementById('lower').textContent = '';
  document.getElementById('lower').style.opacity = 1;
  document.getElementById('lower').style.transform = "translateY(0)";
  new TypeIt("#lower", {
    strings: ["Scroll down for the cool stuff"],
    speed: 100,
    loop: false,
  }).go();
})
var pageTitleOnHoverAnimation = anime({
  autoplay: false,
  targets: document.querySelectorAll('.titleLetter'),
  translateY: [
    { value: '-1em', easing: 'easeOutSine', duration: 250 },
    { value: '0', easing: 'easeInOutQuad', duration: 500 }
  ],
  delay: anime.stagger(50),
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

// Animaciones para los botones de los lados:
class slideButton {
  constructor(sideButtonRow) {
    this.reversed = false;
    this.sideButtonRow = sideButtonRow;
    var textWrapper = sideButtonRow.querySelector('.sideButtonText .letters');
    textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");
    sideButtonRow.querySelectorAll('.sideButtonText .line').forEach(elem => {
      elem.style.left = `${sideButtonRow.querySelector('.animate-thing').getBoundingClientRect().width}px`
    });
    this.sideButtonAnimation = anime.timeline({ loop: false, autoplay: false, })
      .add({
        targets: sideButtonRow.querySelectorAll(".sideButtonText .line"),
        scaleY: [0, 1],
        opacity: [0.5, 1],
        easing: "easeOutExpo",
        duration: 500,
      }).add({
        targets: sideButtonRow.querySelectorAll('.sideButtonText .line'),
        translateX: [0, sideButtonRow.querySelector('.sideButtonText .letters').getBoundingClientRect().width + 10],
        easing: "easeOutExpo",
        duration: 600,
      }).add({
        targets: sideButtonRow.querySelectorAll('.sideButtonText .letters .letter'),
        opacity: [0, 1],
        easing: "easeInOutExpo",
        duration: 600,
        delay: (el, i, l) => 10 * (i + 1),
      }, '-=750')
  }
  play() {
    if (!this.reversed) {
      this.reversed = false;
      return this.sideButtonAnimation.play();
    } else {
      this.sideButtonAnimation.reverse();
      return this.sideButtonAnimation.play();
    }
  }
  reverse() {
    this.reversed = true;
  }
}

// Revisar si el elemento esta dentro del viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    (Math.abs(rect.top) / 2) <= window.innerHeight / 4 &&
    rect.left >= 0
  );
}

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

class animatedSurrounding {
  constructor(element) {
    this.animated = false;
    this.element = element;
    surroundSection(this.element);    // Funcion para animar el rodeado de un div con rectangulo SVG
    this.animation = anime({
      targets: this.element.querySelector('.svgContainer'),
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'cubicBezier(.5, .05, .1, .3)',
      duration: 1500,
      autoplay: false,
      loop: false,
    });
  }
  play() {
    if (!this.animated) {
      this.animated = true;
      this.animation.play();
      this.animation.finished.then(() => {
        console.log('The animation of this section has finished');
      });
    }
  }
}

// Reajustando los recuadros cuando se reajusta la ventana
window.onresize = () => {
  document.querySelectorAll('.surroundedByBox').forEach(node => {
    surroundSection(node);
  })
};

// Centralizacion del about
centralizeSection(document.getElementById('aboutThisPage'));

// Centralizacion los elementos laterales
window.addEventListener('load', () => {
  for (i = 0; i < document.querySelectorAll('.sideStuff').length; i++) {
    thingToCentralize = document.querySelectorAll('.sideStuff')[i];
    padding = (window.innerHeight - thingToCentralize.offsetHeight) / 2;
    thingToCentralize.style.bottom = `${padding}px`;
  }
})
window.addEventListener('resize', () => {
  for (i = 0; i < document.querySelectorAll('.sideStuff').length; i++) {
    thingToCentralize = document.querySelectorAll('.sideStuff')[i];
    padding = (window.innerHeight - thingToCentralize.offsetHeight) / 2;
    thingToCentralize.style.bottom = `${padding}px`;
  }
})


// Animacion de los botones laterales
document.querySelectorAll('.sideButtonRow').forEach((elem) => {
  var currentSlideButton = new slideButton(elem);
  currentSlideButton.sideButtonRow.querySelector('.sideButtonText').style.visibility = 'hidden';
  currentSlideButton.sideButtonRow.querySelector('.sideButtonLogo')
    .addEventListener('mouseenter', () => {
      currentSlideButton.sideButtonRow.querySelector('.sideButtonText').style.visibility = 'visible';
      currentSlideButton.play();
    });
  currentSlideButton.sideButtonRow.querySelector('.sideButtonLogo')
    .addEventListener('mouseleave', () => {
      currentSlideButton.reverse();
      currentSlideButton.play();
      currentSlideButton.sideButtonAnimation.finished.then(() => {
        currentSlideButton.sideButtonRow.querySelector('.sideButtonText').style.visibility = 'hidden';
      }
      )
    });
});

// Animacion de las secciones rodeadas
document.querySelectorAll('#aboutThisPage')
  .forEach((elem) => {
    var section = new animatedSurrounding(elem);
    document.addEventListener('scroll', (ev) => {
      if (isInViewport(section.element)) {
        // TODO: Remove section from this event listener after drawing.
        section.play();
      }
    })
  })

// Animacion de la barra de navegacion
anime({
  targets: document.querySelectorAll('nav ol li'),
  easing: 'easeInOutSine',
  opacity: [0, 1],
  translateY: ['-1em', '0'],
  duration: 700,
  delay: anime.stagger(150),
})

// Animacion de la barra con mi correo y resume
// TODO: Cambiar esta animacion
// Quiero que esta animacion se vea como la animacion
// que uso para los botones laterales
anime.timeline({})
  .add({
    targets: '#myEmail',
    easing: 'easeInOutSine',
    translateX: ['1em', '0'],
    opacity: [0, 1],
    duration: 500,
  }).add({
    targets: '#myResume',
    easing: 'easeInOutSine',
    translateY: ['-1em', '0'],
    opacity: [0, 1],
    duration: 600,
  })

// Code animation
var sampleCode = `print('Hello world!')`
var code_animation = new TypeIt("#code", {
  strings: sampleCode,
  speed: 75,
  loop: false,
});
code_animation.go()
