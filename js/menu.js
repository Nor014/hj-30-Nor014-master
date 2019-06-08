'use strict'

function activeMenu(buttons) {
  [...arguments].forEach(button => {
   
    button.addEventListener('click', () => {
      // скрываем все элементы
      Array.from(menu.children).forEach(el => {
        if (!el.classList.contains('drag')) {
          el.style.display = 'none'
        }
      })

      // показываем активный
      event.currentTarget.style.display = 'inline-block';
      document.querySelector(`.${button.classList[2]}-tools`).style.display = 'inline-block';
      burger.style.display = 'inline-block';

    })
  });
}


activeMenu(shareButton, drawButton, commentButton)

burger.addEventListener('click', () => {

  Array.from(menu.children).forEach(el => {
    if (!el.classList.contains('drag')) {
      el.style.display = 'none'
    }
  })

  shareButton.style.display = 'inline-block';
  drawButton.style.display = 'inline-block';
  commentButton.style.display = 'inline-block';
  addImgButton.style.display = 'inline-block';
  burger.style.display = 'none';
})
