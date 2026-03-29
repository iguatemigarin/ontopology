import './engine/global.css'
import { initLoop } from './engine/loop'
import { rootEntity } from './engine/RootEntity'
import { FPSCounter } from './engine/FPSCounter'
import { Rocket } from './entities/Rocket'
import { Body } from './entities/Body'

const fpsCounter = new FPSCounter()
rootEntity.add(fpsCounter)

const rocket = new Rocket({ x: window.innerWidth / 2, y: window.innerHeight / 2 - 110 })
rootEntity.add(rocket)

const body = new Body(
  {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  },
  10,
)
rootEntity.add(body)
initLoop(rootEntity)
