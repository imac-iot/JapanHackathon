var child = require('child_process').exec;
var koa = require('koa');
var route = require('koa-route');
var serve = require('koa-static');

var process = {
    cap_picture:
        function *(filename){
            child('ffmpeg -f video4linux2 -i /dev/video0 -r 1 -t 1800 ./'+filename+'.png');
            return console.log('Successed');
        },
    video_cap:
        function *(filename){
            child('./video.sh '+filename);
            return console.log('Capture Modify');
        },
}
var app = koa();
app.use(serve(__dirname+'./'));
app.use(route.get('/pic/:filename', process.cap_picture));
app.use(route.get('/vid/:filename', process.video_cap));
app.listen(3000);
