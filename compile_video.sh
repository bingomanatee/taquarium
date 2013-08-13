ffmpeg -r 24 -i "video/save/save.%02d.png" -c:v libx264 -crf 23 -pix_fmt yuv420p textures/video.mp4
ffmpeg -r 24 -i "video/save/save.%02d.png" -c:v mpeg4 -crf 23 -pix_fmt yuv420p textures/video2.mp4