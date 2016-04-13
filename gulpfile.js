//a builder or compiler, tasks run using package.json to define scripts, then npm run <scriptname>
var gulp = require('gulp');
var browserify = require('gulp-browserify');
//called by npm run browserify, if package.json contains scripts browserify
gulp.task('browserify', function() {
    return gulp.
    src('./public/js/index.js').
    pipe(browserify()).
    pipe(gulp.dest('./bin'));
});

gulp.task('watch', function() {
    gulp.watch(['./*.js'], ['browserify']);
});
