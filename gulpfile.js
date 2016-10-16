var gulp = require('gulp');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream
var wiredep2 = require('wiredep') //.stream
var del = require('del');
var filter = require('gulp-filter');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var htmlhint = require("gulp-htmlhint");
var htmlmin = require('gulp-htmlmin');
var csslint = require('gulp-csslint');
var uncss = require('gulp-uncss');
var cssmin = require('gulp-cssmin');
var jshint  = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
//var mainBowerFiles = require('gulp-main-bower-files');
var newer = require('gulp-newer');
var browserSync = require('browser-sync').create();
var plugins = require('gulp-load-plugins')();
var debug = require('gulp-debug');
var runSequence = require('run-sequence');


// Static server
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "public",
            files: ["public/css/*.css", "public/js/*.js", "public/vendor/*, public/index.html", "public/img/*"],
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
    gulp.watch('src/global/*.scss', ['css']);
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch('src/img/*', ['img']);
    gulp.watch('src/index.html', ['html']).on('change', browserSync.reload);
});

gulp.task('clean', function(){
  return del(['public']);
});

gulp.task('clean:css', function() {
  del (['public/css/*.css']);
})

gulp.task('clean:js', function() {
  del (['public/js/*.js']);
})

gulp.task('clean:vendor', function() {
  del (['public/vendor/*']);
})

gulp.task('lint:css', function() {
  var injectAppFiles = gulp.src('src/css/*.scss', {read: false});
  var injectGlobalFiles = gulp.src('src/global/*.scss', {read: false});

  function transformFilepath(filepath) {
    return '@import "' + filepath + '";';
  }

  // My SCSS
  var injectAppOptions = {
    transform: transformFilepath,
    starttag: '// inject:app',
    endtag: '// endinject',
    addRootSlash: false
  };

  // Global Overrides
  var injectGlobalOptions = {
    transform: transformFilepath,
    starttag: '// inject:global',
    endtag: '// endinject',
    addRootSlash: false
  };

  gulp.src('src/main.scss')
    .pipe(inject(injectGlobalFiles, injectGlobalOptions))
    .pipe(inject(injectAppFiles, injectAppOptions))
    .pipe(sass())
    .on('error', function(err) {
      console.error(err.message);
      browserSync.notify(err.message, 3000); // Display error in the browser
      this.emit('end'); // Prevent gulp from catching the error and exiting the watch process
    })
    .pipe(csslint())
    .pipe(csslint.formatter(require('csslint-stylish')))
});


gulp.task('css', function() {
  var injectAppFiles = gulp.src('src/css/*.scss', {read: false});
  var injectGlobalFiles = gulp.src('src/global/*.scss', {read: false});

  function transformFilepath(filepath) {
    return '@import "' + filepath + '";';
  }

  // My SCSS
  var injectAppOptions = {
    transform: transformFilepath,
    starttag: '// inject:app',
    endtag: '// endinject',
    addRootSlash: false
  };

  // Global Overrides
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
    .on('error', function(err) {
      console.error(err.message);
      browserSync.notify(err.message, 3000); // Display error in the browser
      this.emit('end'); // Prevent gulp from catching the error and exiting the watch process
    })
    //.pipe(uncss({
    //  html: ['src/index.html'] Messing up MDL template
    //}))
    //.pipe(csslint())
    //.pipe(csslint.formatter(require('csslint-stylish')))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
});


gulp.task('css-min', function() {
  var injectAppFiles = gulp.src('src/css/*.scss', {read: false});
  var injectGlobalFiles = gulp.src('src/global/*.scss', {read: false});

  function transformFilepath(filepath) {
    return '@import "' + filepath + '";';
  }

  // My SCSS
  var injectAppOptions = {
    transform: transformFilepath,
    starttag: '// inject:app',
    endtag: '// endinject',
    addRootSlash: false
  };

  // Global Overrides
  var injectGlobalOptions = {
    transform: transformFilepath,
    starttag: '// inject:global',
    endtag: '// endinject',
    addRootSlash: false
  };

  gulp.src('src/main.scss')
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
    //.pipe(csslint())
    //pipe(csslint.formatter(require('csslint-stylish')))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
});

// Not in use - Currently injecting all into main.scss
// In future consider seperating out vendor compiled scss
// Makes lint + opt cleaner
// Gather all scss from bower
gulp.task('wiredep-scss', function() {
  gulp.src('src/css/vendor.scss')
   .pipe(wiredep2())
   .pipe(sass())
   .pipe(rename('scss.css'))
   .pipe(gulp.dest('public/vendor'))
});

// Placeholder
gulp.task('js', function() {
  return gulp.src(['src/js/*.js'])
    .pipe(jshint ())
    .pipe(jshint .reporter('jshint-stylish'))
    .pipe(gulp.dest('public/js'))
});

// Placeholder
gulp.task('js-min', function() {
  gulp.src(['src/js/*.js'])
    .pipe(jshint ())
    .pipe(jshint .reporter('jshint-stylish'))
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/js'))
});

gulp.task('img', function() {
  return gulp.src('src/img/*')
    .pipe(newer('public/img'))
    .pipe(imagemin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/img'))
});

gulp.task('fonts', function() {
  return gulp.src('bower_components/components-font-awesome/fonts/*')
    .pipe(gulp.dest('public/fonts'))
});

gulp.task('bower:css', function() {
  return gulp.src(wiredep2().css)
    .pipe(gulp.dest('public/vendor'));
});

gulp.task('bower:js', function() {
  return gulp.src(wiredep2().js)
    .pipe(gulp.dest('public/vendor'));
});

// Gather all css from bower + concat + minify
gulp.task('bower:css-min', function() {
 return gulp.src(wiredep2().css)
   .pipe(concat('vendor.css'))
   .pipe(cssmin())
   .pipe(rename({suffix: '.min'}))
   .pipe(gulp.dest('public/vendor'))
});

// Gather all js from bower + concat + minify
gulp.task('bower:js-min', function() {
 return gulp.src(wiredep2().js)
   .pipe(concat('vendor.js'))
   .pipe(uglify())
   .pipe(rename({suffix: '.min'}))
   .pipe(gulp.dest('public/vendor'))
});


gulp.task('html', function() {
  return gulp.src('src/index.html')
    // Inject bower css/js as vendor
    .pipe(wiredep2.stream({
      fileTypes: {
        html: {
          replace: {
            js: function(filePath) {
              return '<script src="' + 'vendor/' + filePath.split('/').pop() + '"></script>';
            },
            css: function(filePath) {
              return '<link rel="stylesheet" href="' + 'vendor/' + filePath.split('/').pop() + '"/>';
            }
          }
        }
      }
    }))

// Inject personal CSS
  .pipe(inject(
    //gulp.src(['src/**/*.css'], { read: false }), {
    gulp.src(['public/css/main.css'], { read: false }), {
      addRootSlash: false,
      transform: function(filePath, file, i, length) {
        return '<link rel="stylesheet" href="' + filePath.replace('public/', '') + '"/>';
    }
  }))

  // Inject personal JS
  .pipe(inject(
    gulp.src(['src/js/*.js'], { read: false }), {
      addRootSlash: false,
      transform: function(filePath, file, i, length) {
        return '<script src="' + filePath.replace('public/', '') + '"></script>';
      }
    }))

    .pipe(htmlhint())
    .pipe(htmlhint.reporter(require('htmlhint-stylish')))
    .pipe(gulp.dest('public'));
});


gulp.task('html-min', function() {
  return gulp.src('src/index.html')
    // Inject bower css/js as vendor
    .pipe(wiredep2.stream({
      fileTypes: {
        html: {
          replace: {
            js: function(filePath) {
              return '<script src="' + 'vendor/' + filePath.split('/').pop() + '"></script>';
            },
            css: function(filePath) {
              return '<link rel="stylesheet" href="' + 'vendor/' + filePath.split('/').pop() + '"/>';
            }
          }
        }
      }
    }))

    // Inject personal CSS
    .pipe(inject(
      //gulp.src(['src/**/*.css'], { read: false }), {
      gulp.src(['public/css/*.css'], { read: false }), {
        addRootSlash: false,
        transform: function(filePath, file, i, length) {
          return '<link rel="stylesheet" href="' + filePath.replace('public/', '') + '"/>';
      }
    }))
    // Inject personal JS
    .pipe(inject(
      gulp.src(['src/**/*.js'], { read: false }), {
        addRootSlash: false,
        transform: function(filePath, file, i, length) {
          return '<script src="' + filePath.replace('public/', '') + '"></script>';
        }
      }))
      .pipe(htmlhint())
      .pipe(htmlhint.reporter(require('htmlhint-stylish')))
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        removeCommentsFromCDATA: true,
        removeCDATASectionsFromCDATA: true,
        collapseBooleanAttributes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true
      }))
      .pipe(gulp.dest('public'));
});


// Default for Development
gulp.task('build-dev', function(callback) {
  runSequence('clean',
              ['css', 'js', 'bower:css', 'bower:js', 'fonts', 'img'],
              'html',
              'lint:css',
              callback);
});

// Build for Production
gulp.task('build', function(callback) {
  runSequence('clean',
              ['css-min', 'js-min', 'bower:css', 'bower:js', 'fonts', 'img'],
              'html-min',
              'lint:css',
              callback);
});

// Same as build + concats & optimizes vendors
gulp.task('build-min', function(callback) {
  runSequence('clean',
              ['css-min', 'js-min', 'bower:css-min', 'bower:js-min', 'fonts', 'img'],
              'html-min',
              'lint:css',
              callback);
});

// Default for Development
gulp.task('default', ['build-dev']);
