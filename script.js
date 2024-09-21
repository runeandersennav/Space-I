const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    color: 'lime',
    speed: 5,
    dx: 0
};

let bullets = [];
let enemies = [];
let enemySpeed = 1;
let score = 0;

const keys = {
    right: false,
    left: false,
    space: false
};

// Spillerbevegelse
function movePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Tegn spiller
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Skyt kuler
function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        color: 'red',
        speed: 7
    });
}

// Oppdater kuler
function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

// Tegn kuler
function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Lag fiender
function createEnemies() {
    for (let i = 0; i < 6; i++) {
        enemies.push({
            x: i * 80 + 60,
            y: 50,
            width: 40,
            height: 40,
            color: 'yellow',
            speed: enemySpeed
        });
    }
}

// Tegn fiender
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Oppdater fiender
function updateEnemies() {
    enemies.forEach(enemy => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
            enemy.y = 50;
            enemy.x = Math.random() * (canvas.width - enemy.width);
        }
    });
}

// Kollisjonssjekk
function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemies.splice(enemyIndex, 1);
                bullets.splice(bulletIndex, 1);
                score++;
                if (enemies.length === 0) {
                    createEnemies();
                    enemySpeed += 0.5;
                }
            }
        });
    });
}

// Bevegelseslogikk
function keyDown(e) {
    if (
