const down = new Set()

window.addEventListener('keydown', ({ key }) => {
  if (!down.has(key)) {
    down.add(key)
  }
})

window.addEventListener('keyup', ({ key }) => {
  if (down.has(key)) {
    down.delete(key)
  }
})

export const isDown = (key: string) => down.has(key)
