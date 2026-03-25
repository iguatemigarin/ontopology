let previousTime = 0

const loop: FrameRequestCallback = (currentTime) => {
  const delta = Math.min(currentTime - previousTime, 10)

  previousTime = currentTime
  requestAnimationFrame(loop)
}

export function initLoop() {
  loop(previousTime)
}
