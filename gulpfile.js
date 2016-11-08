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
	scripts: {
		combine: {
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
				'./node_modules/vex-js/dist/js/vex.combined.min.js',
				'./node_modules/simplemde/dist/simplemde.min.js',
				'./node_modules/timepicker/jquery.timepicker.min.js',
			],
			client: [
				'./node_modules/lodash/lodash.min.js',
				'./node_modules/jquery/dist/jquery.min.js',
				'./node_modules/vue/dist/vue.min.js',
				'./node_modules/vex-js/dist/js/vex.combined.min.js',
				'./node_modules/chart.js/dist/Chart.bundle.min.js'
			]
		},
		compile: [
			'./client/js/*.js',
		],
		watch: [
			'./client/js/**/*.js'
		]
	},
	css: {
		combine: [
			'./node_modules/font-awesome/css/font-awesome.min.css',
			'./node_modules/gridlex/docs/gridlex.min.css',
			'./node_modules/vex-js/dist/css/vex.css',
			'./node_modules/vex-js/dist/css/vex-theme-os.css',
			'./node_modules/simplemde/dist/simplemde.min.css',
			'./node_modules/pikaday/css/pikaday.css',
			'./node_modules/timepicker/jquery.timepicker.min.css'
		],
		compile: [
			'./client/css/*.scss'
		],
		includes: [
			'../core',
			//'./node_modules/requarks-core'
		],
		watch: [
			'./client/css/**/*.scss'
		]
	},
	fonts: [
		'./node_modules/font-awesome/fonts/*-webfont.*',
		'!./node_modules/font-awesome/fonts/*-webfont.svg'
	],
	deploy: [
		'./**/*',
		'!node_modules', '!node_modules/**',
		'!coverage', '!coverage/**',
		'!client/js', '!client/js/**',
		'!dist', '!dist/**',
		'!tests', '!tests/**',
		'!gulpfile.js', '!inch.json', '!config.json', '!opsstatus.sublime-project'
	]
};

/**
 * TASK - Starts server in development mode
 */
gulp.task('server', ['scripts', 'css', 'fonts'], function() {
	nodemon({
		script: './server',
		ignore: ['assets/', 'client/', 'tests/'],
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

		gulp.src(paths.scripts.combine.admin)
		.pipe(plumber())
		.pipe(concat('libs.admin.js'))
		.pipe(uglify({ mangle: false }))
		.pipe(plumber.stop())
		.pipe(gulp.dest("./assets/js")),

		gulp.src(paths.scripts.combine.client)
		.pipe(plumber())
		.pipe(concat('libs.client.js'))
		.pipe(uglify({ mangle: false }))
		.pipe(plumber.stop())
		.pipe(gulp.dest("./assets/js"))

	);
});

/**
 * TASK - Combine, make compatible and compress js app scripts
 */
gulp.task("scripts-app", function () {
	return gulp.src(paths.scripts.compile)
		.pipe(plumber())
		.pipe(include({ extensions: "js" }))
		.pipe(babel())
		.pipe(uglify())
		.pipe(plumber.stop())
		.pipe(gulp.dest("./assets/js"));
});

/**
 * TASK - Process all css processes
 */
gulp.task("css", ['css-libs', 'css-app']);

/**
 * TASK - Combine css libraries
 */
gulp.task("css-libs", function () {
	return gulp.src(paths.css.combine)
	.pipe(plumber())
	.pipe(concat('libs.css'))
	.pipe(cleanCSS({ keepSpecialComments: 0 }))
	.pipe(plumber.stop())
	.pipe(gulp.dest("./assets/css"));
});

/**
 * TASK - Compile app css
 */
gulp.task("css-app", function () {
	return gulp.src(paths.css.compile)
	.pipe(plumber())
	.pipe(sass.sync({ includePaths: paths.css.includes }))
	.pipe(cleanCSS({ keepSpecialComments: 0 }))
	.pipe(plumber.stop())
	.pipe(gulp.dest("./assets/css"));
});

/**
 * TASK - Copy web fonts
 */
gulp.task("fonts", function () {
	return gulp.src(paths.fonts)
	.pipe(gulp.dest("./assets/fonts"));
});

/**
 * TASK - Start dev watchers
 */
gulp.task('watch', function() {
	gulp.watch([paths.scripts.watch], ['scripts-app']);
	gulp.watch([paths.css.watch], ['css-app']);
});

/**
 * TASK - Starts development server with watchers
 */
gulp.task('default', ['watch', 'server']);

/**
 * TASK - Creates deployment packages
 */
gulp.task('deploy', ['scripts', 'css', 'fonts'], function() {
	var zipStream = gulp.src(paths.deploy)
		.pipe(zip('opsstatus.zip'))
		.pipe(gulp.dest('dist'));

	var targzStream = gulp.src(paths.deploy)
		.pipe(tar('opsstatus.tar'))
		.pipe(gzip())
		.pipe(gulp.dest('dist'));

	return merge(zipStream, targzStream);
});
