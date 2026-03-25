import { Entity } from './Entity'

class Root extends Entity {
  render(ctx: CanvasRenderingContext2D) {
    this.resetCanvas(ctx)
  }

  resetCanvas(ctx: CanvasRenderingContext2D) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#222'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}

export const rootEntity = new Root()
