var gulp  = require('gulp')
var mocha = require('gulp-mocha')

/*
 * white-box test task
 */
gulp.task('test:wbox', function() {
  return gulp.src('test/white-box/lazyarray-lite_test.js', {read: false})
    .pipe(mocha())
})

/*
 * black-box test task
 */
gulp.task('test:bbox', function() {
  return gulp.src('test/black-box/lazyarray-lite_test.js', {read: false})
    .pipe(mocha())
})

/*
 * test task
 */
gulp.task('test', ['test:bbox', 'test:wbox'])