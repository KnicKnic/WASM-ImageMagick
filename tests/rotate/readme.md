# NodeJS test case
A simple test case to test whether or not wasm file works. I used NodeJS thinking I could just easily reference the ES module.

I ended up just copying the wasm loading code to for expedience.

# To run
run from this directory after doing a build (if on windows change "$PWD" to "%CD%")
```
docker run -v "$PWD":/code --rm -it --workdir /code node node  /code/node.js
```