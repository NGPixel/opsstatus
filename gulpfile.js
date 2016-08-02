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
var include = require("gulp-include");

/**
 * Paths
 *
 * @type       {Object}
 */
var paths = {
	scriptlibs: {
		admin: [
      './node_modules/lodash/lodash.min.js',
      './node_modules/jquery/dist/jquery.min.js',
      './node_modules/bluebird/js/browser/bluebird.min.js',
      './node_modules/moment/min/moment-with-locales.min.js',
      './node_modules/moment-timezone/builds/moment-timezone-with-data.min.js',
      './node_modules/chart.js/dist/Chart.min.js',
      './node_modules/vue/dist/vue.min.js',
      './node_modules/pikaday/pikaday.js',
      './node_modules/pikaday/plugins/pikaday.jquery.js',
      './node_modules/sortablejs/Sortable.min.js',
      './node_modules/vex-js/js/vex.combined.min.js',
      './node_modules/simplemde/dist/simplemde.min.js',
      './node_modules/timepicker/jquery.timepicker.min.js',
		],
		client: [
			'./node_modules/lodash/lodash.min.js',
      './node_modules/jquery/dist/jquery.min.js',
      './node_modules/vue/dist/vue.min.js',
      './node_modules/vex-js/js/vex.combined.min.js',
      './node_modules/chart.js/dist/Chart.bundle.min.js'
		]
	},
	scriptapps: [
		'./client/js/components/*.js',
		'./client/js/app.js'
	],
	scriptadmin: [
		'./client/js/admin.js'
	],
	scriptappswatch: [
		'./client/js/**/*.js'
	],
	csslibs: [
		'./node_modules/font-awesome/css/font-awesome.min.css',
		'./node_modules/gridlex/dist/gridlex.min.css',
		'./node_modules/vex-js/css/vex.css',
		'./node_modules/vex-js/css/vex-theme-os.css',
		'./node_modules/simplemde/dist/simplemde.min.css',
		'./node_modules/pikaday/css/pikaday.css',
		'./node_modules/timepicker/jquery.timepicker.min.css'
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
	return merge(

		gulp.src(paths.scriptlibs.admin)
		.pipe(plumber())
		.pipe(concat('libs.admin.js'))
		.pipe(uglify({ mangle: false }))
		.pipe(plumber.stop())
		.pipe(gulp.dest("./public/js")),

		gulp.src(paths.scriptlibs.client)
		.pipe(plumber())
		.pipe(concat('libs.client.js'))
		.pipe(uglify({ mangle: false }))
		.pipe(plumber.stop())
		.pipe(gulp.dest("./public/js"))

	);
});

/**
 * TASK - Combine, make compatible and compress js app scripts
 */
gulp.task("scripts-app", function () {
	return merge(

		gulp.src(paths.scriptapps)
		.pipe(plumber())
		.pipe(concat('app.js'))
		.pipe(babel())
		.pipe(uglify())
		.pipe(plumber.stop())
		.pipe(gulp.dest("./public/js")),

		gulp.src(paths.scriptadmin)
		.pipe(plumber())
		.pipe(concat('admin.js'))
		.pipe(include({ extensions: "js" }))
		.pipe(babel())
		.pipe(uglify())
		.pipe(plumber.stop())
		.pipe(gulp.dest("./public/js"))

	);
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
	.pipe(sass())
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
	gulp.watch([paths.scriptappswatch], ['scripts-app']);
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