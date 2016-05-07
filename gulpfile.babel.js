/*========================================

	Gulp /w SCSS + PostCSS for AngularJS

	Prerequisites: npm, gulp, postcss

	Setup:
	- Install the node modules with "npm install"
	- Install angular and its dependencies with "bower install"
	- Add correct Bower components path to components

	Commands:
	gulp watch		   Runs 'gulp build' then starts server and watch for file changes
	gulp build		   Compiles scss and js into minifyed files

	Author : Ben Brown

========================================*/

'use-strict';

// Dependencies
const gulp = require('gulp');
const server = require('gulp-webserver');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const ngAnnotate = require('gulp-ng-annotate');

// PostCSS Processors
const processors = [
	require('autoprefixer')({ browsers: ['last 2 versions', '> 5%', 'ie 6-8']  }), // Apply vendor prefixes
	require('lost')(), // Lost Grid - https://github.com/corysimmons/lost
	require('rucksack-css'), // Rucksack CSS Extenstions - https://simplaio.github.io/rucksack/
	require('cssnano')({ discardComments: { removeAll: true }}), // Minify CSS
	require('cssnext')() // Usable CSS4 features - http://cssnext.io/
];

// Error handling
function handleError (error) {
	console.log(error.toString());
	this.emit('end');
}

// Bower components
const components = [];
components.js = [
	'angular/angular.js',
	'angular-animate/angular-animate.js',
	'angular-ui-router/release/angular-ui-router.js'
];
components.css = [

];

gulp.task('build', gulp.series(scripts, bowerComponents, styles));
gulp.task('watch', gulp.series(scripts, bowerComponents, styles, watch));

// Watch for style/script changes
function watch() {
	gulp.watch('styles/*.scss', gulp.series(styles));
	gulp.watch('app/**/*.js', gulp.series(scripts));
	gulp.watch('bower_components/**/*', gulp.series(bowerComponents));
	gulp.src('./')
		.pipe(server({
			livereload: true,
			fallback: 'index.html'
		}));
}

// Build styles
function styles() {
	return gulp.src('styles/styles.scss')
		.pipe(sass())
        .on('error', handleError)
		.pipe(postcss(processors))
		.pipe(gulp.dest('dist/styles'));
}

// Build scripts
function scripts() {
	return gulp.src('app/**/*.js')
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
			components.js[i] = 'bower_components/' + component;
		});

		return gulp.src(components.js)
			.pipe(babel())
			.pipe(concat('components.js'))
			.pipe(uglify())
			.pipe(gulp.dest('dist/scripts'));
	}

	if (components.css.length) {
		components.css.forEach((component, i) => {
			components.css[i] = 'bower_components/' + component;
		});

		return gulp.src(components.css)
			.pipe(concat('components.css'))
			.pipe(gulp.dest('dist/styles'));
	}
}
