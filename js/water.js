$(function () {

    var video = document.getElementById("video");
    var water = $('#water');
    var water_canvas = water.find('canvas')[0];
    water_canvas.width = Math.floor(water.width());
    water_canvas.height = Math.floor(water.height());

    var direct_canvas = $('body').find('#water_direct')[0];

    var dc_ctx = direct_canvas.getContext('2d');

    var video_height,
        video_width,
        half_vw,
        half_vh;

    var highlights = [];

    var vi;

    function timerCallback() {
        if (video.paused || video.ended) {
            clearInterval(vi);
            return;
        }

        dc_ctx.drawImage(video, 0, 0, half_vw, half_vh);

        var img

        stage.update();
    }

   var stage = new createjs.Stage(water_canvas);

    video.addEventListener("play", function () {
        video_width = video.videoWidth;
        video_height = video.videoHeight;
        half_vw = Math.floor(video_width/2);
        half_vh = Math.floor(video_height/2);

        var scale = Math.min(water_canvas.width / video_width, water_canvas.height / video_height);

        console.log('scale: ', scale);

        direct_canvas.width = video_width;
        direct_canvas.height = video_height;

        var SCALE = 3;


        _.each( _.range(0, 8), function (i) {
            var x_off = i % 2 * SCALE;
            var y_off = Math.floor(i / 2) * SCALE;

            console.log(x_off, y_off);

            var video_bitmap = new createjs.Bitmap(video);

            video_bitmap.regX = video_bitmap.regY = 0;
            video_bitmap.alpha = 0.25;
            video_bitmap.scaleX = video_bitmap.scaleY = scale;
            video_bitmap.x = x_off;
            video_bitmap.y = y_off;

            stage.addChild(video_bitmap);

       var video_offset_bitmap = new createjs.Bitmap(video);

            video_offset_bitmap.regX = video_offset_bitmap.regY = 0;
            video_offset_bitmap.alpha = 0.25;
            video_offset_bitmap.scaleX = video_offset_bitmap.scaleY = scale;
            video_offset_bitmap.x = x_off + (video_width * scale);
            video_offset_bitmap.y = y_off;

            stage.addChild(video_offset_bitmap);

        });

        vi = setInterval(timerCallback, 100)

    }, false);
});