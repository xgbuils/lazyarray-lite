var gulp    = require('gulp')
var mocha   = require('gulp-mocha')
var notify  = require('gulp-notify');
var fs      = require('fs')
var util    = require('gulp-util');
var semver  = require('semver')
var bump    = require('gulp-bump')
var replace = require('gulp-replace')
var insert  = require('gulp-insert')


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

gulp.task('bower', function () {
  gulp.src('./lazyarray-lite.js')
    .pipe(replace(/module.exports\s*=\s*LazyArray/g, ''))
    .pipe(insert.prepend('window.LazyArray = (function () {\n'))
    .pipe(insert.append('\nreturn LazyArray })()'))
    .pipe(gulp.dest('./dist/'))
})

/*
 * bump task
 */
gulp.task('bump', function(cb){
  var newVersion = util.env.version

  getPackageVersion(function (err, oldVersion) {
  	console.log('oldVersion: ', oldVersion)
    if (err) {
      cb(err)
    } else if (!semver.valid(oldVersion)) {
      cb(new Error('version (' + oldVersion + ') of package is broken'))
    } else if (!semver.valid(newVersion)) {
      cb(new Error('new version (' + newVersion + ') is not valid version'))
    } else if (!semver.gt(newVersion, oldVersion)) {
      cb(new Error('new version (' + newVersion + ') is not greater than old version (' + oldVersion + ')'))
    } else {
      console.log('inserting ', newVersion)
      gulp.src('./*.json')
        .pipe(bump({version: newVersion}))
        .pipe(gulp.dest('./'))

      gulp.src('./*.md')
        .pipe(replace(/(version\s+)(\S+)/gi, function (match, p1, version) {
          if (!semver.valid(version) || version !== oldVersion) {
          	console.log(version, oldVersion)
          	return match
          } else {
            return p1 + newVersion
          }
        }))
        .pipe(gulp.dest('./'))
    }
  })
});

function getPackageVersion(cb) {
  fs.readFile('./package.json', 'utf-8', function (err, content) {
    if (err) {
      cb(err)
    } else {
      var version
      try {
        version = JSON.parse(content).version
        cb(null, version)
      } catch (e) {
        cb(err)
      }
    }
  })
}