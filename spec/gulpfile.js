var gulp = require('gulp');
var jasmineBrowser = require('gulp-jasmine-browser');

const src = ['../dist/bundle.js', '../dist/assets/**/*']

gulp.task('jasmine', function () {
  return gulp.src(src)
    .pipe(jasmineBrowser.specRunner({ console: true }))
    .pipe(jasmineBrowser.headless({ driver: 'chrome' })); 
});

gulp.task('jasmine-server', function () {
  return gulp.src(src)
    .pipe(jasmineBrowser.specRunner({ console: true }))
    .pipe(jasmineBrowser.server());
});
