#!/bin/bash

if [-f $0]; then
    PID=$(pidof "ffmpeg -i /dev/video0 ./$0.avi")
    kill $PID
else
    ffmpeg -i /dev/video0 ./$0.avi
fi
