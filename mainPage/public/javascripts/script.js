var anime = require('animejs');
var TypeIt = require('typeit');

// Title animation:
var titleWrapper = document.getElementById('upper')
titleWrapper.innerHTML = titleWrapper.textContent.trim().replace(/(.)/g, "<div class='titleLetter' style='float: left;'>$&</div>");

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

// TODO: hacer esto con CSS
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

// Animacion del About
var aboutAnimation = anime.timeline({
  autoplay: false,
  loop: false,
}).add({
  targets: document.querySelector('#aboutThisPage .aboutMePart p'),
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

document.addEventListener('scroll', aboutEvListenerCB)

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
  delay: anime.stagger(140),
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
document.addEventListener('scroll', skillsEvListenerCB)


// Animaciones para la seccion de updates de blogs
var blogUpdatesAnimation = anime({
  targets: document.querySelectorAll('#blogUpdatesSection .container'),
  opacity: [0, 1],
  translateY: ['8em', '0'],
  easing: 'easeInOutExpo',
  duration: 1700,
})

var blogEvListenerCB = () => {
  if (isInViewport(document.getElementById('blogUpdatesSection'))) {
    document.querySelector('#blogUpdatesSection .container').style.visibility = 'visible';
    blogUpdatesAnimation.play();
    document.removeEventListener('scroll', blogEvListenerCB)
  }
}

document.addEventListener('scroll', blogEvListenerCB)

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

// Animacion para la aparicion de las cartas de los proyectos realizados
let projectsAnimation = anime.timeline({ autoplay: false, loop: false })
  // .add({
  //   targets: document.querySelectorAll('.pagination-number'),
  //   opacity: [0, 1],
  //   easing: 'easeOutSine',
  //   duration: 1000,
  //   delay: anime.stagger(50),
  // })
  .add({
    targets: document.querySelectorAll('#paginated-list li'),
    opacity: [0, 1],
    translateY: ['5rem', 0],
    easing: 'easeOutSine',
    duration: 500,
    delay: anime.stagger(50),
  })

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
