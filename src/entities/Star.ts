import { pixel } from '../constants'
import { Entity } from '../engine/Entity'

export class Star extends Entity {
  radius = 10
  private x: number
  private y: number
  private bitmap: OffscreenCanvas

  constructor(x: number, y: number) {
    super()
    this.x = x
    this.y = y

    const size = (this.radius * 2 + 1) * pixel
    this.bitmap = new OffscreenCanvas(size, size)
    const bctx = this.bitmap.getContext('2d')!

    bctx.fillStyle = 'white'
    for (let row = -this.radius; row <= this.radius; row++) {
      for (let col = -this.radius; col <= this.radius; col++) {
        if (col * col + row * row <= this.radius * this.radius) {
          bctx.fillRect((col + this.radius) * pixel, (row + this.radius) * pixel, pixel, pixel)
        }
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.bitmap, this.x - this.radius * pixel, this.y - this.radius * pixel)
  }
}
