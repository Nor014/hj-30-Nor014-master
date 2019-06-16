
const drawTool = document.querySelector('.draw'),
  drawColors = document.querySelectorAll('.draw-tools input')


let mousedown,
  moveToX,
  moveToY,
  drawColor,
  canvas,
  ctx


function beginDraw() {
  if (drawTool.dataset.choosen === 'true') {

    mousedown = true;
    moveToX = event.offsetX;
    moveToY = event.offsetY;
    ctx.lineWidth = 4;

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    drawColor = Array.from(drawColors).find(color => color.checked).value

    if (drawColor === 'red') ctx.strokeStyle = '#ea5d56'
    if (drawColor === 'yellow') ctx.strokeStyle = '#f3d135'
    if (drawColor === 'green') ctx.strokeStyle = '#6cbe47'
    if (drawColor === 'blue') ctx.strokeStyle = '#53a7f5'
    if (drawColor === 'purple') ctx.strokeStyle = '#b36ade'
  }
}


function draw() {
  if (mousedown && drawTool.style.display === 'inline-block') {
    ctx.beginPath()

    ctx.moveTo(moveToX, moveToY)
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.closePath();

    moveToX = event.offsetX;
    moveToY = event.offsetY;

  }
}

function stopDraw() {
  if (drawTool.dataset.choosen === 'true') {
    sendBlob()
    mousedown = false;
    moveToX = null;
    moveToY = null;
  }
}

function canvasThrottle(callback, delay) {

  let isWaiting = false;

  return function () {
    if (!isWaiting) {
      callback.apply(this, arguments);
      isWaiting = true;
      setTimeout(() => {
        isWaiting = false;
      }, delay)
    }
  }
}

function sendBlob() {
  canvas.toBlob(function (blob) {
    connection.send(blob)
  })
}