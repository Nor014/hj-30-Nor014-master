'use strict'

function showComments() {
  Array.from(document.querySelectorAll('.comments__form')).forEach(el => {
    el.style.display = 'block';
  })
}

function hideComments() {
  Array.from(document.querySelectorAll('.comments__form')).forEach(el => {
    el.style.display = 'none';
  })
}

// отслеживаем режим комментирования

const toggleButton = document.querySelector('.menu__toggle-bg'),
  commentsOn = document.querySelector('#comments-on'),
  commentsOFF = document.querySelector('#comments-off')


toggleButton.addEventListener('click', () => {
  if (commentsOFF.checked) {
    hideComments()
  }

  if (commentsOn.checked) {
    showComments()
  }
})


function canvasClick(event) {

  if (commentsOn.checked && commentButton.dataset.choosen === 'true') {

    console.log(commentButton.dataset)
    let x = event.offsetX
    let y = event.offsetY
    let fromClick = true

    findEmptyForm()
    createCommentBlock(x, y, [], fromClick)
  }
}


function createCommentBlock(x, y, comments = [], fromClick = false) {

  // Создаем шаблон формы
  const textarea = document.createElement('textarea')
  textarea.classList.add('comments__input')
  textarea.setAttribute('type', 'text')
  textarea.setAttribute('placeholder', 'Напишите ответ...')

  const inputClose = document.createElement('input')
  inputClose.classList.add('comments__close')
  inputClose.setAttribute('type', 'button')
  inputClose.setAttribute('value', 'закрыть')

  const inputMessage = document.createElement('input')
  inputMessage.classList.add('comments__submit')
  inputMessage.setAttribute('type', 'submit')
  inputMessage.setAttribute('value', 'отправить')

  const commentsBody = document.createElement('div')
  commentsBody.classList.add('comments__body')
  commentsBody.style.zIndex = '3'

  const loader = document.createElement('div')
  loader.classList.add('loader')
  loader.style.display = 'none'

  loader.appendChild(document.createElement('span'))
  loader.appendChild(document.createElement('span'))
  loader.appendChild(document.createElement('span'))
  loader.appendChild(document.createElement('span'))

  commentsBody.appendChild(loader)
  commentsBody.appendChild(textarea)
  commentsBody.appendChild(inputClose)
  commentsBody.appendChild(inputMessage)

  const checkbox = document.createElement('input')
  checkbox.classList.add('comments__marker-checkbox')
  checkbox.setAttribute('type', 'checkbox')
  checkbox.style.zIndex = '2'

  // если создаем форму кликом, открываем интерфейс
  if (fromClick === true) {
    document.querySelectorAll('.comments__marker-checkbox').forEach(el => {
      if (el.checked) el.checked = false
    })
    checkbox.checked = true
  }

  const span = document.createElement('span')
  span.classList.add('comments__marker')

  const form = document.createElement('form')
  form.classList.add('comments__form')
  form.appendChild(span)
  form.appendChild(checkbox)
  form.appendChild(commentsBody)

  // атрибут для отслеживания пустой формы
  form.dataset.formWithComments = 'false'

  // Отправка сообщения
  form.addEventListener('submit', (e) => sendFormMessage(e, x, y))

  // Закрыть форму
  form.querySelector('.comments__close').addEventListener('click', () => {
    form.querySelector('.comments__marker-checkbox').checked = false
  })

  // только одна активная форма
  form.querySelector('.comments__marker-checkbox').addEventListener('click', () => {
    document.querySelectorAll('.comments__marker-checkbox').forEach(el => {
      if (el.checked) el.checked = false
    })
    event.target.checked = true
  })

  // координаты создания формы (по клику или по полученным с сервера данным)
  form.style.left = x + 'px'
  form.style.top = y + 'px'
  form.style.zIndex = '3';
  form.dataset.left = x;
  form.dataset.top = y;

  document.querySelector('.comments_container').appendChild(form)

  // отрисовка сообщений
  comments.forEach((comment) => {
    createComment(comment, form)
  })
}



function sendFormMessage(event, x, y) {
  event.preventDefault()
  const form = event.target;
  const message = form.querySelector('.comments__input').value
  form.querySelector('.loader').style.display = 'block'

  const body = `message=${message}&left=${x}&top=${y}`;

  let url;
  if (currentUrl) {
    url = currentUrl
  } else {
    url = localStorage.getItem('URL_ID')
  }

  console.log(currentUrl)
  fetch(`https://neto-api.herokuapp.com/pic/${url}/comments`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  }).then(res => res.json())
    .then((data) => {
      if (typeof data === 'string') return console.log('Error: ', data);

      form.querySelector('.loader').style.display = 'none'
      form.querySelector('.comments__input').value = '';

      // находим последний коментарий, отрисовываем его
      // const lastComment = Object.values(data.comments).sort((a, b) => b.timestamp - a.timestamp)[0];
      // createComment(lastComment, form);
    })
}


function createComment({ timestamp, message }, form) {

  const comment = document.createElement('div')
  comment.classList.add('comment')

  const commentTime = document.createElement('p')
  commentTime.classList.add('comment__time')

  commentTime.innerText = new Date(timestamp).toLocaleString('ru', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });

  const commentMessage = document.createElement('p')
  commentMessage.classList.add('comment__message')
  commentMessage.innerText = message

  comment.appendChild(commentTime)
  comment.appendChild(commentMessage)

  const beforeChild = form.querySelector('.loader')

  form.querySelector('.comments__body').insertBefore(comment, beforeChild)

  form.dataset.formWithComments = 'true'

}


function findEmptyForm() {
  let formWithComments = commentsContainer.querySelectorAll('[data-form-with-comments]');
  let emptyForms = Array.from(formWithComments).filter(el => el.dataset.formWithComments === 'false');

  if (emptyForms.length >= 1) emptyForms.forEach(el => el.parentNode.removeChild(el));
}