var gulp = require('gulp');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
var del = require('del');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var htmlmin = require('gulp-htmlmin');


gulp.task('clean', function(){
  return del(['public']);
});


gulp.task('css', ['clean'], function(){
  var injectAppFiles = gulp.src('src/css/*.scss', {read: false});
  var injectGlobalFiles = gulp.src('src/global/*.scss', {read: false});

  function transformFilepath(filepath) {
    return '@import "' + filepath + '";';
  }

  var injectAppOptions = {
    transform: transformFilepath,
    starttag: '// inject:app',
    endtag: '// endinject',
    addRootSlash: false
  };

  var injectGlobalOptions = {
    transform: transformFilepath,
    starttag: '// inject:global',
    endtag: '// endinject',
    addRootSlash: false
  };

  return gulp.src('src/main.scss')
    .pipe(wiredep())
    .pipe(inject(injectGlobalFiles, injectGlobalOptions))
    .pipe(inject(injectAppFiles, injectAppOptions))
    .pipe(sass())
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/css'))
});


gulp.task('vendors', ['clean'], function(){
  return gulp.src(mainBowerFiles())
    .pipe(filter('*.css'))
    .pipe(concat('vendors.css'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/css'))
})


gulp.task('html', ['clean', 'css', 'vendors'], function() {
  var injectFiles = gulp.src(['public/css/main.min.css', 'public/css/vendors.css']);

  var injectOptions = {
    addRootSlash: false,
    ignorePath: ['src', 'public']
  };

  //return gulp.src('src/html/*.html')
  return gulp.src('src/index.html')
    .pipe(inject(injectFiles, injectOptions))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('public'));
});


gulp.task('default', ['clean', 'css', 'vendors', 'html']);
