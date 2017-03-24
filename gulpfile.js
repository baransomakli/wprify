var concat, gulp, gutil, sass, uglify, imagemin, minifyCSS,
    browserSync, autoprefixer, gulpSequence, shell, sourceMaps, plumber, cleanCSS, uncss, staticHash, version;
var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

gulp = require('gulp');
gutil = require('gulp-util');
concat = require('gulp-concat');
uglify = require('gulp-uglify');
sass = require('gulp-sass');
sourceMaps = require('gulp-sourcemaps');
imagemin = require('gulp-imagemin');
minifyCSS = require('gulp-minify-css');
browserSync = require('browser-sync');
autoprefixer = require('gulp-autoprefixer');
gulpSequence = require('gulp-sequence').use(gulp);
shell = require('gulp-shell');
plumber = require('gulp-plumber');
cleanCSS = require('gulp-clean-css');
uncss = require('gulp-uncss');
staticHash = require('gulp-static-hash');
version = require('gulp-version-number');



var config = require('./src/_wprify/config.json');
if (!config.installed) {
    console.log("\n");
    console.log("Config File Error");
    console.log("Please run : npm run setup");
    console.log("\n");
    return;
}

var wordpressUrl = config.wpUrl;

var cssFiles = [
    'src/css/inc/bootstrap.min.css',
    'src/css/inc/font-awesome.min.css',
    'src/css/style.css',
    'src/css/custom.css'
];

var versionConfig = {
    "value": "%MD5%",
    "append": {
        "key": "_vh",
        "to": ["css", "js"]
    }
};

gulp.task('browserSync', function () {
    browserSync.init({
        proxy: wordpressUrl,
        notify: true
    });

});

gulp.task('images', function (tmp) {
    gulp.src(['src/images/*.jpg', 'src/images/*.png'])
        .pipe(plumber())
        .pipe(imagemin({optimizationLevel: 5, progressive: true, interlaced: true}))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('css', function () {
    return gulp.src(cssFiles)
        .pipe(plumber())
        .pipe(concat('build.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('css-deploy', function () {
    return gulp.src(cssFiles)
        .pipe(plumber())
        .pipe(concat('build.css'))
        .pipe(autoprefixer({
            browsers: autoPrefixBrowserList,
            cascade: true
        }))
        .pipe(uncss({
            html: ['src/*.html']
        }))
        .pipe(minifyCSS())
        .pipe(cleanCSS({
            compatibility: 'ie8', level: {
                1: {
                    specialComments: 0
                }
            }
        }))
        .pipe(gulp.dest('desc/css'));
});

gulp.task('scripts', function () {
    return gulp.src(['src/js/custom.js', 'src/js/src/**/*.js'])
        .pipe(plumber())
        .pipe(concat('build.js'))
        .on('error', gutil.log)
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('scripts-deploy', function () {
    return gulp.src(['src/js/custom.js', 'src/js/src/**/*.js'])
        .pipe(plumber())
        .pipe(concat('build.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('sass', function () {
    return gulp.src('src/sass/style.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass({
            errLogToConsole: true,
            includePaths: [
                'src/sass'
            ]
        }))
        .pipe(autoprefixer({
            browsers: autoPrefixBrowserList,
            cascade: true
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
});

gulp.task('twig', function () {
    return gulp.src('templates/*.html')
        .pipe(plumber())
        .pipe(browserSync.stream())
        .on('error', gutil.log);
});

gulp.task('clean', function () {
    return shell.task([
        'rm -rf dist',
        'touch .gitkeep'
    ]);
});

gulp.task('default', ['browserSync', 'scripts', 'sass', 'css'], function () {
    gulp.watch('src/js/**', ['scripts']).on('change', browserSync.reload);
    gulp.watch('src/css/**', ['css']).on('change', browserSync.reload);
    gulp.watch('src/sass/**', ['sass']).on('change', browserSync.reload);
    gulp.watch('src/images/**', ['images']).on('change', browserSync.reload);
    gulp.watch('templates/*.twig', ['twig']).on('change', browserSync.reload);
});
