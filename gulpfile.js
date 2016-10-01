var gulp = require('gulp');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var del = require('del');

gulp.task('clean', function(){
  return del(['public']);
});

gulp.task('styles', ['clean'], function(){
  return gulp.src('src/css/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
});

gulp.task('default', ['clean', 'styles'], function(){
  var injectFiles = gulp.src(['public/css/main.css']);

  var injectOptions = {
    addRootSlash: false,
    ignorePath: ['src', 'public']
  };

  return gulp.src('src/index.html')
    .pipe(inject(injectFiles, injectOptions))
    .pipe(gulp.dest('public'));
});
