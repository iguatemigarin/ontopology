use wasm_bindgen::prelude::*;

static mut OBJECTS: Vec<f32> = Vec::new();
static PARAMS_COUNT: usize = 7;

#[wasm_bindgen]
pub fn populate(init_objects: Vec<f32>) {
    unsafe { OBJECTS = init_objects }
}

#[wasm_bindgen]
pub fn get_buffer_ptr() -> *const f32 {
    unsafe { (&raw const OBJECTS).as_ref().unwrap().as_ptr() }
}

#[wasm_bindgen]
pub fn get_buffer_len() -> usize {
    unsafe { (&raw const OBJECTS).as_ref().unwrap().len() }
}

fn update_positions(aspect: f32) {
    let mut i = 0;
    let (x_boundary, y_boundary) = if aspect < 1.0 {
        (1.0, aspect)
    } else {
        (aspect, 1.0)
    };

    unsafe {
        let count = get_buffer_len();

        loop {
            let px = i;
            let py = i + 1;
            let vx = i + 2;
            let vy = i + 3;
            let mass = i + 6;
            OBJECTS[px] += OBJECTS[vx];
            OBJECTS[py] += OBJECTS[vy];

            // forget if out
            if OBJECTS[px] > x_boundary || OBJECTS[px] < -x_boundary {
                OBJECTS[mass] = 0.0;
            } else if OBJECTS[py] > y_boundary || OBJECTS[py] < -y_boundary {
                OBJECTS[mass] = 0.0;
            }

            i += PARAMS_COUNT;
            if i >= count {
                break;
            }
        }
    }
}

fn update_acceleration(delta: f32, integration_timestep: f32, g: f32) {
    let mut i = 0;

    unsafe {
        let count = get_buffer_len();

        loop {
            // reset acceleration
            OBJECTS[i + 4] = 0.0;
            OBJECTS[i + 5] = 0.0;

            let mut j = 0;
            loop {
                if j >= count {
                    break;
                }
                if j == i {
                    j += PARAMS_COUNT;
                    continue;
                }
                if OBJECTS[j + 6] == 0.0 {
                    j += PARAMS_COUNT;
                    continue;
                }

                let x1 = OBJECTS[i];
                let x2 = OBJECTS[j];
                let y1 = OBJECTS[i + 1];
                let y2 = OBJECTS[j + 1];
                let m1 = OBJECTS[i + 6];
                let m2 = OBJECTS[j + 6];

                let dx = x2 - x1;
                let dy = y2 - y1;
                let r_squared = dx * dx + dy * dy;

                if r_squared < 0.000001 {
                    j += PARAMS_COUNT;
                    continue;
                }

                let r = r_squared.sqrt();
                let r1 = (m1.sqrt()) * 0.001; // match shader multiplier
                let r2 = (m2.sqrt()) * 0.001;
                let collision_dist = r1 + r2;

                // too close?
                if r < collision_dist {
                    // join masses
                    let total_mass = m1 + m2;

                    // merge velocities
                    OBJECTS[i + 2] = (OBJECTS[i + 2] * m1 + OBJECTS[j + 2] * m2) / total_mass;
                    OBJECTS[i + 3] = (OBJECTS[i + 3] * m1 + OBJECTS[j + 3] * m2) / total_mass;
                    OBJECTS[i + 6] = total_mass;

                    // After velocity update, clamp
                    OBJECTS[i + 2] = OBJECTS[i + 2].clamp(-0.1, 0.1);
                    OBJECTS[i + 3] = OBJECTS[i + 3].clamp(-0.1, 0.1);

                    // check for NaN/Inf
                    if !OBJECTS[i + 2].is_finite() || !OBJECTS[i + 3].is_finite() {
                        OBJECTS[i + 2] = 0.0;
                        OBJECTS[i + 3] = 0.0;
                    }

                    // zero out j
                    OBJECTS[j] = 0.0;
                    OBJECTS[j + 1] = 0.0;
                    OBJECTS[j + 2] = 0.0;
                    OBJECTS[j + 3] = 0.0;
                    OBJECTS[j + 4] = 0.0;
                    OBJECTS[j + 5] = 0.0;
                    OBJECTS[j + 6] = 0.0;

                    j += PARAMS_COUNT;
                    continue;
                }
                let force = g * m2 / (r_squared * r * m1);

                OBJECTS[i + 4] += force * dx;
                OBJECTS[i + 5] += force * dy;

                j += PARAMS_COUNT;
            }

            OBJECTS[i + 2] += OBJECTS[i + 4] * delta * integration_timestep;
            OBJECTS[i + 3] += OBJECTS[i + 5] * delta * integration_timestep;

            i += PARAMS_COUNT;
            if i >= count {
                break;
            }
        }
    }
}

#[wasm_bindgen]
pub fn update(delta: f32, aspect: f32, integration_timestep: f32, g: f32) {
    update_acceleration(delta, integration_timestep, g);
    update_positions(aspect);
}
