import './engine/global.css'
import { initLoop } from './engine/loop'
import { rootEntity } from './engine/RootEntity'
import { FPSCounter } from './engine/FPSCounter'
import { Star } from './entities/Star'

const fpsCounter = new FPSCounter()
rootEntity.add(fpsCounter)

initLoop(rootEntity)
