# ontopology

N-body gravity simulation using WebGL + WebAssembly (Rust).

## Tech Stack

- WebGL for rendering
- Rust/WASM for physics calculations
- Vanilla JS

## Particle Data Structure

Each particle: `[px, py, vx, vy, ax, ay, mass]` (7 floats, 28 bytes stride)

## Parameters

- `G`: gravitational constant
- `integrationTimestep`: physics timestep
- `particleCount`: number of particles
- `massiveness`: particle mass
- `distribution`: initial radial distribution

## Run

```sh
make start
```
