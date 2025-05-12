let car;
let bots = [];
let trackImg;
let botImgs = [];
let gameState = 'countdown';
let countdown = 3;
let countdownTimer;
let startTimer;
let lapStartZone = { x: 300, y: 850, r: 50 };
let playerLaps = 0;
let leaderboard = [];
let gameEnded = false;
let bgMusic;

FILL(255);
textSize(16);
text("Use Arrow Keys: ↑ Forward, ← Left, → Right", 20, 100);


function preload() {
  trackImg = loadImage('assets/4 (2) (1).png');
  playerImg = loadImage('assets/1gokart.png');
 


  for (let i = 0; i < 4; i++) {
    botImgs[i] = loadImage(`assets/bot${i}.png`);
  }
  bgMusic = loadSound('assets/bgm.mp3');
}

function setup() {
  createCanvas(1600, 1000);
  fill(255);
 
  
  frameRate(60);
  

  car = {
    x: 298,
    y: 809,
    angle: 0,
    speed: 0,
    width: 40,
    height: 20,
    direction: { x: 0, y: 0 },
    justCrossed: false
  };
  for (let i = 0; i < 4; i++) {
  bots.push({
    path: getBotPath(i), 
    currentPoint: 0,
    x: 298 + i * 30, 
    y: 846,
    speed: 2 + i,
    direction: { x: 0, y: 0 },
    size: 40,
    img: botImgs[i],
    laps: 0,
    justCrossed: false,
    finished: false,
    name: `Bot ${i + 1}`
  });
}


  function getBotPath(i) {
  const basePath = [
    { x: 309, y: 887 }, { x: 446, y: 903 }, { x: 846, y: 900 },
    { x: 1185, y: 892 }, { x: 1264, y: 826 }, { x: 1333, y: 739 },
    { x: 1314, y: 635 }, { x: 1295, y: 495 }, { x: 1374, y: 331 },
    { x: 1311, y: 205 }, { x: 1149, y: 139 }, { x: 818, y: 139 },
    { x: 714, y: 227 }, { x: 835, y: 350 }, { x: 974, y: 405 },
    { x: 985, y: 531 }, { x: 917, y: 626 }, { x: 799, y: 572 },
    { x: 714, y: 495 }, { x: 629, y: 665 }, { x: 476, y: 700 },
    { x: 402, y: 558 }, { x: 512, y: 279 }, { x: 369, y: 158 },
    { x: 180, y: 273 }, { x: 175, y: 772 }, { x: 224, y: 835 }
  ];

  
  return basePath.map(p => ({
    x: p.x + i * 5, 
    y: p.y + i * 3  
  }));
}
  countdownTimer = setInterval(() => {
    if (countdown > 0) {
      countdown--;
    } else {
      gameState = 'startScreen';
      clearInterval(countdownTimer);
      startTimer = setTimeout(() => {
        gameState = 'playing';
      }, 1000);
    }
  }, 1000);
}

function draw() {
  background(175, 151, 100);
  push();
  translate(width / 2 - car.x, height / 2 - car.y);
  if (gameState === 'playing' || gameState === 'leaderboard') {
  fill(255);
  textSize(24);
  text(`Laps: ${playerLaps}/1`, car.x - width / 2 + 20, car.y - height / 2 + 80);
}



  drawTrack();

  if (gameState === 'countdown') {
    displayCountdown();
  } else if (gameState === 'startScreen') {
    displayStartMessage();
  } else if (gameState === 'playing') {
    moveCar();
    drawCar();
    drawBots();
    checkOffTrackCollision();
    checkBotCollisions();
    checkLapCompletion();
    if (gameState === 'leaderboard') {
  fill(0, 150);
  rect(width / 2 - 200, height / 2 - 150, 400, 300, 20);
  fill(255);
  textAlign(CENTER, TOP);
  textSize(32);
  text("🏁 Leaderboard 🏁", width / 2, height / 2 - 120);
  textSize(24);
  for (let i = 0; i < leaderboard.length; i++) {
    let entry = leaderboard[i];
    text(`${i + 1}. ${entry.name} - ${entry.laps} laps`, width / 2, height / 2 - 70 + i * 40);
  }
}
  }

  pop();

  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  text(`Speed: ${car.speed.toFixed(1)}`, 20, 20);

  fill(255);
  rect(20, 60, 200, 20);
  fill(0, 200, 0);
  rect(20, 60, constrain(car.speed * 20, 0, 200), 20);
}

function drawTrack() {
  image(trackImg, 0, 0);
}

function keyPressed() {
  if (!bgMusic.isPlaying()) {
    userStartAudio(); // required for Chrome
    bgMusic.setVolume(0.5);
    bgMusic.play();
    console.log('Audio started');
  }
}

function displayCountdown() {
  fill(255);
  textSize(100);
  textAlign(CENTER, CENTER);
  text(countdown, width / 2, height / 2);
}

function displayStartMessage() {
  fill(255);
textSize(100);
textAlign(CENTER, CENTER);
textStyle(BOLDITALIC);
let alpha = map(sin(frameCount * 0.1), -1, 1, 100, 255);
fill(255, alpha);
text('START', width / 2, height / 2);}

function moveCar() {
  if  (keyIsDown(UP_ARROW)) {
  car.speed += 0.1;
  car.speed = constrain(car.speed, 0,5.5); }


  if (keyIsDown(LEFT_ARROW)) car.angle -= 0.05;
  if (keyIsDown(RIGHT_ARROW)) car.angle += 0.05;

  car.direction.x = cos(car.angle) * car.speed;
  car.direction.y = sin(car.angle) * car.speed;

  car.x += car.direction.x;
  car.y += car.direction.y;

  if (!keyIsDown(UP_ARROW)) {
  car.speed *= 0.98; // slow down gradually
  if (car.speed < 0.05) car.speed = 0; // stop if too slow
}
}

function drawCar() {
  push();
  translate(car.x, car.y);
  rotate(car.angle);
  imageMode(CENTER);
  image(playerImg, 0, 0, car.width, car.height);
  pop();
}

function drawBots() {
  for (let bot of bots) {
    let target = bot.path[bot.currentPoint];
    let dx = target.x - bot.x;
    let dy = target.y - bot.y;
    let distToTarget = dist(bot.x, bot.y, target.x, target.y);

    if (distToTarget < bot.speed) {
      bot.currentPoint = (bot.currentPoint + 1) % bot.path.length;
    } else {
      let prevX = bot.x;
      let prevY = bot.y;

      bot.direction.x = (dx / distToTarget) * bot.speed;
      bot.direction.y = (dy / distToTarget) * bot.speed;

      bot.x += bot.direction.x;
      bot.y += bot.direction.y;

      let c = get(bot.x, bot.y);
      if (c[0] > 180 && c[1] < 100 && c[2] < 100) {
        bot.x = prevX;
        bot.y = prevY;
        bot.currentPoint = (bot.currentPoint + 1) % bot.path.length;
      }
    }

    image(bot.img, bot.x - bot.size / 2, bot.y - bot.size / 2, bot.size, bot.size);
  }
}

function checkOffTrackCollision() {
  let points = [
    { x: car.x, y: car.y },
    { x: car.x + cos(car.angle) * (car.width / 2), y: car.y + sin(car.angle) * (car.width / 2) },
    { x: car.x - cos(car.angle) * (car.width / 2), y: car.y - sin(car.angle) * (car.width / 2) },
    { x: car.x + cos(car.angle + PI / 2) * (car.height / 2), y: car.y + sin(car.angle + PI / 2) * (car.height / 2) },
    { x: car.x + cos(car.angle - PI / 2) * (car.height / 2), y: car.y + sin(car.angle - PI / 2) * (car.height / 2) }
  ];

  for (let point of points) {
    let px = floor(point.x);
    let py = floor(point.y);

    if (px < 0 || px >= width || py < 0 || py >= height) continue;

    let c = get(px, py);
    let brightness = (c[0] + c[1] + c[2]) / 3;

    if (brightness >200) {
      alert("Game Over: You hit the track boundary!");
      noLoop();
      return;
    }
  }
}

function checkBotCollisions() {
  for (let bot of bots) {
    let d = dist(car.x, car.y, bot.x, bot.y);
    if (d < 30) {
      alert("Game Over: Hit a bot!");
      noLoop();
    }
  }
}

function checkLapCompletion() {
  if (dist(car.x, car.y, lapStartZone.x, lapStartZone.y) < lapStartZone.r) {
    if (!car.justCrossed) {
      playerLaps++;
      car.justCrossed = true;
      if (playerLaps === 2) {
        leaderboard.push({ name: 'You', laps: 1 });
        endGame();
      }
    }
  } else {
    car.justCrossed = false;
  }

  for (let bot of bots) {
    if (dist(bot.x, bot.y, lapStartZone.x, lapStartZone.y) < lapStartZone.r) {
      if (!bot.justCrossed) {
        bot.laps++;
        bot.justCrossed = true;
        if (bot.laps === 2 && !bot.finished) {
          leaderboard.push({ name: bot.name, laps: bot.laps });
          bot.finished = true;
          endGame();
        }
      }
    } else {
      bot.justCrossed = false;
    }
  }
}
function restartGame() {
  location.reload(); 
}

function endGame() {
  if (gameEnded) return;
  gameEnded = true;
  gameState = 'leaderboard';
  noLoop();
  document.getElementById("restartBtn").style.display = "block"; 
}
