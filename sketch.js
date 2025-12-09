let flowers = [];
let flowerImg;
let bgImg;

// Cooldown để hoa siêu thưa
let lastSpawnTime = 0;
let spawnInterval = 120; // 120ms = hoa rất thưa (bạn có thể tăng lên 700 hoặc 1000)

function preload() {
  flowerImg = loadImage('jump.png');
  bgImg = loadImage('bg.png'); 
}

function setup() {
  createCanvas(1684, 2384);  
  noStroke();
  imageMode(CORNER);
}

function draw() {
  // Background
  image(bgImg, 0, 0);

  // Spawn khi chuột di chuyển hoặc giữ chuột
  if (mouseIsPressed || mouseX !== pmouseX || mouseY !== pmouseY) {
    spawnFlowersAlongPath();
  }

  // Update + draw flowers
  for (let i = flowers.length - 1; i >= 0; i--) {
    let f = flowers[i];

    // ---------------------------------------
    // 1. HOA RƠI
    // ---------------------------------------
    if (f.state === "falling") {
      f.vy += f.gravity;
      f.y += f.vy;
      f.rot += f.rotSpeed;

      // Chạm đáy → nằm lại
      if (f.y + f.size / 2 >= height) {
        f.y = height - f.size / 2;
        f.state = "resting";
        f.restTime = 0;
      }
    }

    // ---------------------------------------
    // 2. HOA NẰM LẠI 2 GIÂY
    // ---------------------------------------
    else if (f.state === "resting") {
      f.restTime++;

      if (f.restTime > 120) {  // 120 frames ≈ 2s
        f.alpha -= 3; // fade
      }
    }

    // ---------------------------------------
    // 3. XÓA KHI FADE HẾT
    // ---------------------------------------
    if (f.alpha <= 0) {
      flowers.splice(i, 1);
      continue;
    }

    // ---------------------------------------
    // 4. VẼ HOA
    // ---------------------------------------
    drawFlower(f);
  }
}


// --------------------------------------------------
// 🌸 HÀM SINH HOA – SIÊU THƯA, CHỈ 1 HOA MỖI LẦN
// --------------------------------------------------
function spawnFlowersAlongPath() {
  let now = millis();

  // cooldown: chỉ sinh 1 hoa mỗi 500ms (0.1 giây)
  if (now - lastSpawnTime < spawnInterval) return;
  lastSpawnTime = now;

  // Sinh đúng 1 hoa
  flowers.push({
    x: mouseX,
    y: mouseY,

    size: random(240, 540), // hoa to x3

vy: 0.3,
gravity: random(0.15, 0.25),

rot: random(TWO_PI),
rotSpeed: random(-0.02, 0.02),

state: "falling",
restTime: 0,
alpha: 255
  });
}


// --------------------------------------------------
// 🌸 VẼ HOA
// --------------------------------------------------
function drawFlower(f) {
  push();
  translate(f.x, f.y);
  rotate(f.rot);
  tint(255, f.alpha);
  image(flowerImg, 0, 0, f.size, f.size);
  noTint();
  pop();
}
