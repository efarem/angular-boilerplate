// ========================================
//
//  Gulp /w SCSS + PostCSS for AngularJS
//
//  Prerequisites: npm, gulp, postcss
//
//  Setup:
//  - Install the node modules with "npm install"
//  - Install angular and its dependencies with "bower install"
//  - Add correct Bower components path to components
//
//  Commands:
//  gulp watch       Runs 'gulp build' then starts server and watch for file changes
//  gulp build       Compiles scss and js into minifyed files
//
//  Author : Ben Brown
//
// =======================================

'use-strict';

// Gulp Dependencies
import gulp from 'gulp';
import server from 'browser-sync';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import ngAnnotate from 'gulp-ng-annotate';

// PostCSS Dependencies
import autoprefixer from 'autoprefixer';
import lost from 'lost';
import rucksack from 'rucksack-css';
import cssnano from 'cssnano';
import cssnext from 'cssnext';

// PostCSS Processors
const processors = [
  autoprefixer({ browsers: ['last 2 versions', '> 5%', 'ie 6-8'] }), // Apply vendor prefixes
  lost(), // Lost Grid - https://github.com/corysimmons/lost
  rucksack(), // Rucksack CSS Extenstions - https://simplaio.github.io/rucksack/
  cssnano({ discardComments: { removeAll: true } }), // Minify CSS
  cssnext(), // Usable CSS4 features - http://cssnext.io/
];

// Error handling
function handleError(error) {
  console.error(error.toString());
  this.emit('end');
}

// Bower components
const components = [];
components.js = [
  'angular/angular.js',
  'angular-animate/angular-animate.js',
  'angular-ui-router/release/angular-ui-router.js',
];
components.css = [

];

// Build styles
function styles() {
  return gulp.src('app/styles/styles.scss')
    .pipe(sass())
      .on('error', handleError)
    .pipe(postcss(processors))
    .pipe(gulp.dest('dist/styles'))
    .pipe(server.stream());
}

// Lint scripts
function lintScripts() {
  return gulp.src(['app/**/*.js', '!app/test-helpers/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// Build scripts
function scripts() {
  return gulp.src(['app/**/*.js', '!app/test-helpers/*.js', '!app/**/*.spec.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(babel())
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
      .on('error', handleError)
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
}

// Build components
function bowerComponents() {
  if (components.js.length) {
    components.js.forEach((component, i) => {
      components.js[i] = `bower_components/${component}`;
    });

    return gulp.src(components.js)
      .pipe(babel())
      .pipe(concat('components.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist/scripts'));
  }

  if (components.css.length) {
    components.css.forEach((component, i) => {
      components.css[i] = `bower_components/${component}`;
    });

    return gulp.src(components.css)
      .pipe(concat('components.css'))
      .pipe(gulp.dest('dist/styles'));
  }
}

// Watch for style/script changes
function watch() {
  server.init({
    server: {
      baseDir: './',
    },
  });

  gulp.watch('app/styles/*.scss', gulp.series(styles));
  gulp.watch('app/**/*.js', gulp.series(lintScripts, scripts, server.reload));
  gulp.watch('bower_components/**/*', gulp.series(bowerComponents));
}

// Gulp tasks
gulp.task('build', gulp.series(lintScripts, scripts, bowerComponents, styles));
gulp.task('watch', gulp.series(lintScripts, scripts, bowerComponents, styles, watch));
