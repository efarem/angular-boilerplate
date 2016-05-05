/*========================================

	Gulp /w SCSS + PostCSS for AngularJS

	Prerequisites: npm, gulp, postcss

	Setup:
	- Configure the Browsersync options
	- Install the node modules with "npm install"
    - Install angular and its dependencies with "bower install"
	- Run gulp and browser-sync with "gulp watch"

	Commands:
	gulp watch		   Watch for file changes and perform the correct tasks
	gulp styles		   Compiles scss and runs postcss processors
	gulp scripts 	   Concats and minifys dev js into one file for prod
    gulp components    Concats and minifys bower components js and scss into single seperate files for prod

	Author : Ben Brown

========================================*/

// Browsersync options
var options = {
	'browser-sync': true,
	'domain': 'http://192.168.0.4:8080'
};


// Dependencies
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	postcss = require('gulp-postcss'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	ngAnnotate = require('gulp-ng-annotate'),
	babel = require('gulp-babel');

if (options['browser-sync']) {
	var browserSync = require('browser-sync').create();
}

// PostCSS Processors
var processors = [
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
var components = [];
components.js = [
	'angular/angular.js',
	'angular-animate/angular-animate.js',
	'angular-ui-router/release/angular-ui-router.js'
];
components.css = [

];

// Watch for style/script changes and sync browser if turned on
gulp.task('watch', function() {
	if (options['browser-sync']) {
		browserSync.init({
			proxy: options.domain
		});
	} else {
		console.log('Not running browser-sync');
	}

	if (options['browser-sync']) {
		gulp.watch('styles/*.scss', ['styles']).on('change', browserSync.reload);
		gulp.watch('app/**/*.js', ['scripts']).on('change', browserSync.reload);
		gulp.watch('bower_components/**/*', ['components']).on('change', browserSync.reload);
		gulp.watch('**/*.html').on('change', browserSync.reload);
	} else {
		gulp.watch('styles/*.scss', ['styles']);
		gulp.watch('app/**/*.js', ['scripts']);
		gulp.watch('bower_components/**/*', ['components']);
	}
});

// Build styles
gulp.task('styles', function() {
	var build = gulp.src('styles/styles.scss')
		.pipe(sass())
        .on('error', handleError)
		.pipe(postcss(processors))
		.pipe(gulp.dest('prod/styles'));

	return build;
});

// Build scripts
gulp.task('scripts', function() {
	return gulp.src('app/**/*.js')
		.pipe(babel())
		.pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .on('error', handleError)
		.pipe(uglify())
		.pipe(gulp.dest('prod/scripts'));
});

// Build components
gulp.task('components', ['components-js', 'components-css']);

gulp.task('components-js', function() {
	components.js.forEach(function(component, i) {
		components.js[i] = 'bower_components/' + component;
	});

	return gulp.src(components.js)
		.pipe(babel())
        .pipe(concat('components.js'))
        .pipe(uglify())
        .pipe(gulp.dest('prod/scripts'));
});

gulp.task('components-css', function() {
	components.css.forEach(function(component, i) {
		components.css[i] = 'bower_components/' + component;
	});

	return gulp.src(components.css)
        .pipe(concat('components.css'))
        .pipe(gulp.dest('prod/styles'));
});
