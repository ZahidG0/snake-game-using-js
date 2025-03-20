// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreElement = document.getElementById("score");

  const gridSize = 20;
  const tileCount = canvas.width / gridSize;

  let snake = [{ x: 10, y: 10 }];
  let food = { x: 15, y: 15 };
  let dx = 0;
  let dy = 0;
  let score = 0;
  let gameInterval;
  let gameSpeed = 200;
  let gameStarted = false;

  function drawGame() {
    // Clear canvas
    ctx.fillStyle = "#34495e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = "#2ecc71";
    snake.forEach((segment) => {
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize - 2,
        gridSize - 2
      );
    });

    // Draw food
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(
      food.x * gridSize,
      food.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  }

  function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Check for wall collision
    if (
      head.x < 0 ||
      head.x >= tileCount ||
      head.y < 0 ||
      head.y >= tileCount
    ) {
      gameOver();
      return;
    }

    // Check for self collision
    for (let i = 0; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        gameOver();
        return;
      }
    }

    snake.unshift(head);

    // Check for food collision
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      scoreElement.textContent = score;
      generateFood();
      // Increase speed
      if (gameSpeed > 50) {
        gameSpeed -= 2;
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
      }
    } else {
      snake.pop();
    }
  }

  function generateFood() {
    let newFood;
    let validPosition;

    do {
      validPosition = true;
      newFood = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
      };

      // Check if food spawns on snake
      for (let segment of snake) {
        if (newFood.x === segment.x && newFood.y === segment.y) {
          validPosition = false;
          break;
        }
      }
    } while (!validPosition);

    food = newFood;
  }

  function gameLoop() {
    moveSnake();
    drawGame();
  }

  function gameOver() {
    clearInterval(gameInterval);
    alert(`Game Over! Your score: ${score}`);
    gameStarted = false;
  }

  // Make startGame function global
  window.startGame = function () {
    if (gameStarted) return;

    // Reset game state
    snake = [{ x: 10, y: 10 }];
    // Set initial direction (moving right)
    dx = 1;
    dy = 0;
    score = 0;
    gameSpeed = 200;
    scoreElement.textContent = score;
    generateFood();

    // Start game loop
    gameStarted = true;
    gameInterval = setInterval(gameLoop, gameSpeed);

    // Focus on the window to ensure keyboard controls work
    window.focus();
  };

  // Handle keyboard controls
  document.addEventListener("keydown", (event) => {
    if (!gameStarted) return;

    switch (event.key) {
      case "ArrowUp":
        if (dy !== 1) {
          dx = 0;
          dy = -1;
        }
        break;
      case "ArrowDown":
        if (dy !== -1) {
          dx = 0;
          dy = 1;
        }
        break;
      case "ArrowLeft":
        if (dx !== 1) {
          dx = -1;
          dy = 0;
        }
        break;
      case "ArrowRight":
        if (dx !== -1) {
          dx = 1;
          dy = 0;
        }
        break;
    }
  });
});
