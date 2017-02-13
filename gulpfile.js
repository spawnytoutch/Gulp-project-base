var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    del = require('del'),
    runSequence = require('run-sequence'),
    handlebars = require('gulp-compile-handlebars'),
    rename = require('gulp-rename');

// demarrage server browserSync
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        }
    });
});

// gulp.task('compileHandlebars', function () {
//     var templateData = {
//         firstName: 'Kaanon'
//     },
//     options = {
//         ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false 
//         partials : {
//             footer : '<footer>the end</footer>'
//         },
//         batch : ['app/partials'],
//         helpers : {
//             capitals : function(str){
//                 return str.toUpperCase();
//             }
//         }
//     }
 
//     return gulp.src('app/index.html')
//         .pipe(handlebars(templateData, options))
//         .pipe(rename('index.html'))
//         .pipe(gulp.dest('app'));
// });

gulp.task('sass', function() {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass()) // convertir les Sass en CSS avec gulp-sass
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', function() {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    // Relance le navigateur quand l'HTML ou un fichier JS change
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('useref', function() {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        // met en cache les images passées dans imagemin
        .pipe(cache(imagemin({
          interlaced: true
        })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean', function() {
  return del.sync('dist').then(function(callback) {
    return cache.clearAll(callback);
  });
})

gulp.task('clean:dist', function() {
    return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    // 'compileHandlebars',
    'sass',
    ['useref', 'images', 'fonts'],
    callback
  )
});

gulp.task('default', function(callback) {
  runSequence(
    [
        // 'compileHandlebars',
        'sass',
        'browserSync',
        'watch'
    ],
    callback
  )
});