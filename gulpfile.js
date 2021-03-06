var connect             = require('gulp-connect'),
    del                 = require('del'),
    gulp                = require('gulp');

require('./gulp/lint');
require('./gulp/sass');
require('./gulp/browserify');

gulp.task('clean', function () {
    return del(['./demo/build/*']);
});

gulp.task('clean-test', function () {
    return del(['./test/app/js/*']);
});

gulp.task('serve', function(done) {

    connect.server({
        port:8111,
        root: './demo/build',
        livereload: {
            port: 35111
        }
    });

    done();

});

gulp.task('fonts',  function(cb){
    gulp.src('./src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest('./demo/build/fonts/'));
    cb();
});

gulp.task('html', function(done){
    gulp.src('./demo/index.html')
        .pipe(gulp.dest('./demo/build/'))
        .pipe(connect.reload());
    done();
});

gulp.task('watch', gulp.series('watchify', function(cb) {
    gulp.watch(['./src/js/**/*.js', './src/js/**/*.jsx'], gulp.series('lint-dev'));
    gulp.watch(['./src/css/**/*.scss'], gulp.series('sass-dev'));
    gulp.watch('./demo/index.html', gulp.series('html'));
    cb();
}));

gulp.task('default', gulp.series('clean', 'lint-dev', gulp.parallel('sass-dev', 'html', 'fonts'), 'watch', 'serve', function(cb){
    cb();
}));