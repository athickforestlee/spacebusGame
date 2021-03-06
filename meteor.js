<!--캔버스 객체-->
var canvas;
var ctx; <!--컨텍스트로 그리기-->
var canvasBuffer; <!--버퍼 두개로 렌더링 부하 없게 깜빡임 없이 출력.-->
var bufferCtx;
var threadSpeed = 5; <!--루틴 반복되는 시간-->

<!--우주버스-->
var spacebus;
var sx, sy, sw = 60, sh = 35;

<!--배경-->
var background;

<!--유성-->
var meteor = new Array();
var meteorColor = ["orange", "yellow", "white"]; <!--유성 색상들-->
var elapse = 10; <!--속도-->

<!--타이머 인스턴스-->
var loopInstance;

<!--게임의 상태-->
var STATE_START = false;
var STATE_GAMEOVER = false;

<!--키 상태-->
var keyPressed = [];

<!--경과 시간-->
var oldTime;
var startTime;
var totalTime;

window.addEventListener("load", initialize, false);
window.addEventListener("keydown", getKeyDown, false);
window.addEventListener("keyup", getKeyUp, false);

function initialize()
{
  canvas = document.getElementById("canvas");
  if(canvas==null || canvas.getContext==null)
    return;
  ctx = canvas.getContext("2d");

  canvasBuffer = document.createElement("canvas");
  canvasBuffer.width = canvas.width;
  canvasBuffer.height = canvas.height;
  bufferCtx = canvasBuffer.getContext("2d");

  startMessage(); <!--게임 시작 문구-->

  setImage(); <!--이미지 설정-->

  loopInstance = setInterval(update, threadSpeed); <!--반복 루틴 설정-->
}

function startMessage()
{
  drawText(ctx, "Enter키를 누르면 시작합니다.", canvas.width/2, canvas.height/2 - 60, "bold 30px arial", "white", "center", "top");
  drawText(ctx, "조작 : 방향키 ←↑→↓", canvas.width/2, canvas.height/2 - 20, "bold 20px arial", "red", "center", "top");
}

function drawText(ctx, text, x, y, font, color, align, base)
{
  if (font != undefined) ctx.font = font;
  if (color != undefined) ctx.fillStyle = color;
  if (align != undefined) ctx.textAlign = align;
  if (base != undefined) ctx.textBaseline = base;
  ctx.fillText(text, x, y);
}

function setImage()
{
  spacebus = new Image();
  spacebus.src = "bus.png";
  background = new Image();
  background.src = "space.jpg";
}

function update()
{
  if((keyPressed[13] == true) && !STATE_START) <!--13은 enter-->
  {
    startGame();
  }

  if((keyPressed[38])) <!--38은 ↑-->
  {
    sy -= 3;
    angle = 0;
  }

  if((keyPressed[40])) <!--40은 ↓-->
  {
    sy += 3;
    angle = 180;
  }

  if((keyPressed[37])) <!--37은 ←-->
  {
    sx -= 3;
    angle = 270;
  }

  if((keyPressed[39])) <!--39는 →-->
  {
    sx += 3;
    angle = 90;
  }

  if((keyPressed[32] == true)) <!--32는 Spacebar-->
  {
    document.location.reload(); <!--새로고침-->
    startGame();
  }

  moveMeteor(elapse);

  drawAll();
}

function startGame()
{
  STATE_START = true;

  <!--우주버스 시작 위치-->
  sx = canvas.width/2 - 18;
  sy = canvas.height/2 - 18;
  sw = 60;
  sh = 35;

  createMeteor(); <!--유성 생성-->

  startTime = getTime(); <!--현재 시간 저장-->
}

function getKeyDown(event) <!--키 눌렀을 때-->
{
  keyPressed[event.keyCode] = true;
}

function getKeyUp(event) <!--키 안 눌렀을 때-->
{
  keyPressed[event.keyCode] = false;
}

function drawAll()
{
  if(!STATE_START)
  {
    return;
  }
  else if(STATE_GAMEOVER)
  {
    stopGame();
    drawText(ctx, "점수는", canvas.width/2, canvas.height/2 - 100, "bold 30px arial", "pink", "center", "top");
    drawText(ctx, totalTime, canvas.width/2, canvas.height/2 - 60, "bold 30px arial", "white", "center", "top");
    drawText(ctx, "Spacebar키를 누르면 다시 시작합니다.", canvas.width/2, canvas.height/2 - 20, "bold 30px arial", "red", "center", "top");
  }
  else
  {
    drawBk(); <!--배경 출력-->

    drawPlayer(); <!--우주버스 출력-->
    ctx.drawImage(canvasBuffer, 0, 0);

    drawMeteor(); <!--유성 출현-->

    totalTime = (getTime() - startTime); <!--끝났을 때 시간 - 시작했을 때 시간-->
    drawText(ctx, totalTime, canvas.width - 10, 10, "20px arial", "red", "right", "top");
  }
}

function stopGame()
{
  STATE_START = false;
}

function drawPlayer() <!--우주버스 출력-->
{
  bufferCtx.drawImage(spacebus, sx-sw/2, sy-sh/2); <!--이미지 그리는 drawimage함수-->
}

function drawBk() <!--배경 출력-->
{
  bufferCtx.drawImage(background, 0, 0);
}

function createMeteor() <!--유성 생성-->
{
  meteor.length = 0;
  for(var i = 0; i < 60; i++)
  {
    meteor.push( <!--0부터59까지 넣고 길이 60 리턴-->
    { <!--x,y는 유성 시작 위치 vx,vy는 유성 이동 방향-->
      x:Math.random() * canvas.width, <!--x축 랜덤으로 시작-->
      y:(i < 10/2 ? 20 : canvas.height-20), <!--0~29는 y축20에서 시작 30~59는  y축-20에서 시작-->
      vx:Math.random() * 200 - 100, <!--x축 방향값 랜덤-->
      vy:Math.random() * 200 - 100, <!--y축 방향값 랜덤-->
      color:Math.floor(Math.random() * 3) <!--3가지 색상 유성 출력-->
    });
  }
}

function moveMeteor(elapse) <!--유성 이동-->
{
  for(var i = 0; i < 60; i++)
  {
    var mx = meteor[i].vx * elapse / 1000;
    var my = meteor[i].vy * elapse / 1000;
    meteor[i].x += mx; <!--유성의 위치를 계속 변경-->
    meteor[i].y += my;
    if (meteor[i].x > canvas.width) meteor[i].x = 0; <!--유성의 x위치값이 캔버스 넓이를 넘어가면 0으로-->
    if (meteor[i].x < 0) meteor[i].x = canvas.width;
    if (meteor[i].y > canvas.height) meteor[i].y = 0; <!--유성의 y위치값이 캔버스 높이를 넘어가면 0으로-->
    if (meteor[i].y < 0) meteor[i].y = canvas.height;

    crashMeteor(i); <!--충돌 -->
  }
}

function drawMeteor() <!--유성 그리기-->
{
  for (var i = 0; i < 60; i++)
  {
    ctx.beginPath();
    ctx.arc(meteor[i].x, meteor[i].y, 5, 0, 2 * Math.PI); <!--원그리기함수-->
    ctx.fillStyle = meteorColor[meteor[i].color];
    ctx.closePath();
    ctx.fill();
  }
}

function crashMeteor(index) <!--유성 충돌-->
{
  var mx = meteor[index].x;
  var my = meteor[index].y;

  if (mx > sx-sw/2 && mx < sx+sw/2 && my > sy-sh/2 && my < sy+sh/2)
  {
    STATE_GAMEOVER = true; <!--하나의 유성이라도 버스와 위치가 닿았을 때 게임 종료-->
  }
}

function getTime() <!--시간(점수) 구하기-->
{
  var date = new Date();
  var time = date.getTime();
  delete date;
  return time;
}
