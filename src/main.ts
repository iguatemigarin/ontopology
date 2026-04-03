import './engine/global.css'
import { initLoop } from './engine/loop'
import { rootEntity } from './engine/RootEntity'
import { FPSCounter } from './engine/FPSCounter'
import { Rocket } from './entities/Rocket'
import { Body } from './entities/Body'

const fpsCounter = new FPSCounter()
rootEntity.add(fpsCounter)

const rocket = new Rocket({ x: 100, y: window.innerHeight / 2 - 200 })

const body1 = new Body(
  {
    x: 100,
    y: window.innerHeight / 2,
  },
  1,
  20,
)

const body2 = new Body(
  {
    x: window.innerWidth - 100,
    y: window.innerHeight / 2,
  },
  10,
  50,
)
rootEntity.add(body1)
rootEntity.add(body2)
rootEntity.add(rocket)

rocket.bodies.push(body1)
rocket.bodies.push(body2)
initLoop(rootEntity)
