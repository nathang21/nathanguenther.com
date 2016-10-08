var gulp = require('gulp');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
var del = require('del');
//var mainBowerFiles = require('main-bower-files');
var mainBowerFiles = require('gulp-main-bower-files');
var filter = require('gulp-filter');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var htmlhint = require("gulp-htmlhint");
var htmlmin = require('gulp-htmlmin');
var csslint = require('gulp-csslint');
var uncss = require('gulp-uncss');
var cssmin = require('gulp-cssmin');
var jslint = require('gulp-jslint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var newer = require('gulp-newer');

// Static server
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "public",
            files: ["public/css/*.css", "public/js/*.js", "public/index.html", "public/img*"],
            index: "index.html",
            logLevel: "debug",
            logFileChanges: true,
            logConnections: true,
            plugins: ["browser-sync-logger"],
            https: false,
            reloadOnRestart: true
        }
    });

    gulp.watch('src/css/*.scss', ['css']);
    gulp.watch('src/img/*', ['img']);
    gulp.watch('src/index.html', ['html']).on('change', browserSync.reload);
});

gulp.task('clean', function(){
  del(['public']);
});

gulp.task('clean:css', function() {
  del (['public/css/*.css']);
})

gulp.task('css', function(){
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

  gulp.src('src/main.scss')
    .pipe(wiredep())
    .pipe(inject(injectGlobalFiles, injectGlobalOptions))
    .pipe(inject(injectAppFiles, injectAppOptions))
    .pipe(sass())
    .on('error', function(err) {
      console.error(err.message);
      browserSync.notify(err.message, 3000); // Display error in the browser
      this.emit('end'); // Prevent gulp from catching the error and exiting the watch process
    })
    //.pipe(uncss({
    //  html: ['src/index.html'] Messing up MDL template
    //}))
    .pipe(csslint())
    .pipe(csslint.formatter(require('csslint-stylish')))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
});

// Not in use - replaced by 'bower' task
gulp.task('vendor', function() {
  gulp.src(mainBowerFiles())
    .pipe(filter('*.css'))
    .pipe(concat('vendors.css'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
});


gulp.task('bower', function() {
  var jsFilter = filter('**//*.js', {restore: true});
  var cssFilter = filter('**//*.css', {restore: true});
  gulp.src('bower.json')
    .pipe(mainBowerFiles())
    .pipe(jsFilter)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/js'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(concat('vendor.css'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/css'))
    .pipe(cssFilter.restore)
});

// Placeholder
gulp.task('js', function() {
  gulp.src(['src/js/*.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('public/js'))
});


gulp.task('img', function() {
  gulp.src('src/img/*')
    .pipe(newer('public/img'))
    .pipe(imagemin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/img'))
});


gulp.task('html', function() {
  var sources = gulp.src(['public/css/main.min.css', 'public/css/vendor.min.css', 'public/js/vendor.min.js'], {read: false});
  //var sources = ['public/css/main.min.css', 'public/css/vendor.min.css', 'public/js/vendor.min.js']
  //var target = gulp.src('src/index.html');

  var injectOptions = {
    addRootSlash: false,
    ignorePath: ['src', 'public']
  };

   //gulp.src('src/html/*.html')
   gulp.src('src/index.html')
    .pipe(inject(sources, injectOptions))
    .pipe(htmlhint())
    .pipe(htmlhint.reporter(require('htmlhint-stylish')))
    //.pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('public'))

    //return merge(sources, target);
});


gulp.task('default', ['clean', 'bower', 'css', 'img', 'html']);
