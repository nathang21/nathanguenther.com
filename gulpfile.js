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
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();

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
            plugins: ["browser-sync-logger"]
        }
    });

    gulp.watch('src/css/*.scss', ['clean:css', 'css']);
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
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
});


gulp.task('vendor', function(){
  gulp.src(mainBowerFiles())
    .pipe(filter('*.css'))
    .pipe(concat('vendors.css'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
})


gulp.task('html', function() {
  var injectFiles = gulp.src(['public/css/main.min.css', 'public/css/vendors.css']);

  var injectOptions = {
    addRootSlash: false,
    ignorePath: ['src', 'public']
  };

  //return gulp.src('src/html/*.html')
 gulp.src('src/index.html')
    .pipe(inject(injectFiles, injectOptions))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('public'));
});

gulp.task('img', function() {
  gulp.src('src/img/*')
    .pipe(imagemin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/img'))
});

gulp.task('default', ['clean', 'css', 'vendor', 'img', 'html']);
