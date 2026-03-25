import './global.css'
import { initLoop } from './loop'
import { rootEntity } from './engine/RootEntity'
import { FPSCounter } from './engine/FPSCounter'

const fpsCounter = new FPSCounter()
rootEntity.add(fpsCounter)

initLoop(rootEntity)
