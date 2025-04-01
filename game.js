 // 🎮 Pong Game - Core Logic

// Select the Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set Canvas Dimensions
canvas.width = 800;
canvas.height = 500;

// Game Variables
const paddleWidth = 10, paddleHeight = 100;
const ballSize = 10;
let ballSpeed = 5;

// Player Paddle Objects
const player1 = { x: 20, y: canvas.height / 2 - paddleHeight / 2, dy: 0, speed: 5, score: 0 };
const player2 = { x: canvas.width - 30, y: canvas.height / 2 - paddleHeight / 2, dy: 0, speed: 5, score: 0 };

// Ball Object
const ball = { x: canvas.width / 2, y: canvas.height / 2, dx: ballSpeed, dy: ballSpeed };

// 🎨 Draw Functions
function drawPaddle(player) {
    ctx.fillStyle = "#00ffcc"; // Neon Glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ffcc";
    ctx.fillRect(player.x, player.y, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.fillStyle = "#ff0066"; // Neon Pink Ball
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff0066";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballSize, 0, Math.PI * 2);
    ctx.fill();
}

function drawCenterLine() {
    ctx.setLineDash([10, 15]);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
}

function drawScore() {
    ctx.font = "30px Orbitron";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(player1.score, canvas.width / 4, 50);
    ctx.fillText(player2.score, (canvas.width / 4) * 3, 50);
}

// 🎮 Game Logic
function updateGame() {
    // Move paddles
    player1.y += player1.dy;
    player2.y += player2.dy;

    // Prevent paddles from leaving bounds
    player1.y = Math.max(0, Math.min(canvas.height - paddleHeight, player1.y));
    player2.y = Math.max(0, Math.min(canvas.height - paddleHeight, player2.y));

    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top & bottom walls
    if (ball.y - ballSize < 0 || ball.y + ballSize > canvas.height) {
        ball.dy *= -1; // Reverse direction
    }

    // Ball collision with paddles
    if (
        (ball.x - ballSize <= player1.x + paddleWidth && ball.y >= player1.y && ball.y <= player1.y + paddleHeight) ||
        (ball.x + ballSize >= player2.x && ball.y >= player2.y && ball.y <= player2.y + paddleHeight)
    ) {
        ball.dx *= -1.1; // Increase speed after hitting paddle
    }

    // Ball out of bounds (scoring)
    if (ball.x < 0) {
        player2.score++;
        resetBall();
    } else if (ball.x > canvas.width) {
        player1.score++;
        resetBall();
    }
}

// Reset Ball After Score
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
}

// 🎥 Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCenterLine();
    drawPaddle(player1);
    drawPaddle(player2);
    drawBall();
    drawScore();
    updateGame();
    requestAnimationFrame(gameLoop);
}

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.6;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Adjust size on page load

// 🕹️ Controls
window.addEventListener("keydown", (e) => {
    if (e.key === "w") player1.dy = -player1.speed;
    if (e.key === "s") player1.dy = player1.speed;
    if (e.key === "ArrowUp") player2.dy = -player2.speed;
    if (e.key === "ArrowDown") player2.dy = player2.speed;
});

window.addEventListener("keyup", (e) => {
    if (e.key === "w" || e.key === "s") player1.dy = 0;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") player2.dy = 0;
});

// Start Game
gameLoop();


