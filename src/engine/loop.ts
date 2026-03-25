import type { Entity } from './Entity'

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

export function initLoop(rootEntity: Entity) {
  let previousTime = 0

  loop(previousTime)

  function loop(currentTime: number) {
    const delta = Math.min(currentTime - previousTime, 10)

    rootEntity.update(delta)
    rootEntity.updateChildren(delta)

    rootEntity.render(ctx)
    rootEntity.renderChildren(ctx)

    previousTime = currentTime
    requestAnimationFrame(loop)
  }
}
