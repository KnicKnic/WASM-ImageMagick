contains basic jasmine specs written with typescript that runs in headless browser 

 * npm test will compile ts and run specs in dist/ in chrome headless browser - see gulpfile.js
 * npm test-server will put tsc to watch files and webpack to watch dist/**/*.js to build the bundle and run gulp-jasmine-browser and open the page in the browser so we can debug the app using 

TODO: 

use browser-sync ? 