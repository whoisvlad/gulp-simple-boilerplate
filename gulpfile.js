const gulp = require('gulp')
const sass = require('gulp-sass')
const browsersync = require('browser-sync')
const plumber = require("gulp-plumber");
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');

sass.compiler = require('node-sass');

// Paths for tasks
const paths = {
	styles: {
		srcMain: 'src/scss/main.scss',
		srcAll: 'src/scss/**/*.scss',
		dest: 'public/styles/'
	},
	scripts: {
		srcAll: 'src/js/**/*.js',
		dest: 'public/scripts/'
	},
	assets: {
		publicAll: 'public/assets/**/*.*'
	},
	html: {
		publicAll: 'public/**/*.html'
	}
}

// Tasks
// BrowserSync
function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: "./public",
		},
		port: 5000,
		injectChanges: true,
		stream:true,
		notify: false
	});
	done();
}
// BrowserSync Reload
function browserSyncReload(done) {
	browsersync.reload();
	done();
}



// Styles
function stylesFunc() {
	return gulp
		.src(paths.styles.srcMain)
		.pipe(plumber())
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(autoprefixer({
			cascade: true
		}))
		// .pipe(cleanCSS({
		//     level: 2
		// }))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browsersync.stream())
}



// Scripts
function scriptsFunc() {
	return gulp
		.src(paths.scripts.srcAll)
		.pipe(plumber())
		.pipe(concat('main.bundle.js'))
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(gulp.dest(paths.scripts.dest))
}




// Watch
function watchFiles() {
	// styles
	gulp.watch(paths.styles.srcAll, stylesFunc)
	// scripts
	gulp.watch(paths.scripts.srcAll, gulp.series(scriptsFunc, browserSyncReload))
	// html
	gulp.watch(paths.html.publicAll, browserSyncReload)
	// assets
	gulp.watch(paths.assets.publicAll, browserSyncReload)
}


// Complex tasks
const build = gulp.parallel(stylesFunc, scriptsFunc)
const watch = gulp.parallel(stylesFunc, scriptsFunc, watchFiles, browserSync)

// Export tasks
exports.build = build
exports.default = watch