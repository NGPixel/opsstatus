var gulp = require("gulp");
var merge = require('merge-stream');
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var plumber = require('gulp-plumber');
var zip = require('gulp-zip');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');

/**
 * Paths
 *
 * @type       {Object}
 */
var paths = {
	scriptlibs: [
      './node_modules/lodash/lodash.min.js',
      './node_modules/jquery/dist/jquery.min.js',
      './node_modules/bluebird/js/browser/bluebird.min.js',
      './node_modules/moment/min/moment-with-locales.min.js',
      './node_modules/vue/dist/vue.min.js',
      './node_modules/pikaday/pikaday.js'
	],
	scriptapps: [
		'./client/js/*.js'
	],
	csslibs: [
		'./node_modules/font-awesome/css/font-awesome.min.css',
		'./node_modules/gridlex/dist/gridlex.min.css'
	],
	cssapps: [
		'./client/css/app.scss'
	],
	cssappswatch: [
		'./client/css/**/*.scss'
	],
	fonts: [
		'./node_modules/font-awesome/fonts/*-webfont.*',
		'!./node_modules/font-awesome/fonts/*-webfont.svg'
	],
	deploypackage: [
		'./**/*',
		'!node_modules', '!node_modules/**',
		'!coverage', '!coverage/**',
		'!client/js', '!client/js/**',
		'!dist', '!dist/**',
		'!tests', '!tests/**',
		'!gulpfile.js', '!inch.json', '!config.json'
	]
};

/**
 * TASK - Starts server in development mode
 */
gulp.task('server', ['scripts', 'css', 'fonts'], function() {
	nodemon({
		script: './server',
		ignore: ['public/', 'client/', 'tests/'],
		ext: 'js json',
		env: { 'NODE_ENV': 'development' }
	});
});

/**
 * TASK - Process all scripts processes
 */
gulp.task("scripts", ['scripts-libs', 'scripts-app']);

/**
 * TASK - Combine js libraries
 */
gulp.task("scripts-libs", function () {
	return gulp.src(paths.scriptlibs)
	.pipe(plumber())
	.pipe(concat('libs.js'))
	.pipe(uglify({ mangle: false }))
	.pipe(plumber.stop())
	.pipe(gulp.dest("./public/js"));
});

/**
 * TASK - Combine, make compatible and compress js app scripts
 */
gulp.task("scripts-app", function () {
	return gulp.src(paths.scriptapps)
	.pipe(plumber())
	.pipe(concat('app.js'))
	.pipe(babel())
	.pipe(uglify())
	.pipe(plumber.stop())
	.pipe(gulp.dest("./public/js"));
});

/**
 * TASK - Process all css processes
 */
gulp.task("css", ['css-libs', 'css-app']);

/**
 * TASK - Combine css libraries
 */
gulp.task("css-libs", function () {
	return gulp.src(paths.csslibs)
	.pipe(plumber())
	.pipe(concat('libs.css'))
	.pipe(cleanCSS({ keepSpecialComments: 0 }))
	.pipe(plumber.stop())
	.pipe(gulp.dest("./public/css"));
});

/**
 * TASK - Combine app css
 */
gulp.task("css-app", function () {
	return gulp.src(paths.cssapps)
	.pipe(plumber())
	.pipe(sass({ outputStyle: 'compressed' }))
	.pipe(concat('app.css'))
	.pipe(cleanCSS({ keepSpecialComments: 0 }))
	.pipe(plumber.stop())
	.pipe(gulp.dest("./public/css"));
});

/**
 * TASK - Copy web fonts
 */
gulp.task("fonts", function () {
	return gulp.src(paths.fonts)
	.pipe(gulp.dest("./public/fonts"));
});

/**
 * TASK - Start dev watchers
 */
gulp.task('watch', function() {
	gulp.watch([paths.scriptapps], ['scripts-app']);
	gulp.watch([paths.cssappswatch], ['css-app']);
});

/**
 * TASK - Starts development server with watchers
 */
gulp.task('default', ['watch', 'server']);

/**
 * TASK - Creates deployment packages
 */
gulp.task('deploy', ['scripts', 'css', 'fonts'], function() {
	var zipStream = gulp.src(paths.deploypackage)
		.pipe(zip('opsstatus.zip'))
		.pipe(gulp.dest('dist'));

	var targzStream = gulp.src(paths.deploypackage)
		.pipe(tar('opsstatus.tar'))
		.pipe(gzip())
		.pipe(gulp.dest('dist'));

	return merge(zipStream, targzStream);
});