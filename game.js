let canvas = document.getElementById("gameCanvas");
    let ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.imageSmoothingEnabled = false;

    let TILE_SIZE = 64;
    let MAP_WIDTH = 50; // 50 tiles wide
    let MAP_HEIGHT = 50; // 50 tiles tall

    let SPRITE_SHEET = new Image();
    SPRITE_SHEET.src = "sprite_blu_hat.png";

    let TILE_MAP = new Image();
    TILE_MAP.src = "10giwbdj25ra1.png";

    let FRAME_SIZE = 64;
    let FRAME_COLUMNS = 4;
    let FRAME_ROWS = 4;
    let currentFrame = 0;
    let frameCount = 0;
    let frameSpeed = 8;

    let player = {
      x: 500,
      y: 500,
      size: TILE_SIZE,
      speed: 3,
      direction: 0,
    };

    let obstacles = [
    {"x": 865, "y": 300, "width": 500, "height": 400 },
    {"x": 225, "y": 1000, "width": 450, "height": 350 },
    {"x": 1500, "y": 1050, "width": 350, "height": 350 },
    {"x": 2200, "y": 2000, "width": 300, "height": 280 },
    {"x": 2350, "y": 800, "width": 350, "height": 400},
    {"x": 2850, "y": 100, "width": 400, "height": 300},

    {"x": 1925, "y": 0, "width": 350, "height": 550},
    {"x": 1925, "y": 700, "width": 350, "height": 550},
    {"x": 2000, "y": 1250, "width": 350, "height": 300}, 
    {"x": 1850, "y": 1550, "width": 625, "height": 550}, 
    {"x": 1850, "y": 2100, "width": 275, "height": 250}, 
    {"x": 1850, "y": 2500, "width": 275, "height": 225}, 
    {"x": 1650, "y": 2725, "width": 600, "height": 175}, 
    {"x": 1650, "y": 3050, "width": 600, "height": 175}, 

    {"x": 0, "y": 2225, "width": 300, "height": 550}, 
    {"x": 550, "y": 2760, "width": 1100, "height": 10}, 
    {"x": 550, "y": 2410, "width": 10, "height": 350}, 
    {"x": 550, "y": 2410, "width": 175, "height": 125}, 
    {"x": 925, "y": 2410, "width": 175, "height": 125}, 
    {"x": 1100, "y": 2210, "width": 25, "height": 200}, 
    {"x": 1100, "y": 2210, "width": 200, "height": 25}, 
    {"x": 1200, "y": 1900, "width": 370, "height": 300}, 
    {"x": 1300, "y": 2200, "width": 150, "height": 100, type:"tree_stump"}, 
    {"x": 1150, "y": 1750, "width": 400, "height": 100, type:"trees_middle_4"}, 
    {"x": 1050, "y": 1550, "width": 400, "height": 200, type:"trees_middle_3"}, 
    {"x": 1000, "y": 1450, "width": 400, "height": 200, type:"trees_middle_2"}, 
    {"x": 925, "y": 1300, "width": 400, "height": 200, type:"trees_middle_1"}, 
    {"x": 1000, "y": 1200, "width": 400, "height": 250, type:"trees_middle_-1"}, 
    {"x": 1050, "y": 1100, "width": 400, "height": 250, type:"trees_middle_-2"}, 
    {"x": 1100, "y": 1000, "width": 400, "height": 250, type:"trees_middle_-3"}, 
    {"x": 1150, "y": 880, "width": 1000, "height": 270, type:"trees_middle_-4"}, 
    {"x": 1500, "y": 730, "width": 1000, "height": 270, type:"trees_middle_-5"}, 
    {"x": 1500, "y": 730, "width": 1000, "height": 270, type:"trees_middle_-5"}, 

    {"x": 0, "y": 1800, "width": 200, "height": 390, type:"trees_left_-5"}, 
    {"x": 0, "y": 0, "width": 1, "height": 9000, type:"border_left"}, 
    {"x": 0, "y": 450, "width": 150, "height": 1000, type:"trees_middle_-5"}, 

    {"x": 0, "y": 0, "width": 10000, "height": 200, type:"border_top"}, 
    {"x": 0, "y": 0, "width": 900, "height": 400, type:"border_top"}, 
    {"x": 225, "y": 400, "width": 180, "height": 180, type:"border_top"}, 
    {"x": 575, "y": 400, "width": 180, "height": 180, type:"border_top"}, 

    {"x": 3230, "y": 0, "width": 10, "height": 10000, type:"border_right"}, 
    {"x": 2900, "y": 900, "width": 1000, "height": 200, type:"border_right"}, 
    {"x": 2830, "y": 1100, "width": 1000, "height": 730, type:"border_right"}, 
    {"x": 2900, "y": 1830, "width": 1000, "height": 150, type:"border_right"}, 
    {"x": 2970, "y": 1980, "width": 1000, "height": 120, type:"border_right"}, 
    {"x": 3040, "y": 2100, "width": 1000, "height": 150, type:"border_right"}, 

    {"x": 0, "y": 3210, "width": 10000, "height": 1, type:"border_right"}, 
    {"x": 2850, "y": 2850, "width": 10000, "height": 200, type:"border_right"}, 
    {"x": 2560, "y": 3050, "width": 10000, "height": 200, type:"border_right"}, 

    ];

    let keys = {};
    window.addEventListener("keydown", (e) => (keys[e.key] = true));
    window.addEventListener("keyup", (e) => (keys[e.key] = false));

    // Basic rectangle collision detection
    function isColliding(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
    }

    // Check collision with obstacles for a proposed new position
    function canMove(newX, newY) {
      let playerBox = {
        x: newX,
        y: newY,
        width: player.size,
        height: player.size,
      };
      for (let obs of obstacles) {
        if (isColliding(playerBox, obs)) {
          return false;
        }
      }
      return true;
    }

    function update() {
      let moving = false;
      let newX = player.x;
      let newY = player.y;

      if (keys["w"]) {
        newY = player.y - player.speed;
        player.direction = 3;
        moving = true;
      }
      if (keys["s"]) {
        newY = player.y + player.speed;
        player.direction = 0;
        moving = true;
      }
      if (keys["a"]) {
        newX = player.x - player.speed;
        player.direction = 1;
        moving = true;
      }
      if (keys["d"]) {
        newX = player.x + player.speed;
        player.direction = 2;
        moving = true;
      }

      // Only update position if no collision would occur
      if (canMove(newX, newY)) {
        player.x = newX;
        player.y = newY;
      }

      if (moving) {
        frameCount++;
        if (frameCount >= frameSpeed) {
          currentFrame = (currentFrame + 1) % FRAME_COLUMNS;
          frameCount = 0;
        }
      } else {
        currentFrame = 0;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Clamp the camera position so it doesn't reveal white space at the edges
      let maxCamX = Math.max(0, MAP_WIDTH * TILE_SIZE - canvas.width);
      let maxCamY = Math.max(0, MAP_HEIGHT * TILE_SIZE - canvas.height);
      let camX = Math.max(0, Math.min(player.x - canvas.width / 2, maxCamX));
      let camY = Math.max(0, Math.min(player.y - canvas.height / 2, maxCamY));

      // Draw the map
      ctx.drawImage(TILE_MAP, -camX, -camY, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);

      // Calculate sprite frame source coordinates
      let sx = currentFrame * FRAME_SIZE;
      let sy = player.direction * FRAME_SIZE;

      // Draw the player sprite
      ctx.drawImage(
        SPRITE_SHEET,
        sx,
        sy,
        FRAME_SIZE,
        FRAME_SIZE,
        player.x - camX,
        player.y - camY,
        TILE_SIZE,
        TILE_SIZE
      );
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    gameLoop();          currentFrame = (currentFrame + 1) % FRAME_COLUMNS;
          frameCount = 0;
        }
      } else {
        currentFrame = 0;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Clamp the camera position so it doesn't reveal white space at the edges
      let maxCamX = Math.max(0, MAP_WIDTH * TILE_SIZE - canvas.width);
      let maxCamY = Math.max(0, MAP_HEIGHT * TILE_SIZE - canvas.height);
      let camX = Math.max(0, Math.min(player.x - canvas.width / 2, maxCamX));
      let camY = Math.max(0, Math.min(player.y - canvas.height / 2, maxCamY));

      // Draw the map
      ctx.drawImage(TILE_MAP, -camX, -camY, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);

      // Calculate sprite frame source coordinates
      let sx = currentFrame * FRAME_SIZE;
      let sy = player.direction * FRAME_SIZE;

      // Draw the player sprite
      ctx.drawImage(
        SPRITE_SHEET,
        sx,
        sy,
        FRAME_SIZE,
        FRAME_SIZE,
        player.x - camX,
        player.y - camY,
        TILE_SIZE,
        TILE_SIZE
      );
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    gameLoop();