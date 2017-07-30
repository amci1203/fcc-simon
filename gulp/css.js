const
    gulp         = require('gulp'),
    postCSS      = require('gulp-postcss'),

    preCSS       = require('precss'),
    autoprefixer = require('autoprefixer'),
    math         = require('postcss-calc');

gulp.task('css', function () {
    console.log('---> Filtering CSS file...');
    return gulp.src('./app/assets/styles.css')
        .pipe(postCSS([
            preCSS,
            math,
            autoprefixer
        ]))
        .on('error', function (err) {
            console.log('There seems to be an error with your CSS.');
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(gulp.dest('./app'));
})
