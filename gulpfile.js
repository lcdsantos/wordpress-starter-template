var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var tildeImporter = require('node-sass-tilde-importer');
var browserSync = require('browser-sync').create();
var webpack = require('webpack-stream');

var isProduction = !!$.util.env.production;
var prefixBrowserlist = ['last 2 versions', 'ie 8', 'ie 9', '> 1%'];

var paths = {
    svg: {
        src: 'src/img/svg/*.svg',
        dest: 'assets/img'
    },
    icons: {
        src: 'src/img/icons/*.svg',
        dest: 'assets/img'
    },
    images: {
        src: 'src/img/*.{jpg,png,gif}',
        dest: 'assets/img'
    },
    sass: {
        src: 'src/sass/style.scss',
        dest: 'assets/css'
    },
    js: {
        src: 'src/js/main.js',
        dest: 'assets/js'
    },
    rev: {
        dest: 'assets'
    }
};

/**
 * SVG
 */
gulp.task('svgmin', function() {
    return gulp
        .src(paths.svg.src)
        .pipe($.changed(paths.svg.dest))
        .pipe($.imagemin())
        .pipe(gulp.dest(paths.svg.dest));
});

/**
 * Icons
 */
gulp.task('svgicons', function() {
    var path = require('path');

    return gulp
        .src(paths.icons.src)
        .pipe(
            $.imagemin([
                $.imagemin.svgo(function(file) {
                    var prefix = path.basename(file.relative, path.extname(file.relative));
                    return {
                        plugins: [
                            {
                                removeAttrs: { attrs: 'fill' },
                                cleanupIDs: {
                                    prefix: prefix + '-',
                                    minify: true
                                }
                            }
                        ]
                    };
                })
            ])
        )
        .pipe($.svgstore())
        .pipe(gulp.dest(paths.icons.dest));
});

/**
 * Images
 */
gulp.task('images', function() {
    gulp
        .src(paths.images.src)
        .pipe($.changed(paths.images.dest))
        .pipe($.imagemin())
        .pipe(gulp.dest(paths.images.dest));
});

/**
 * Sass
 */
gulp.task('sass', function() {
    return gulp
        .src(paths.sass.src)
        .pipe(isProduction ? $.util.noop() : $.sourcemaps.init())
        .pipe(
            $.sass({
                importer: tildeImporter
            }).on('error', $.sass.logError)
        )
        .pipe(isProduction ? $.autoprefixer(prefixBrowserlist) : $.util.noop())
        .pipe(isProduction ? $.csso() : $.util.noop())
        .pipe(isProduction ? $.util.noop() : $.sourcemaps.write(''))
        .pipe(gulp.dest(paths.sass.dest))
        .pipe(browserSync.stream());
});

/**
 * JavaScript
 */
gulp.task('scripts', function() {
    var webpackConfig = require('./webpack.config.js')(isProduction ? 'production' : false);

    return gulp
        .src(paths.js.src)
        .pipe(
            webpack(webpackConfig, null, function(err, stats) {
                if (err) {
                    throw new $.util.PluginError('webpack', err);
                }

                $.util.log('[webpack]', stats.toString('minimal'));

                browserSync.reload(webpackConfig.output.filename);
            })
        )
        .pipe(gulp.dest(paths.js.dest));
});

/**
 * Clean assets
 */
gulp.task('clean-assets', function() {
    return gulp.src([paths.sass.dest, paths.js.dest, paths.rev.dest + '/rev-manifest.json'], { read: false }).pipe($.clean());
});

/**
 * Asset revision
 */
gulp.task('rev', ['clean-assets', 'sass', 'scripts'], function() {
    return gulp
        .src([paths.sass.dest + '/*.css', paths.js.dest + '/*.js'], { base: paths.rev.dest })
        .pipe($.rev())
        .pipe($.revDeleteOriginal())
        .pipe(gulp.dest(paths.rev.dest))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(paths.rev.dest));
});

/**
 * Live preview
 */
gulp.task('serve', function() {
    browserSync.init({
        open: false,
        ghostMode: false,
        online: false,
        notify: false,
        scrollRestoreTechnique: 'cookie',
        files: ['**/*.{php,html}', paths.images.dest + '/*.{jpg,png,svg,gif,webp,ico}'],
        proxy: 'wordpress.dev.com'
    });
});

/**
 * Watch files
 */
gulp.task('watch', ['serve'], function() {
    /* Styles */
    gulp.watch(['**/*.scss'], { cwd: 'src/sass' }, ['sass']);

    /* SVG */
    gulp.watch(['*.svg'], { cwd: 'src/img/icons' }, ['svgicons']);
    gulp.watch(['*.svg'], { cwd: 'src/img/svg' }, ['svgmin']);

    /* Images */
    gulp.watch(['*.jpg', '*.png', '*.gif'], { cwd: 'src/img' }, ['images']);
});

/**
 * Default tasks
 */
gulp.task('default', ['watch', 'clean-assets', 'sass', 'scripts', 'svgicons', 'svgmin', 'images'], function() {
    $.util.log($.util.colors.green('Watching for changes...'));
});

gulp.task('build', ['svgicons', 'svgmin', 'images', 'rev'], function() {
    $.util.log($.util.colors.green('Build is finished'));
});
