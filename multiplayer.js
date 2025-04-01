 // 🎮 Pong Multiplayer (WebRTC)
let peerConnection;
let dataChannel;
const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// Select Controls
const hostButton = document.getElementById("hostGame");
const joinButton = document.getElementById("joinGame");
const gameCodeInput = document.getElementById("gameCode");

// Generate Room Code
function generateCode() {
    return Math.random().toString(36).substring(2, 10); // Random 8-character code
}

// Start Hosting a Game
async function hostGame() {
    peerConnection = new RTCPeerConnection(config);
    dataChannel = peerConnection.createDataChannel("gameData");

    dataChannel.onopen = () => console.log("DataChannel Open");
    dataChannel.onmessage = (event) => handleIncomingData(JSON.parse(event.data));

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log("ICE Candidate:", event.candidate);
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    const gameCode = generateCode();
    alert(`Share this code with your friend: ${gameCode}`);
}

// Join an Existing Game
async function joinGame() {
    const gameCode = gameCodeInput.value.trim();
    if (!gameCode) return alert("Enter a valid game code!");

    peerConnection = new RTCPeerConnection(config);
    peerConnection.ondatachannel = (event) => {
        dataChannel = event.channel;
        dataChannel.onmessage = (event) => handleIncomingData(JSON.parse(event.data));
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log("ICE Candidate:", event.candidate);
        }
    };
}

// Handle Incoming Game Data
function handleIncomingData(data) {
    if (data.type === "paddle") {
        if (data.player === 1) player1.y = data.y;
        if (data.player === 2) player2.y = data.y;
    } else if (data.type === "ball") {
        ball.x = data.x;
        ball.y = data.y;
    }
}

// Send Game Data
function sendGameData(type, data) {
    if (dataChannel && dataChannel.readyState === "open") {
        dataChannel.send(JSON.stringify({ type, ...data }));
    }
}

// Sync Paddle Movement
window.addEventListener("keydown", () => {
    sendGameData("paddle", { player: 1, y: player1.y });
    sendGameData("paddle", { player: 2, y: player2.y });
});

// Sync Ball Movement
function updateGame() {
    sendGameData("ball", { x: ball.x, y: ball.y });
}
setInterval(updateGame, 50); // Sync every 50ms

// Attach Events
hostButton.addEventListener("click", hostGame);
joinButton.addEventListener("click", joinGame);