const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.append(canvas);

/*
  GOALS:
    - [x] Vector 2D implementation
    - [] Add support for rendering solid polygons
    - [] Separating Axis Theorem Collision Detection implementation
    - [] Discrete physics steps
    - [] Axis-Aligned Bounding Box implementation
*/

// My PC: 165fps
// Your Mac: 60fps

const TARGET_PHYSICS_TICKS = 50;
const MS_PER_SECOND = 1000;
const PHYSICS_STEP = MS_PER_SECOND / TARGET_PHYSICS_TICKS; // ms / tick


// TODO: GET RID OF THIS CODE AND REPLACE IT WITH THINGS THAT HURT MY SOUL LESS

const PX_PER_METER = 100;

const canvasWidthMidpoint = canvas.width / 2;
const canvasHeightMidpoint = canvas.height / 2;

let camera = {
  position: { x: 0, y: 0, z: 2 }
};


let player = {
  position: { x: 0, y: 1 },
  velocity: { x: 0, y: 0 },
  sprite: { width: 0.8, height: 2, color: "purple" },
};

let world = {
  blocks: [
    {
      position: { x: 0, y: -0.5 },
      rect: { width: 10, height: 1, color: "green" }
    }
  ]
};

const GRAVITY_ACCELERATION_PER_SECOND = 9.8;
const GRAVITY_ACCELERATION_PER_TICK = GRAVITY_ACCELERATION_PER_SECOND / TARGET_PHYSICS_TICKS;

let keys = {};
window.onkeydown = (e) => {
  keys[e.code] = true;
};
window.onkeyup = (e) => {
  keys[e.code] = false;
};

const update = () => {
  const accX = 0;
  const accY = GRAVITY_ACCELERATION_PER_TICK;

  // Our speed can be defined in meters per second
  // That way we can zoom in and out,
  // and our speed remains relative to perspective, like our size
  const maxSpeed = 20;
  const speedPerUpdate = maxSpeed / TARGET_PHYSICS_TICKS;
  if (keys.KeyD) {
    player.position.x += speedPerUpdate
  }
  if (keys.KeyA) {
    player.position.x -= speedPerUpdate;
  }
  // const velocityX = player.velocity.x + accX;
  // const velocityY = player.velocity.y + accY;
  // player.position.x += velocityX;
  // player.position.y += velocityY;

  // player.velocity.x = velocityX;
  // player.velocity.y = velocityY;
};

const renderRect = (context, camera, position, rect) => {
  context.save();
  context.fillStyle = rect.color;

  // Number of pixels per meter, as seen by a camera 1m away
  const pxRatio = PX_PER_METER;

  const imageWidth = context.canvas.width;
  const imageHeight = context.canvas.height;
  const imageCenterX = imageWidth / 2;
  const imageCenterY = imageHeight / 2;

  // offset of object in relation to the center of the camera
  const offsetXInMeters = position.x - camera.position.x;
  const offsetYInMeters = position.y - camera.position.y;

  // offset of object relative to distance from camera ("Perspective Divide")
  const perspectiveOffsetX = offsetXInMeters / camera.position.z;
  const perspectiveOffsetY = offsetYInMeters / camera.position.z;

  // size of object, relative to distance from camera ("Perspective Divide")
  const perspectiveWidth = rect.width / camera.position.z;
  const perspectiveHeight = rect.height / camera.position.z;

  const perspectiveHalfWidth = perspectiveWidth / 2;
  const perspectiveHalfHeight = perspectiveHeight / 2;

  /*
    Render:
      - Convert from Meters to Pixels
      - Convert from camera to canvas (-1 to 1) -> (0 to 1)
      - flip y coordinate
  */

  // left edge of rect in pixel coordinates for canvas 
  const leftEdgePx =
    (perspectiveOffsetX - perspectiveHalfWidth) * pxRatio
    + imageCenterX;

  const topEdgePx = imageHeight - ((perspectiveOffsetY + perspectiveHalfHeight) * pxRatio) - imageCenterY;

  const widthPx = perspectiveWidth * pxRatio;
  const heightPx = perspectiveHeight * pxRatio;

  context.fillRect(leftEdgePx, topEdgePx, widthPx, heightPx);

  context.restore();
};

const renderSprite = () => {};

const render = () => {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  renderRect(context, camera, player.position, player.sprite);
  world.blocks.forEach(block => {
    renderRect(context, camera, block.position, block.rect);
  });
  // context.fillStyle = "pink";
  // const x = (player.position.x - player.sprite.width / 2) * (PX_PER_METER / camera.position.z);
  // const y = (player.position.y - player.sprite.height / 2) * (PX_PER_METER / camera.position.z);
  // const width = player.sprite.width * (PX_PER_METER / camera.position.z);
  // const height = player.sprite.height * (PX_PER_METER / camera.position.z);

  // context.fillRect(x, y, width, height);
};

let previousTime = performance.now();
const tick = (currentTime) => {
  requestAnimationFrame(tick);

  let delta = currentTime - previousTime;

  let steps = Math.trunc(delta / PHYSICS_STEP);
  let remainder = delta % PHYSICS_STEP;
  previousTime = currentTime - remainder;

  for (let i = 0; i < steps; i += 1) {
    update();
  }

  render();
};

tick(previousTime);
