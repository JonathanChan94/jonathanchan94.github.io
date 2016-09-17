var gulp=require('gulp'),
    connect=require('gulp-connect'),
    livereload=require('gulp-livereload');
    
gulp.task('connect',function(){
    connect.server({
        root:'./',
        livereload:true
    });
});

gulp.task('html',function(){
    gulp.src('./index.html')
        .pipe(connect.reload());
})
gulp.task('css',function(){
    gulp.src('./css/style.css')
        .pipe(connect.reload());
});
// gulp.task('livereload',function(){
//     gulp.src(['css/style.css','index.html']) 
//         .pipe(watch())
//         .pipe(connect.reload());
// });

gulp.task('watch',function(){
    gulp.watch('./index.html',['html']);
    gulp.watch('./css/style.css',['css']); 
});

gulp.task('default',['connect','watch']);