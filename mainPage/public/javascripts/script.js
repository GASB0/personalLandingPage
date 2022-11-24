// augroup javascript | au! BufWritePost <buffer> silent exec '!npx browserify %:p -o %:r2.js' | augroup END
import { default as anime } from './animejs/lib/anime.es.js';
import * as THREE from './three/build/three.module.js';
import { WebGL } from './WebGL.js';
import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from './three/examples/jsm/postprocessing/GlitchPass.js';
import { BloomPass } from './three/examples/jsm/postprocessing/BloomPass.js';
import { ShaderPass } from './three/examples/jsm/postprocessing/ShaderPass.js';
import { LuminosityShader } from './three/examples/jsm/shaders/LuminosityShader.js';
import { AfterimagePass } from './three/examples/jsm/postprocessing/AfterimagePass.js'
import { UnrealBloomPass } from './three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { default as TypeIt } from './typeit/dist/index.es.js';

// Declaracion de todas las funciones que voy a utilizar
function nextSectCB() {
  if (sectIndex < sections.length - 1) {
    sections[sectIndex + 1].scrollIntoView();
    return true;
  }
  return false;
}

function formerSectCB() {
  if (sectIndex > 0) {
    sections[sectIndex - 1].scrollIntoView();
    return true;
  }
  return false;
}

function isInViewport(element) {
  // Revisar si el elemento esta dentro del viewport
  const rect = element.getBoundingClientRect();
  return (
    (Math.abs(rect.top) / 2) <= window.innerHeight / 4 &&
    rect.left >= 0
  );
}

// Animacion para el cambio de pagina
function fadeOutAnim(target, arg) {
  return anime({
    targets: target,
    autoplay: true,
    opacity: 0,
    easing: 'easeOutSine',
    duration: 300,
    delay: anime.stagger(100),
    complete: () => {
      target.forEach(elem => {
        elem.style.opacity = 1;
      })
      setCurrentPage(arg)
    }
  })
}

function fadeInAnim(target) {
  return anime({
    targets: target,
    autoplay: true,
    opacity: [0, 1],
    easing: 'easeOutSine',
    duration: 300,
  })
}

function disableScroll() {
  // Get the current page scroll position
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  // if any scroll is attempted, set this to the previous value
  window.onscroll = function() {
    window.scrollTo(scrollLeft, scrollTop);
  };
}

function enableScroll() {
  window.onscroll = function() { };
}

disableScroll();
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

//-------------------------------------------------------------//
// Definicion de las animaciones de la pagina
//-------------------------------------------------------------//

// Title animation:
var titleWrapper = document.getElementById('upper')
titleWrapper.innerHTML = titleWrapper.textContent.trim().replace(/(.)/g, "<div class='titleLetter' style='float: left;'>$&</div>");

var titleAnim = anime.timeline({ easing: 'easeOutExpo', autoplay: false });
titleAnim.add({
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
  delay: 2300,
  targets: '#lower',
  opacity: [1, 0],
  translateY: [0, 30],
  duration: 2000,
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
    speed: 60,
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
var leftBarAnimation = anime({
  autoplay: false,
  targets: ['.animate-thing path', '.animate-thing rect', '.animate-thing line', '.animate-thing polyline', '.animate-thing circle'],
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutSine',
  duration: 500,
  delay: function(el, i) { return (i * 60); },
  opacity: [0, 1],
});

// Animaciones de estos botones
var scrollButtonsAnim = anime({
  autoplay: false,
  targets: document.querySelectorAll('#sectButtons > div'),
  easing: 'easeInOutExpo',
  translateX: ['100%', 0],
  delay: anime.stagger(10),
  duration: 800,
})

// TODO: hacer esto con CSS
// Centralizacion los elementos laterales
window.addEventListener('load', () => {
  for (let i = 0; i < document.querySelectorAll('.sideStuff').length; i++) {
    let thingToCentralize = document.querySelectorAll('.sideStuff')[i];
    let padding = (window.innerHeight - thingToCentralize.offsetHeight) / 2;
    thingToCentralize.style.bottom = `${padding}px`;
  }
})

window.addEventListener('resize', () => {
  for (let i = 0; i < document.querySelectorAll('.sideStuff').length; i++) {
    let thingToCentralize = document.querySelectorAll('.sideStuff')[i];
    let padding = (window.innerHeight - thingToCentralize.offsetHeight) / 2;
    thingToCentralize.style.bottom = `${padding}px`;
  }
})

// Animacion de la pantalla de carga:
let loaderAnim = anime.timeline({
  autoplay: false,
  loop: false,
}).add({
  targets: document.getElementById('pageLoader'),
  opacity: [1, 0],
  easing: 'easeInOutSine',
  duration: 1300,
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

// Animacion del About
var aboutAnimation = anime.timeline({
  autoplay: false,
  loop: false,
}).add({
  targets: document.querySelectorAll('#aboutThisPage .aboutMePart p'),
  opacity: [0, 1],
  translateY: ['-2.5rem', 0],
  easing: 'easeInOutSine',
  duration: 500,
}).add({
  targets: document.querySelector('.aboutThisPage'),
  opacity: [0, 1],
  translateX: ['5rem', 0],
  easing: 'spring(1, 60, 10, 0)',
  duration: 800,
})

var aboutEvListenerCB = () => {
  if (isInViewport(document.querySelector('#aboutThisPage'))) {
    aboutAnimation.play();
    document.removeEventListener('scroll', aboutEvListenerCB)
  }
}

// Animacion de la barra de navegacion
var navBarAnim = anime({
  autoplay: false,
  targets: document.querySelectorAll('nav ol li'),
  easing: 'easeInOutSine',
  opacity: [0, 1],
  translateY: ['-1em', '0'],
  duration: 700,
  delay: anime.stagger(150),
})

// Animacion de la barra con mi correo y resume
var leftBarAnim = anime.timeline({ autoplay: false })
  .add({
    targets: '#myEmail',
    easing: 'easeInOutExpo',
    translateX: ['1em', '0'],
    opacity: [0, 1],
    duration: 300,
  })
//.add({
//   targets: '#myResume',
//   easing: 'easeInOutSine',
//   translateY: ['-1em', '0'],
//   opacity: [0, 1],
//   duration: 600,
// })

// Code animation
var code_animation = new TypeIt("#sampleCode3", {
  speed: 75,
  loop: false,
});

// Skills animation
var stuffIKnowAnimation = anime.timeline({ autoplay: false, loop: false, }).add({
  targets: [document.querySelectorAll('#stuffIKnow .container h2'),
  document.querySelectorAll('#stuffIKnow .container h3'),
  document.querySelectorAll('#stuffIKnow .container .skillsList')],
  easing: 'easeInOutSine',
  opacity: [0, 1],
  duration: 1000,
}).add({
  targets: document.querySelectorAll('.skillsList ul li'),
  easing: 'easeInOutSine',
  opacity: [0, 1],
  duration: 500,
  delay: anime.stagger(70),
}, '-=750')
  .add({
    targets: document.querySelectorAll('.codeWindow'),
    easing: 'spring(1, 60, 10, 0)',
    translateX: ['4em', '0'],
    opacity: [0, 1],
    duration: 1000,
    delay: anime.stagger(400),
    complete: () => {
      code_animation.go();
    }
  })

var skillsEvListenerCB = () => {
  if (isInViewport(document.querySelector('#stuffIKnow'))) {
    stuffIKnowAnimation.play();
    document.removeEventListener('scroll', skillsEvListenerCB)
  }
}

// Animaciones para la seccion de updates de blogs
var blogUpdatesAnimation = anime({
  targets: document.querySelectorAll('#blogUpdatesSection .container'),
  opacity: [0, 1],
  translateY: ['8em', '0'],
  easing: 'easeInOutExpo',
  duration: 1000,
})

var blogEvListenerCB = () => {
  if (isInViewport(document.getElementById('blogUpdatesSection'))) {
    document.querySelector('#blogUpdatesSection .container').style.visibility = 'visible';
    blogUpdatesAnimation.play();
    document.removeEventListener('scroll', blogEvListenerCB)
  }
}

// Paginado de los proyectos hechos hasta el momento. Cortesia de:
// https://webdesign.tutsplus.com/tutorials/pagination-with-vanilla-javascript--cms-41896

const paginationNumbers = document.getElementById("pagination-numbers");
const paginatedList = document.getElementById("paginated-list");
const listItems = paginatedList.querySelectorAll("li");

const paginationLimit = 2;
const pageCount = Math.ceil(listItems.length / paginationLimit);
let currentPage = 1;

// Funcion para la generacion de los botones correspondientes a las paginas
const appendPageNumber = (index) => {
  const pageNumber = document.createElement("button");
  pageNumber.className = "pagination-number";
  pageNumber.innerHTML = index;
  pageNumber.setAttribute("page-index", index);
  pageNumber.setAttribute("aria-label", "Page " + index);

  paginationNumbers.appendChild(pageNumber);
};

// Generando los bontones para el numero de paginas calculadas
const getPaginationNumbers = () => {
  for (let i = 1; i <= pageCount; i++) {
    appendPageNumber(i);
  }
};

const handleActivePageNumber = () => {
  document.querySelectorAll(".pagination-number").forEach((button) => {
    button.classList.remove("active");
    const pageIndex = Number(button.getAttribute("page-index"));
    if (pageIndex == currentPage) {
      button.classList.add("active");
    }
  });
};

const setCurrentPage = (pageNum) => {
  currentPage = pageNum;
  handleActivePageNumber();

  const prevRange = (pageNum - 1) * paginationLimit;
  const currRange = pageNum * paginationLimit;

  listItems.forEach((item, index) => {
    item.classList.add("hidden");
    if (index >= prevRange && index < currRange) {
      item.classList.remove("hidden");
      fadeInAnim(item);
    }
  });
};

var projectsSectionSetUp = () => {
  window.addEventListener("load", () => {
    getPaginationNumbers();
    setCurrentPage(1);

    document.querySelectorAll(".pagination-number").forEach((button) => {
      const pageIndex = Number(button.getAttribute("page-index"));

      if (pageIndex) {
        button.addEventListener("click", () => {
          fadeOutAnim(document.querySelector('#paginated-list').querySelectorAll('li:not(.hidden)'), pageIndex)
        });
      }
    });

    var projectEvListenerCB = () => {
      if (isInViewport(document.getElementById('projectsSection'))) {
        document.getElementById('projectsContainer').style.visibility = 'visible';
        projectsAnimation.play();
        document.removeEventListener('scroll', projectEvListenerCB);
      }
    }

    document.addEventListener('scroll', projectEvListenerCB);
  });
}

// Animacion para la aparicion de las cartas de los proyectos realizados
let projectsAnimation = anime.timeline({ autoplay: false, loop: false })
  .add({
    targets: document.querySelectorAll('#paginated-list li'),
    opacity: [0, 1],
    translateY: ['5rem', 0],
    easing: 'easeOutSine',
    duration: 500,
    delay: anime.stagger(50),
  })

// Botones de cambio de seccion
var sections = Array.from(document.querySelectorAll('section'));
var sectIndex = 0;

document.addEventListener('scroll', (ev) => {
  document.querySelectorAll('section').forEach(sect => {
    if (isInViewport(sect)) {
      sectIndex = sections.indexOf(sect);
    }
  })
})

// Setup de la pagina luego de que termine de cargar el body
document.onreadystatechange = () => {
  if (document.readyState == 'complete') {
    // Renderizando el verdadero contenido de la pagina:

    // Preparando las animaciones iniciales
    let loader = document.getElementById('pageLoader');
    loaderAnim.play();
    loaderAnim.complete = () => {
      loader.style.display = 'none';
      loader.remove();
      enableScroll();
    }

    navBarAnim.play();
    leftBarAnim.complete = () => {
      titleAnim.play();
    }
    scrollButtonsAnim.complete = () => {
      leftBarAnim.play();
    }
    leftBarAnimation.complete = () => {
      document.getElementById("formerSectButton").addEventListener('click', formerSectCB);
      document.getElementById("nextSectButton").addEventListener('click', nextSectCB);
      document.getElementById("pageTop").addEventListener('click', () => { sections[0].scrollIntoView(); })
      document.getElementById("pageBottom").addEventListener('click', () => { sections[sections.length - 1].scrollIntoView(); });
      scrollButtonsAnim.play();
    }
    navBarAnim.complete = () => {
      leftBarAnimation.play();
    }

    // Preparando las secciones:
    document.addEventListener('scroll', aboutEvListenerCB);
    document.addEventListener('scroll', skillsEvListenerCB)
    document.addEventListener('scroll', blogEvListenerCB)
    projectsSectionSetUp();

    // Iniciando las animaciones 3D:
    if (WebGL.isWebGLAvailable()) {
      animate();
    } else {
      const warning = WebGL.getWebGLErrorMessage();
      console.log(warning);
      // document.getElementById("container3d").removeChild()
    }
  }
}

// Efecto de las estrellas
// const starback = new Starback(document.getElementById('theCanvas'), {
//   type: 'dot',
//   quantity: 200,
//   direction: 225,
//   backgroundColor: ['#1B1B1B'],
//   randomOpacity: true,
//   height: document.getElementById('presentation').clientHeight,
//   width: document.getElementById('presentation').clientWidth,
// })

// FIXME: Debes encontra otro metodo para que las cartas de los proyectos no se solapen
// con el contenido de la seccion de mas abajo
document.querySelector('#blogUpdatesSection').addEventListener('mouseenter', () => {
  document.querySelector('#blogUpdatesSection .container').style.zIndex = "0";
})

document.querySelector('#blogUpdatesSection').addEventListener('mouseleave', () => {
  document.querySelector('#blogUpdatesSection .container').style.zIndex = "-1";
})

// Chulerias de 3D
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("container3d").appendChild(renderer.domElement)

// Adding mouse interaction
var mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  mouseX = (event.clientX - (windowHalfX)) * 0.005;
  mouseY = (event.clientY - (windowHalfY)) * 0.005;
}, false);

// Particle system:
var textureLoader = new THREE.TextureLoader();
var pGeometry = new THREE.BufferGeometry();
var pNum = 1000;
var vertices = new Float32Array(3 * pNum);

function randn_bm() {
  let u = 1 - Math.random(); //Converting [0,1) to (0,1)
  let v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

for (let i = 0; i < pNum; i++) {
  vertices[i * 3 + 0] = (randn_bm()) * 5;
  vertices[i * 3 + 1] = (randn_bm()) * 5;
  vertices[i * 3 + 2] = (randn_bm()) * 5;
}

pGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

var pMaterial = new THREE.PointsMaterial({
  size: 0.07,
  map: textureLoader.load('images/sprite.png'),
  transparent: true,
  opacity: 0.25,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true,
});

var moverGroup = new THREE.Object3D();
const particles = new THREE.Points(pGeometry, pMaterial);
moverGroup.add(particles)

scene.add(moverGroup)

// Setting camera
camera.position.z = 5;
camera.lookAt(scene.position);

// Post processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new BloomPass(100, 100, 4);
const glitchPass = new GlitchPass(1);
const lumiPass = new ShaderPass(LuminosityShader);
const afterPass = new AfterimagePass(0.7);
const unrealBloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  3,
  0.9,
  0.1
);

composer.passes = [renderPass, afterPass, unrealBloom];

// Animating
function animate() {
  requestAnimationFrame(animate);
  composer.render()

  moverGroup.rotation.x += 0.001;
  moverGroup.rotation.y += 0.001;

  camera.position.x += (mouseX - camera.position.x) * .05;
  camera.position.y += (-mouseY - camera.position.y) * .05;
  camera.lookAt(scene.position);
}

// Este listener es el responsable de actualizar las dimensiones de la escena 
// al momento de cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  composer.render()
}, false);
