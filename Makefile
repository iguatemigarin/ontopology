.PHONY: build start clean

public/pkg:
	cargo install wasm-pack

build: clean
	wasm-pack build --target web --out-dir public/pkg

start: build
	python3 -m http.server -d public 8000

clean:
	rm -rf public/pkg target
