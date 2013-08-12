var Canvas = require('canvas');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

fs.readdir(path.resolve(__dirname, 'video'), function (err, files) {

    files.forEach(function (file_name) {
        var image_file = path.resolve(__dirname, 'video', file_name);
        console.log('image file_name: %s', image_file);

        if (/\.png/.test(file_name))
        fs.readFile(image_file, function (err, data) {
            if (err) throw err;

            var image = new Canvas.Image();
            image.src = data;

                var canvas = new Canvas(image.width, image.height);

                var ctx = canvas.getContext('2d');

                ctx.drawImage(image, 0, 0, image.width, image.height);

                ctx.fillStyle = 'rgba(0,51,204,0.65';

                ctx.fillRect(0, 0, image.width, image.height);

                var file = path.resolve(__dirname, 'video', 'save', file_name);

                var writeStream = fs.createWriteStream(file);

            canvas.pngStream().pipe(writeStream);
                console.log('written file %s', file);

        })

    })

});