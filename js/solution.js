'use strict'

// основные виды ошибок
const errorType = 'Неверный формат файла. Пожалуйста, выберите изображение в формате .jpg или .png.',
  errorImgStatus = 'Чтобы загрузить новое изображение, пожалуйста, воспользуйтесь пунктом "Загрузить новое" в меню';

// основные переменные
const currentImg = document.querySelector('.current-image'),
  comentsCheckbox = document.querySelector('.comments__marker-checkbox'),
  commentsMarker = document.querySelector('.comments__marker'),
  commentsForm = document.querySelectorAll('.comments__form'),
  menu = document.querySelector('.menu'),
  menuItemDrag = document.querySelector('.drag'),
  app = document.querySelector('.app'),
  burger = document.querySelector('.burger'),
  error = document.querySelector('.error'),
  preloader = document.querySelector('.image-loader'),
  shareButton = document.querySelector('.share'),
  shareTools = document.querySelector('.share-tools'),
  addImgButton = document.querySelector('.new'),
  drawButton = document.querySelector('.draw'),
  commentButton = document.querySelector('.comments'),
  menuURL = document.querySelector('.menu__url')


// выбор активного режима

let modes = [commentButton, drawButton, shareButton]

commentButton.addEventListener('click', (event, modes) => chooseMode(event, modes))
drawButton.addEventListener('click', (event, modes) => chooseMode(event, modes))
shareButton.addEventListener('click', (event, modes) => chooseMode(event, modes))

burger.addEventListener('click', () => {
  modes.forEach(el => {
    el.dataset.choosen = false
  })
})

function chooseMode() {
  modes.forEach(el => {
    el.dataset.choosen = false
  })
  event.currentTarget.dataset.choosen = true
}


// приводим к виду по умолчанию
currentImg.src = '';

let exampleForm = app.querySelector('.comments__form')
exampleForm.parentNode.removeChild(exampleForm)


// функция очистки меню
function clearMenu() {
  Array.from(menu.children).forEach(el => {
    if (!el.classList.contains('drag')) {
      el.style.display = 'none'
    }
  })
}

// функция отображения конкретного элемента меню
function showMenuTool(tool) {
  [...arguments].forEach(el => {
    el.style.display = 'inline-block'
  })
}

clearMenu()
showMenuTool(addImgButton)


// реализация перемещения меню

let moveElement = null;
let moveElementBounds;
let appBounds;
let minX, minY, maxX, maxY;

document.addEventListener('DOMContentLoaded', getAppBounds)

function getAppBounds() {
  appBounds = app.getBoundingClientRect();
  minX = appBounds.left;
  minY = appBounds.top;
  maxX = appBounds.right;
  maxY = appBounds.bottom;
}

menuItemDrag.addEventListener('mousedown', () => {
  moveElement = event.target;
  moveElementBounds = moveElement.getBoundingClientRect();

  getAppBounds()

  maxX = maxX - menu.getBoundingClientRect().width;
  maxY = maxY - menu.getBoundingClientRect().height;
});

document.addEventListener('mousemove', throttle(moveMenu))

function moveMenu() {
  if (moveElement) {
    event.preventDefault();

    let x = event.pageX - moveElementBounds.width / 2
    let y = event.pageY - moveElementBounds.height / 2

    x = Math.min(x, maxX)
    y = Math.min(y, maxY)
    x = Math.max(x, minX)
    y = Math.max(y, minY)

    menu.style.left = x + 'px'
    menu.style.top = y + 'px'

    localStorage.setItem('menuLeft', menu.style.left)
    localStorage.setItem('menuTop', menu.style.top)
  }
}

document.addEventListener('mouseup', () => {
  if (moveElement) {
    moveElement = null;
  }
})


function throttle(callback) {
  let isWaiting = false;
  return function () {
    if (!isWaiting) {
      callback.apply(this, arguments);
      isWaiting = true;
      requestAnimationFrame(() => {
        isWaiting = false;
      })
    }
  }
}

