var gulp = require('gulp');
var clean = require('gulp-clean');
var autoReload = require('gulp-auto-reload');
var gutil = require('gulp-util');

var browserify = require('gulp-browserify');

// this transformer is used to inject <script>
// tags into the html when reloader is enabled
var htmlInject = function() {
  return gutil.noop();
};

// Basic usage
gulp.task('scripts', function() {
    gulp.src('src/js/app.js')
        .pipe(browserify())
        .pipe(gulp.dest('www/js'))
});

gulp.task('framer', ['framer-js', 'framer-images']);

gulp.task('framer-js', function() {
  gulp.src('src/vendor/framer.js')
    .pipe(gulp.dest('www/js'))
});

gulp.task('framer-images', function() {
  gulp.src('src/vendor/images/**/*')
    .pipe(gulp.dest('www/images'))
});

gulp.task('fonts', ['font-awesome-css', 'font-awesome-fonts']);

gulp.task('font-awesome-fonts', function() {
    gulp.src('node_modules/font-awesome/**/*')
        .pipe(gulp.dest('www/fonts'))
});

gulp.task('font-awesome-css', function() {
  gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest('www/css'))
})

gulp.task('html' , function(){
    gulp.src('src/index.html')
        .pipe(htmlInject())      // inject <script>
        .pipe(gulp.dest('www'))
});

gulp.task('watch', ['watch-src', 'reloader'])

gulp.task('watch-src', function () {
    gulp.watch('src/js/**/*.js', ['scripts', 'html']);
    gulp.watch('src/html/index.html', ['html']);
});

gulp.task('reloader', function() {
  // start a server for reloading
  var reloader = autoReload();
  // copy the auto-reload.js script to
  // the output
  reloader.script()
    .pipe(gulp.dest('www'));
  // inject the script into html pages
  htmlInject = reloader.inject;
  // start watching the output for changes
  gulp.watch("www/**/*", reloader.onChange);
});

gulp.task('clean', function () {
	return gulp.src('www', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('default' , ['framer', 'scripts', 'fonts', 'html', 'watch']);
