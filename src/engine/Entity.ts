export class Entity {
  private children: Entity[] = []
  parent?: Entity

  update(delta: number) {}

  updateChildren(delta: number) {
    this.children.forEach((e) => {
      e.update(delta)
      e.updateChildren(delta)
    })
  }

  render(ctx: CanvasRenderingContext2D) {}

  renderChildren(ctx: CanvasRenderingContext2D) {
    this.children.forEach((e) => {
      e.render(ctx)
      e.renderChildren(ctx)
    })
  }

  add(e: Entity) {
    e.parent = this
    this.children.push(e)
  }

  remove(e: Entity) {
    const index = this.children.indexOf(e)
    if (index !== -1) this.children.splice(index, 1)
  }

  destroy() {
    if (this.parent) {
      this.parent.remove(this)
    }
  }
}
