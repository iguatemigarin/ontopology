use wasm_bindgen::prelude::*;

// x, y, vx, vy, m
static mut OBJECTS: Vec<f32> = Vec::new();

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

#[wasm_bindgen]
pub fn update(_delta: f32, aspect: f32) {
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
            // TODO
            let _mass = i + 4;

            OBJECTS[px] += OBJECTS[vx];
            OBJECTS[py] += OBJECTS[vy];

            if OBJECTS[px] > x_boundary {
                OBJECTS[px] = -x_boundary;
            } else if OBJECTS[px] < -x_boundary {
                OBJECTS[px] = x_boundary;
            }

            if OBJECTS[py] > y_boundary {
                OBJECTS[py] = -y_boundary;
            } else if OBJECTS[py] < -y_boundary {
                OBJECTS[py] = y_boundary;
            }

            i += 5;
            if i >= count {
                break;
            }
        }
    }
}
