/**
 * Created by riggs on 1/16/16.
 */
"use strict";


import "webrtc-adapter-test";


let file_uri = null;
let ws_uri = null;
let stream = null;
let recording = false;
let video = null;


function start_recording() {
    console.log("start_recording");

    // TODO

    recording = true;
}


function stop_recording() {
    console.log("stop_recording");

    // TODO

    recording = false;
}


window.addEventListener('load', () => {
    console.log(Date.now());

    video = document.getElementById("videoInput");

    window.addEventListener('message', message => {
        console.log(message);
        let other_window = message.source;
        switch (message.data.name) {

            case "URIs":
                console.log(message.data.value);
                file_uri = message.data.value.file_uri;
                ws_uri = message.data.value.ws_uri;

                window.file_uri = file_uri;
                window.ws_uri = ws_uri;

                break;

            case "start_recording":
                if (!recording) {

                    stream.getTracks().forEach(track => track.stop());
                    video.src = "";

                    start_recording();
                }
                break;

            case "stop_recording":
                if (recording) {

                    stop_recording();
                }
                break;

        }
    });

    // Show camera without recording so student can adjust view.
    navigator.mediaDevices.getUserMedia({video: true})
        .then(mediaStream => {
            stream = mediaStream;
            video.src = window.URL.createObjectURL(mediaStream);
            video.onloadedmetadata = function (e) {
                video.play();
            };
        })
        .catch(error => {
            console.log(error);
        });

});

