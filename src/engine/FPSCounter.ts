import { Entity } from './Entity'

export class FPSCounter extends Entity {
  private count = 0
  private fps = 0
  private elapsed = 0

  update(delta: number) {
    this.count++
    this.elapsed += delta

    if (this.elapsed >= 1000) {
      this.fps = this.count
      this.count = 0
      this.elapsed = 0
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.font = '16px monospace'
    ctx.fillStyle = 'white'
    ctx.fillText(`${this.fps} fps`, 10, 26)
  }
}
