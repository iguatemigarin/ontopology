type Pitch = 'BRIGHT' | 'DARK'

export class ThrustSound {
  ctx: AudioContext
  source: AudioBufferSourceNode
  buffer: AudioBuffer
  pitch: Pitch
  filterNode: BiquadFilterNode
  gainNode: GainNode

  constructor(pitch: Pitch) {
    this.pitch = pitch
    this.ctx = new AudioContext()

    this.filterNode = this.ctx.createBiquadFilter()
    this.filterNode.type = 'lowpass'
    this.filterNode.frequency.setValueAtTime(this.pitch === 'DARK' ? 200 : 2000, 0)

    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.setValueAtTime(this.pitch === 'DARK' ? 1 : 0.2, 0)

    const bufferSize = this.ctx.sampleRate * 2
    this.buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = this.buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    this.source = this.ctx.createBufferSource()
  }

  play() {
    this.source = this.ctx.createBufferSource()
    this.source.buffer = this.buffer
    this.source.loop = true

    this.source.connect(this.gainNode)
    this.gainNode.connect(this.filterNode)
    this.filterNode.connect(this.ctx.destination)
    this.source.start()
  }

  stop() {
    this.source.stop()
  }
}
