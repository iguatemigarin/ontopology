import './engine/global.css'
import { initLoop } from './engine/loop'
import { rootEntity } from './engine/RootEntity'
import { FPSCounter } from './engine/FPSCounter'
import { Rocket } from './entities/Rocket'

const fpsCounter = new FPSCounter()
rootEntity.add(fpsCounter)

const rocket = new Rocket({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
rootEntity.add(rocket)

initLoop(rootEntity)
