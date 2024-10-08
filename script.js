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
    if (keys.right) {
        player.dx = player.speed;
    } else if (keys.left) {
        player.dx = -player.speed;
    } else {
        player.dx = 0;
    }

    player.x += player.dx;
    
    // Sørg for at spilleren ikke går utenfor skjermen
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

// Bevegelseslogikk for tastatur
function keyDown(e) {
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === ' ') {
        if (!keys.space) {
            shootBullet();
        }
        keys.space = true;
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === ' ') keys.space = false;
}

// Touch-funksjoner
function handleTouchStart(e) {
    const touchX = e.touches[0].clientX;
    
    // Hvis berøring er på venstre side av skjermen, flytt spilleren til venstre
    if (touchX < canvas.width / 2) {
        player.dx = -player.speed;
    } 
    // Hvis berøring er på høyre side, flytt spilleren til høyre
    else {
        player.dx = player.speed;
    }
}

function handleTouchMove(e) {
    e.preventDefault(); // Forhindrer at berøringen skaper uønskede bevegelser på skjermen
    const touchX = e.touches[0].clientX;
    
    // Flytter spilleren basert på hvor fingeren er på skjermen
    player.x = touchX - player.width / 2;
}

function handleTouchEnd() {
    // Stopp spillerens bevegelse når berøringen avsluttes
    player.dx = 0;
}

// Skyte når spilleren trykker på midten av skjermen
function handleTapShoot(e) {
    const touchY = e.touches[0].clientY;

    // Hvis berøringen er nær bunnen av skjermen, skyte prosjektil
    if (touchY > canvas.height / 2) {
        shootBullet();
    }
}

// Oppdatering av spilltilstand
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    movePlayer();
    updateBullets();
    updateEnemies();
    checkCollisions();

    drawPlayer();
    drawBullets();
    drawEnemies();

    requestAnimationFrame(update);
}

// Start spill
createEnemies();
update();

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Lytt til touch-hendelser
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', handleTouchEnd);

// Skyt ved touch
canvas.addEventListener('touchstart', handleTapShoot);
