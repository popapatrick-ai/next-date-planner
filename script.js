const patrickOption = document.querySelector("#patrickOption");
const elseOption = document.querySelector("#elseOption");
const unavailableMessage = document.querySelector("#unavailableMessage");
const successCard = document.querySelector("#successCard");
const confirmationCard = document.querySelector("#confirmationCard");
const confirmButton = document.querySelector("#confirmButton");
const dateIdea = document.querySelector("#dateIdea");
const confettiCanvas = document.querySelector("#confettiCanvas");
const confettiContext = confettiCanvas.getContext("2d");

const countdownNodes = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

const dateIdeas = [
  "A slow coffee walk with nowhere urgent to be.",
  "Dinner somewhere cozy, followed by dessert diplomacy.",
  "A bookstore wander with one tiny impulsive purchase.",
  "A golden-hour drive and a playlist with suspiciously good timing.",
  "A movie night where sharing snacks is legally encouraged.",
  "A little adventure, a lot of laughing, and no boring minutes.",
];

let currentIdea = 0;
let confettiPieces = [];
let confettiAnimationFrame;

function nextSaturday() {
  const now = new Date();
  const target = new Date(now);
  const saturday = 6;
  let daysUntilSaturday = (saturday - now.getDay() + 7) % 7;

  target.setDate(now.getDate() + daysUntilSaturday);
  target.setHours(10, 0, 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 7);
  }

  return target;
}

function updateCountdown() {
  const now = new Date();
  const distance = Math.max(nextSaturday() - now, 0);
  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const minute = 60 * 1000;

  const days = Math.floor(distance / day);
  const hours = Math.floor((distance % day) / hour);
  const minutes = Math.floor((distance % hour) / minute);
  const seconds = Math.floor((distance % minute) / 1000);

  countdownNodes.days.textContent = days;
  countdownNodes.hours.textContent = hours;
  countdownNodes.minutes.textContent = minutes;
  countdownNodes.seconds.textContent = seconds;
}

function rotateDateIdeas() {
  dateIdea.classList.add("switching");

  window.setTimeout(() => {
    currentIdea = (currentIdea + 1) % dateIdeas.length;
    dateIdea.textContent = dateIdeas[currentIdea];
    dateIdea.classList.remove("switching");
  }, 220);
}

function playTone(frequency = 520, duration = 0.1) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return;
  }

  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function resizeConfettiCanvas() {
  const pixelRatio = window.devicePixelRatio || 1;
  confettiCanvas.width = window.innerWidth * pixelRatio;
  confettiCanvas.height = window.innerHeight * pixelRatio;
  confettiContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function makeConfettiPiece() {
  const colors = ["#f8b7c5", "#ffe0e8", "#d7ad62", "#fae8bc", "#9d4259"];

  return {
    x: window.innerWidth / 2 + (Math.random() - 0.5) * 120,
    y: window.innerHeight * 0.32,
    size: Math.random() * 7 + 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI,
    rotationSpeed: (Math.random() - 0.5) * 0.22,
    speedX: (Math.random() - 0.5) * 8,
    speedY: Math.random() * -7 - 4,
    gravity: 0.22 + Math.random() * 0.1,
    opacity: 1,
  };
}

function drawConfettiPiece(piece) {
  confettiContext.save();
  confettiContext.globalAlpha = piece.opacity;
  confettiContext.translate(piece.x, piece.y);
  confettiContext.rotate(piece.rotation);
  confettiContext.fillStyle = piece.color;
  confettiContext.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.62);
  confettiContext.restore();
}

function animateConfetti() {
  confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confettiPieces = confettiPieces
    .map((piece) => ({
      ...piece,
      x: piece.x + piece.speedX,
      y: piece.y + piece.speedY,
      speedY: piece.speedY + piece.gravity,
      rotation: piece.rotation + piece.rotationSpeed,
      opacity: piece.opacity - 0.008,
    }))
    .filter((piece) => piece.opacity > 0 && piece.y < window.innerHeight + 30);

  confettiPieces.forEach(drawConfettiPiece);

  if (confettiPieces.length > 0) {
    confettiAnimationFrame = window.requestAnimationFrame(animateConfetti);
  }
}

function fireConfetti() {
  window.cancelAnimationFrame(confettiAnimationFrame);
  resizeConfettiCanvas();
  confettiPieces = Array.from({ length: 150 }, makeConfettiPiece);
  animateConfetti();
}

function reveal(element) {
  element.classList.remove("hidden");
  element.classList.add("reveal");
}

elseOption.addEventListener("click", () => {
  unavailableMessage.textContent = "This option is currently unavailable.";
  elseOption.classList.remove("invalid");
  void elseOption.offsetWidth;
  elseOption.classList.add("invalid");
  playTone(230, 0.08);
});

patrickOption.addEventListener("click", () => {
  reveal(successCard);
  unavailableMessage.textContent = "";
  patrickOption.setAttribute("aria-pressed", "true");
  fireConfetti();
  playTone(660, 0.12);
  window.setTimeout(() => playTone(880, 0.12), 120);
  successCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

confirmButton.addEventListener("click", () => {
  reveal(confirmationCard);
  fireConfetti();
  playTone(784, 0.1);
  window.setTimeout(() => playTone(988, 0.14), 110);
  confirmationCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

window.addEventListener("resize", resizeConfettiCanvas);

updateCountdown();
resizeConfettiCanvas();
window.setInterval(updateCountdown, 1000);
window.setInterval(rotateDateIdeas, 3600);
