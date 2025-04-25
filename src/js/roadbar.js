import { Actor, Vector, Color } from "excalibur";

export class RoadBar extends Actor {
  constructor(position) {
    super({
      pos: position,
      width: 10, // Width of the bar
      height: 50, // Height of the bar
      color: Color.White, // White color for the bar
    });
    this.z = -1; // Set a lower z-index so the car is drawn over the bar
  }

  onInitialize(engine) {
    this.events.on("exitviewport", () => {
      this.pos.y -= engine.drawHeight + this.height; // Reset position when leaving the viewport
    });
  }
}
