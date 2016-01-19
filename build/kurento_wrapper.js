(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by riggs on 1/16/16.
 */
"use strict";

var DI = {

    //app_targetOrigin: "*",     // TODO: Replace with actual app string once finalized.
    app_targetOrigin: "chrome-extension://fpfmfigelfacjdeonglpnkgbilpbopdi",

    REST_query_parameter: "endpoint"

};

module.exports = DI;

},{}],2:[function(require,module,exports){
/**
 * Created by riggs on 1/16/16.
 */
"use strict";


var API = {};
module.exports = API;


API.set_URIs = function(URIs) {
    // Dummy function to get replaced once the webview has properly loaded.
    // If called prior to being replaced, call again with the same parameters.
    setTimeout(() => API.set_URIs(URIs), 0)
};


function create_window (UI) {
    console.log("creating wrapper: " + Date.now());
    chrome.app.window.create(
        'kurento_wrapper.html',
        {
            id: 'kurento',
            'outerBounds': {'width': 640, 'height': 768}
        },
        created_window => {
            API.wrapper = created_window.contentWindow;
            API.wrapper.UI = UI;
            API.wrapper.main_window = chrome.app.window.current();
        }
    )
}
API.create_window = create_window;

},{}],3:[function(require,module,exports){
/**
 * Created by riggs on 1/18/16.
 */
"use strict";


var DI = require("./DI.js");
//var GUI = require("./GUI.js");
var kurento = require("./kurento.js");


window.addEventListener('load', () => {
    console.log("created wrapper: " + Date.now());
    var webview =  document.getElementById("webview");

    webview.addEventListener('permissionrequest', event => {
        console.log(event);
        if (event.permission === 'media') {
            event.request.allow();
        }
    });

    webview.addEventListener('loadstop', () => {
        console.log("loadstop in webview: " + Date.now());
        var _webview = kurento.webview = webview.contentWindow;

        // Set up plumbing so webview gets messages when buttons clicked.
        UI.start_button.addEventListener('click', () => {
            _webview.postMessage({name: "start_recording"}, DI.app_targetOrigin);
        });

        UI.end_button.addEventListener('click', () => {
            _webview.postMessage({name: "stop_recording"}, DI.app_targetOrigin);
        });

        main_window.onClosed.addListener(() => {
            _webview.postMessage({name: "stop_recording"}, DI.app_targetOrigin);
            setTimeout(() => chrome.app.window.current().close(), 100);
        });

        kurento.set_URIs = function(URIs) {
            console.log(URIs);
            _webview.postMessage({name: "file_uri", value: URIs.file_uri}, DI.app_targetOrigin);
            _webview.postMessage({name: "ws_uri", value: URIs.ws_uri}, DI.app_targetOrigin);
        };
    });

});

},{"./DI.js":1,"./kurento.js":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL29wdC9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIkRJLmpzIiwia3VyZW50by5qcyIsImt1cmVudG9fd3JhcHBlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgcmlnZ3Mgb24gMS8xNi8xNi5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBESSA9IHtcblxuICAgIC8vYXBwX3RhcmdldE9yaWdpbjogXCIqXCIsICAgICAvLyBUT0RPOiBSZXBsYWNlIHdpdGggYWN0dWFsIGFwcCBzdHJpbmcgb25jZSBmaW5hbGl6ZWQuXG4gICAgYXBwX3RhcmdldE9yaWdpbjogXCJjaHJvbWUtZXh0ZW5zaW9uOi8vZnBmbWZpZ2VsZmFjamRlb25nbHBua2diaWxwYm9wZGlcIixcblxuICAgIFJFU1RfcXVlcnlfcGFyYW1ldGVyOiBcImVuZHBvaW50XCJcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBESTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSByaWdncyBvbiAxLzE2LzE2LlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxuXG52YXIgQVBJID0ge307XG5tb2R1bGUuZXhwb3J0cyA9IEFQSTtcblxuXG5BUEkuc2V0X1VSSXMgPSBmdW5jdGlvbihVUklzKSB7XG4gICAgLy8gRHVtbXkgZnVuY3Rpb24gdG8gZ2V0IHJlcGxhY2VkIG9uY2UgdGhlIHdlYnZpZXcgaGFzIHByb3Blcmx5IGxvYWRlZC5cbiAgICAvLyBJZiBjYWxsZWQgcHJpb3IgdG8gYmVpbmcgcmVwbGFjZWQsIGNhbGwgYWdhaW4gd2l0aCB0aGUgc2FtZSBwYXJhbWV0ZXJzLlxuICAgIHNldFRpbWVvdXQoKCkgPT4gQVBJLnNldF9VUklzKFVSSXMpLCAwKVxufTtcblxuXG5mdW5jdGlvbiBjcmVhdGVfd2luZG93IChVSSkge1xuICAgIGNvbnNvbGUubG9nKFwiY3JlYXRpbmcgd3JhcHBlcjogXCIgKyBEYXRlLm5vdygpKTtcbiAgICBjaHJvbWUuYXBwLndpbmRvdy5jcmVhdGUoXG4gICAgICAgICdrdXJlbnRvX3dyYXBwZXIuaHRtbCcsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAna3VyZW50bycsXG4gICAgICAgICAgICAnb3V0ZXJCb3VuZHMnOiB7J3dpZHRoJzogNjQwLCAnaGVpZ2h0JzogNzY4fVxuICAgICAgICB9LFxuICAgICAgICBjcmVhdGVkX3dpbmRvdyA9PiB7XG4gICAgICAgICAgICBBUEkud3JhcHBlciA9IGNyZWF0ZWRfd2luZG93LmNvbnRlbnRXaW5kb3c7XG4gICAgICAgICAgICBBUEkud3JhcHBlci5VSSA9IFVJO1xuICAgICAgICAgICAgQVBJLndyYXBwZXIubWFpbl93aW5kb3cgPSBjaHJvbWUuYXBwLndpbmRvdy5jdXJyZW50KCk7XG4gICAgICAgIH1cbiAgICApXG59XG5BUEkuY3JlYXRlX3dpbmRvdyA9IGNyZWF0ZV93aW5kb3c7XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgcmlnZ3Mgb24gMS8xOC8xNi5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cblxudmFyIERJID0gcmVxdWlyZShcIi4vREkuanNcIik7XG4vL3ZhciBHVUkgPSByZXF1aXJlKFwiLi9HVUkuanNcIik7XG52YXIga3VyZW50byA9IHJlcXVpcmUoXCIuL2t1cmVudG8uanNcIik7XG5cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJjcmVhdGVkIHdyYXBwZXI6IFwiICsgRGF0ZS5ub3coKSk7XG4gICAgdmFyIHdlYnZpZXcgPSAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3ZWJ2aWV3XCIpO1xuXG4gICAgd2Vidmlldy5hZGRFdmVudExpc3RlbmVyKCdwZXJtaXNzaW9ucmVxdWVzdCcsIGV2ZW50ID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQpO1xuICAgICAgICBpZiAoZXZlbnQucGVybWlzc2lvbiA9PT0gJ21lZGlhJykge1xuICAgICAgICAgICAgZXZlbnQucmVxdWVzdC5hbGxvdygpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB3ZWJ2aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRzdG9wJywgKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcImxvYWRzdG9wIGluIHdlYnZpZXc6IFwiICsgRGF0ZS5ub3coKSk7XG4gICAgICAgIHZhciBfd2VidmlldyA9IGt1cmVudG8ud2VidmlldyA9IHdlYnZpZXcuY29udGVudFdpbmRvdztcblxuICAgICAgICAvLyBTZXQgdXAgcGx1bWJpbmcgc28gd2VidmlldyBnZXRzIG1lc3NhZ2VzIHdoZW4gYnV0dG9ucyBjbGlja2VkLlxuICAgICAgICBVSS5zdGFydF9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBfd2Vidmlldy5wb3N0TWVzc2FnZSh7bmFtZTogXCJzdGFydF9yZWNvcmRpbmdcIn0sIERJLmFwcF90YXJnZXRPcmlnaW4pO1xuICAgICAgICB9KTtcblxuICAgICAgICBVSS5lbmRfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgX3dlYnZpZXcucG9zdE1lc3NhZ2Uoe25hbWU6IFwic3RvcF9yZWNvcmRpbmdcIn0sIERJLmFwcF90YXJnZXRPcmlnaW4pO1xuICAgICAgICB9KTtcblxuICAgICAgICBtYWluX3dpbmRvdy5vbkNsb3NlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICBfd2Vidmlldy5wb3N0TWVzc2FnZSh7bmFtZTogXCJzdG9wX3JlY29yZGluZ1wifSwgREkuYXBwX3RhcmdldE9yaWdpbik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNocm9tZS5hcHAud2luZG93LmN1cnJlbnQoKS5jbG9zZSgpLCAxMDApO1xuICAgICAgICB9KTtcblxuICAgICAgICBrdXJlbnRvLnNldF9VUklzID0gZnVuY3Rpb24oVVJJcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coVVJJcyk7XG4gICAgICAgICAgICBfd2Vidmlldy5wb3N0TWVzc2FnZSh7bmFtZTogXCJmaWxlX3VyaVwiLCB2YWx1ZTogVVJJcy5maWxlX3VyaX0sIERJLmFwcF90YXJnZXRPcmlnaW4pO1xuICAgICAgICAgICAgX3dlYnZpZXcucG9zdE1lc3NhZ2Uoe25hbWU6IFwid3NfdXJpXCIsIHZhbHVlOiBVUklzLndzX3VyaX0sIERJLmFwcF90YXJnZXRPcmlnaW4pO1xuICAgICAgICB9O1xuICAgIH0pO1xuXG59KTtcbiJdfQ==
