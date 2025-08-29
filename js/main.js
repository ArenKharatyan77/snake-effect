const snake = [];
const maxSegments = 15;
let mouseX = 0;
let mouseY = 0;
let lastTime = 0;
let isTouch = false;

// Цвета для сегментов змейки
const colors = [
  "radial-gradient(circle, #ff6b6b, #ee5a52)",
  "radial-gradient(circle, #4ecdc4, #45b7af)",
  "radial-gradient(circle, #45b7d1, #3498db)",
  "radial-gradient(circle, #96ceb4, #85c1a1)",
  "radial-gradient(circle, #feca57, #ff9ff3)",
  "radial-gradient(circle, #ff9ff3, #f368e0)",
  "radial-gradient(circle, #54a0ff, #5f27cd)",
];

// Создание сегмента змейки
function createSegment(x, y, isHead = false) {
  const segment = document.createElement("div");
  segment.className = isHead ? "snake-segment head" : "snake-segment";
  segment.style.left = x - 10 + "px";
  segment.style.top = y - 10 + "px";

  if (!isHead) {
    const colorIndex = snake.length % colors.length;
    segment.style.background = colors[colorIndex];
    segment.style.boxShadow = `0 0 20px ${getColorFromGradient(
      colors[colorIndex]
    )}`;
  }

  document.body.appendChild(segment);
  return segment;
}

function getColorFromGradient(gradient) {
  const colorMap = {
    "#ff6b6b": "rgba(255, 107, 107, 0.5)",
    "#4ecdc4": "rgba(78, 205, 196, 0.5)",
    "#45b7d1": "rgba(69, 183, 209, 0.5)",
    "#96ceb4": "rgba(150, 206, 180, 0.5)",
    "#feca57": "rgba(254, 202, 87, 0.5)",
    "#ff9ff3": "rgba(255, 159, 243, 0.5)",
    "#54a0ff": "rgba(84, 160, 255, 0.5)",
  };

  for (let color in colorMap) {
    if (gradient.includes(color)) {
      return colorMap[color];
    }
  }
  return "rgba(255, 255, 255, 0.5)";
}

function createParticle(x, y) {
  const particle = document.createElement("div");
  particle.className = "particle";
  particle.style.left = x + Math.random() * 20 - 10 + "px";
  particle.style.top = y + Math.random() * 20 - 10 + "px";
  particle.style.background =
    colors[Math.floor(Math.random() * colors.length)]
      .split(",")[1]
      .split(")")[0] + ")";

  document.body.appendChild(particle);

  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
    }
  }, 1000);
}

function createTouchIndicator(x, y) {
  const indicator = document.createElement("div");
  indicator.className = "touch-indicator";
  indicator.style.left = x - 15 + "px";
  indicator.style.top = y - 15 + "px";
  document.body.appendChild(indicator);

  setTimeout(() => {
    if (indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  }, 300);
}

function updateGlowEffect() {
  const glowEffect = document.getElementById("glowEffect");
  glowEffect.style.left = mouseX - 50 + "px";
  glowEffect.style.top = mouseY - 50 + "px";
}

function handleMovement(x, y) {
  mouseX = x;
  mouseY = y;
  updateGlowEffect();

  const currentTime = Date.now();
  if (currentTime - lastTime > 50) {
    const newSegment = createSegment(mouseX, mouseY, snake.length === 0);
    snake.unshift({
      element: newSegment,
      x: mouseX,
      y: mouseY,
      createdAt: currentTime,
    });

    if (Math.random() < 0.3) {
      createParticle(mouseX, mouseY);
    }

    if (snake.length > maxSegments) {
      const oldSegment = snake.pop();
      if (oldSegment.element.parentNode) {
        oldSegment.element.parentNode.removeChild(oldSegment.element);
      }
    }

    snake.forEach((segment, index) => {
      if (index === 0) {
        segment.element.className = "snake-segment head";
      } else {
        segment.element.className = "snake-segment";
        const colorIndex = index % colors.length;
        segment.element.style.background = colors[colorIndex];
        segment.element.style.transform = `scale(${1 - index * 0.05})`;
        segment.element.style.opacity = 1 - index * 0.05;
      }
    });

    lastTime = currentTime;
  }
}

document.addEventListener("mousemove", (e) => {
  if (!isTouch) {
    handleMovement(e.clientX, e.clientY);
  }
});

document.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    isTouch = true;
    const touch = e.touches[0];
    createTouchIndicator(touch.clientX, touch.clientY);
    handleMovement(touch.clientX, touch.clientY);
  },
  { passive: false }
);

document.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    isTouch = true;
    const touch = e.touches[0];
    handleMovement(touch.clientX, touch.clientY);
  },
  { passive: false }
);

document.addEventListener(
  "touchend",
  (e) => {
    e.preventDefault();
    setTimeout(() => {
      isTouch = false;
    }, 100);
  },
  { passive: false }
);

document.addEventListener(
  "touchstart",
  function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);

let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  function (event) {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  },
  false
);

window.addEventListener("load", () => {
  const glowEffect = document.getElementById("glowEffect");
  glowEffect.style.left = window.innerWidth / 2 - 50 + "px";
  glowEffect.style.top = window.innerHeight / 2 - 50 + "px";
});

setInterval(() => {
  if (snake.length > 0) {
    const lastSegment = snake[snake.length - 1];
    const timeSinceCreation =
      Date.now() - (lastSegment.createdAt || Date.now());

    if (timeSinceCreation > 2000) {
      snake.forEach((segment, index) => {
        setTimeout(() => {
          if (segment.element.parentNode) {
            segment.element.style.transition = "all 0.5s ease-out";
            segment.element.style.transform = "scale(0) rotate(180deg)";
            segment.element.style.opacity = "0";
            setTimeout(() => {
              if (segment.element.parentNode) {
                segment.element.parentNode.removeChild(segment.element);
              }
            }, 500);
          }
        }, index * 100);
      });
      snake.length = 0;
    }
  }
}, 3000);

window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    const glowEffect = document.getElementById("glowEffect");
    glowEffect.style.left = window.innerWidth / 2 - 50 + "px";
    glowEffect.style.top = window.innerHeight / 2 - 50 + "px";
  }, 100);
});
