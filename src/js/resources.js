import { ImageSource, Sprite, Loader, FontSource, Sound } from "excalibur";
import { SoundEffect } from "./soundeffect";

// Add your resources here
// TODO: Add categories
const Resources = {
  Fish: new ImageSource("images/fish.png"),
  Cars: new ImageSource("images/cars.png"),
  Explosion: new ImageSource("images/explosionanimation.png"),
  PixelFont: new FontSource("fonts/PressStart2P-Regular.ttf", "PressStart"),
  Explosion1: new SoundEffect("sounds/explosion-312361.mp3"),
  Crash1: new SoundEffect("sounds/clank-car-crash-collision-6206.mp3"),
  Jump: new SoundEffect("sounds/funny-spring-jump-140378.mp3"),
};

// Atlas data for the spritesheet
const CarAtlas = {
  dumptruck: { x: 1, y: 131, width: 54, height: 123 },
  tow_truck: { x: 1, y: 59, width: 33, height: 70 },
  tow_truck2: { x: 57, y: 184, width: 33, height: 70 },
  tow_truck3: { x: 92, y: 185, width: 33, height: 69 },
  truck2: { x: 127, y: 188, width: 33, height: 66 },
  truck3: { x: 162, y: 188, width: 33, height: 66 },
  landcruiser: { x: 1, y: 1, width: 29, height: 56 },
  landcruiser2: { x: 197, y: 198, width: 29, height: 56 },
  landcruiser3: { x: 228, y: 198, width: 29, height: 56 },
  van: { x: 259, y: 198, width: 29, height: 56 },
  raptor: { x: 290, y: 199, width: 28, height: 55 },
  raptor2: { x: 320, y: 199, width: 28, height: 55 },
  pickup: { x: 57, y: 131, width: 28, height: 51 },
  pickup2: { x: 36, y: 78, width: 28, height: 51 },
  pickup3: { x: 350, y: 203, width: 28, height: 51 },
  suv: { x: 380, y: 204, width: 28, height: 50 },
  suv2: { x: 410, y: 204, width: 28, height: 50 },
  van2: { x: 440, y: 204, width: 27, height: 50 },
  van3: { x: 469, y: 204, width: 27, height: 50 },
  mustang2: { x: 66, y: 80, width: 26, height: 49 },
  camaro: { x: 87, y: 134, width: 26, height: 48 },
  camaro2: { x: 94, y: 84, width: 26, height: 48 },
  challenger2: { x: 115, y: 135, width: 28, height: 48 },
  challenger3: { x: 145, y: 138, width: 28, height: 48 },
  lexus: { x: 122, y: 85, width: 26, height: 48 },
  lexus2: { x: 175, y: 138, width: 26, height: 48 },
  gwagon: { x: 150, y: 89, width: 27, height: 47 },
  bmw: { x: 179, y: 89, width: 25, height: 47 },
  gwagon2: { x: 203, y: 149, width: 27, height: 47 },
  patrol: { x: 232, y: 149, width: 27, height: 47 },
  patrol2: { x: 261, y: 149, width: 27, height: 47 },
  lexus3: { x: 290, y: 149, width: 26, height: 48 },
  taxi: { x: 318, y: 149, width: 26, height: 48 },
  taxi2: { x: 206, y: 99, width: 26, height: 48 },
  lambo: { x: 234, y: 101, width: 27, height: 46 },
  lambo2: { x: 263, y: 101, width: 27, height: 46 },
  lancer: { x: 292, y: 100, width: 26, height: 47 },
  bmw2: { x: 320, y: 100, width: 25, height: 47 },
  bmw3: { x: 32, y: 10, width: 25, height: 47 },
  lancer2: { x: 346, y: 150, width: 26, height: 47 },
  mustang3: { x: 347, y: 101, width: 26, height: 47 },
  wrangler: { x: 374, y: 155, width: 24, height: 46 },
  sunny: { x: 400, y: 157, width: 25, height: 45 },
  wrangler2: { x: 427, y: 156, width: 24, height: 46 },
  wrangler3: { x: 453, y: 156, width: 24, height: 46 },
  wrangler4: { x: 375, y: 107, width: 24, height: 46 },
  tida: { x: 401, y: 112, width: 24, height: 43 },
  mini: { x: 427, y: 112, width: 24, height: 42 },
  tida2: { x: 453, y: 111, width: 24, height: 43 },
  tida3: { x: 479, y: 159, width: 24, height: 43 },
  convertible: { x: 479, y: 116, width: 24, height: 41 },
  figo: { x: 206, y: 56, width: 24, height: 41 },
  figo2: { x: 232, y: 56, width: 24, height: 41 },
  porsche: { x: 258, y: 58, width: 24, height: 41 },
  bike2: { x: 284, y: 63, width: 16, height: 35 },
  bike: { x: 302, y: 65, width: 16, height: 33 },
};

// Create sprites from the atlas
const CarSprites = {};
for (const [name, data] of Object.entries(CarAtlas)) {
  CarSprites[name] = new Sprite({
    image: Resources.Cars,
    sourceView: { x: data.x, y: data.y, width: data.width, height: data.height },
  });
}

// PressStart2P-Regular.ttf

const ResourceLoader = new Loader();
for (let res of Object.values(Resources)) {
  ResourceLoader.addResource(res);
}

export { Resources, ResourceLoader, CarSprites };
