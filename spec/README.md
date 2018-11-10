Contains basic jasmine specs written with typescript that runs in headless browser. Technologies: gulp-jasmine-browser, puppeteer 

 * `npm test` will compile ts and run specs in dist/ in chrome headless browser - puppeteer - see gulpfile.js
 * npm test-server will launch tests as server so they can be debugged at http://localhost:8888
 
# TODO

 * use open / browser-sync to better development
 * use other browsers see gulp-jasmine-browser