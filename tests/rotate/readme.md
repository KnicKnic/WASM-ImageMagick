# NodeJS test case
A simple test case to test whether or not wasm file works. I used NodeJS thinking I could just easily reference the ES module.

I ended up just copying the wasm loading code to for expedience.

# To run
run from the root directory of the project (if not on windows change "%CD%" to "$pwd")
```
docker run -v "%CD%":/code --rm -it --workdir /code node node  /code/tests/rotate/node.js
```