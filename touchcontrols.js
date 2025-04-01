// 🎮 Mobile Touch Controls for Pong
let touchStartY = 0;
let touchPlayer = null;

// Detect Touch Start
window.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    touchStartY = touch.clientY;

    // Determine which side the player is touching
    if (touch.clientX < window.innerWidth / 2) {
        touchPlayer = player1;
    } else {
        touchPlayer = player2;
    }
});

// Detect Touch Move
window.addEventListener("touchmove", (e) => {
    if (!touchPlayer) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartY;

    touchPlayer.y += deltaY * 0.5; // Adjust movement speed
    touchStartY = touch.clientY;

    // Prevent paddle from leaving bounds
    touchPlayer.y = Math.max(0, Math.min(canvas.height - paddleHeight, touchPlayer.y));
});

// Prevent Scrolling on Mobile
window.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
