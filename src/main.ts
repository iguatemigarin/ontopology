import './engine/global.css'
import { initLoop } from './engine/loop'
import { rootEntity } from './engine/RootEntity'
import { FPSCounter } from './engine/FPSCounter'
import { Rocket } from './entities/Rocket'

const fpsCounter = new FPSCounter()
rootEntity.add(fpsCounter)

const rocket = new Rocket({ x: 100, y: 100 })
rootEntity.add(rocket)
initLoop(rootEntity)
