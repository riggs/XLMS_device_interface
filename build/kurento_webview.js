(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by riggs on 1/16/16.
 */
"use strict";


require("adapter");


var file_uri = null;
var ws_uri = null;
var stream = null;
var recording = false;
var video = null;


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
        var other_window = message.source;
        switch (message.data.name) {

            case "URIs":
                console.log(message.data.value);
                file_uri = message.data.value.file_uri;
                ws_uri = message.data.value.ws_uri;
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

},{"adapter":2}],2:[function(require,module,exports){
module.exports = function(){
    console.log('Adapter tools v1');
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL29wdC9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImt1cmVudG9fd2Vidmlldy5qcyIsIm5vZGVfbW9kdWxlcy9hZGFwdGVyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgcmlnZ3Mgb24gMS8xNi8xNi5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cblxucmVxdWlyZShcImFkYXB0ZXJcIik7XG5cblxudmFyIGZpbGVfdXJpID0gbnVsbDtcbnZhciB3c191cmkgPSBudWxsO1xudmFyIHN0cmVhbSA9IG51bGw7XG52YXIgcmVjb3JkaW5nID0gZmFsc2U7XG52YXIgdmlkZW8gPSBudWxsO1xuXG5cbmZ1bmN0aW9uIHN0YXJ0X3JlY29yZGluZygpIHtcbiAgICBjb25zb2xlLmxvZyhcInN0YXJ0X3JlY29yZGluZ1wiKTtcblxuICAgIC8vIFRPRE9cblxuICAgIHJlY29yZGluZyA9IHRydWU7XG59XG5cblxuZnVuY3Rpb24gc3RvcF9yZWNvcmRpbmcoKSB7XG4gICAgY29uc29sZS5sb2coXCJzdG9wX3JlY29yZGluZ1wiKTtcblxuICAgIC8vIFRPRE9cblxuICAgIHJlY29yZGluZyA9IGZhbHNlO1xufVxuXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKERhdGUubm93KCkpO1xuXG4gICAgdmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZpZGVvSW5wdXRcIik7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIG1lc3NhZ2UgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICAgICAgdmFyIG90aGVyX3dpbmRvdyA9IG1lc3NhZ2Uuc291cmNlO1xuICAgICAgICBzd2l0Y2ggKG1lc3NhZ2UuZGF0YS5uYW1lKSB7XG5cbiAgICAgICAgICAgIGNhc2UgXCJVUklzXCI6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZS5kYXRhLnZhbHVlKTtcbiAgICAgICAgICAgICAgICBmaWxlX3VyaSA9IG1lc3NhZ2UuZGF0YS52YWx1ZS5maWxlX3VyaTtcbiAgICAgICAgICAgICAgICB3c191cmkgPSBtZXNzYWdlLmRhdGEudmFsdWUud3NfdXJpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFwic3RhcnRfcmVjb3JkaW5nXCI6XG4gICAgICAgICAgICAgICAgaWYgKCFyZWNvcmRpbmcpIHtcblxuICAgICAgICAgICAgICAgICAgICBzdHJlYW0uZ2V0VHJhY2tzKCkuZm9yRWFjaCh0cmFjayA9PiB0cmFjay5zdG9wKCkpO1xuICAgICAgICAgICAgICAgICAgICB2aWRlby5zcmMgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0X3JlY29yZGluZygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBcInN0b3BfcmVjb3JkaW5nXCI6XG4gICAgICAgICAgICAgICAgaWYgKHJlY29yZGluZykge1xuXG4gICAgICAgICAgICAgICAgICAgIHN0b3BfcmVjb3JkaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFNob3cgY2FtZXJhIHdpdGhvdXQgcmVjb3JkaW5nIHNvIHN0dWRlbnQgY2FuIGFkanVzdCB2aWV3LlxuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHt2aWRlbzogdHJ1ZX0pXG4gICAgICAgIC50aGVuKG1lZGlhU3RyZWFtID0+IHtcbiAgICAgICAgICAgIHN0cmVhbSA9IG1lZGlhU3RyZWFtO1xuICAgICAgICAgICAgdmlkZW8uc3JjID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwobWVkaWFTdHJlYW0pO1xuICAgICAgICAgICAgdmlkZW8ub25sb2FkZWRtZXRhZGF0YSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgdmlkZW8ucGxheSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgfSk7XG5cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xuICAgIGNvbnNvbGUubG9nKCdBZGFwdGVyIHRvb2xzIHYxJyk7XG59Il19
