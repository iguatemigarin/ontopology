import { Entity } from './Entity'

export class FPSCounter extends Entity {
  private count = 0
  private fps = 0
  private lastSecond = Date.now()

  update() {
    this.count++

    if (Date.now() - this.lastSecond > 1000) {
      this.fps = this.count
      this.count = 0
      this.lastSecond = Date.now()
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'white'
    ctx.fillText(this.fps.toString(), 10, 10)
  }
}
