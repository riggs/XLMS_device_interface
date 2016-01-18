(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by riggs on 1/16/16.
 */
"use strict";

var DI = {

    app_targetOrigin: "*",     // TODO: Replace with actual app string once finalized.
    //app_targetOrigin: "chrome-extension://fpfmfigelfacjdeonglpnkgbilpbopdi",

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

    webview.addEventListener('contentload', () => {
        console.log("contentload in wrapper: " + Date.now());
        var postMessage = kurento.postMessage = webview.contentWindow.postMessage;
        function _postMessage (message, origin) {
            console.log(message);
            console.log(origin);
            postMessage(message, origin);
        }

        // Set up plumbing so webview gets messages when buttons clicked.
        UI.start_button.addEventListener('click', () => {
            _postMessage({name: "start_recording"}, DI.app_targetOrigin);
        });

        UI.end_button.addEventListener('click', () => {
            _postMessage({name: "stop_recording"}, DI.app_targetOrigin);
        });

        main_window.onClosed.addListener(() => {
            _postMessage({name: "stop_recording"}, DI.app_targetOrigin);
            setTimeout(() => chrome.app.window.current().close(), 1000);
        });

        kurento.set_URIs = function(URIs) {
            postMessage({name: "file_uri", value: URIs.file_uri}, DI.app_targetOrigin);
            postMessage({name: "ws_uri", value: URIs.ws_uri}, DI.app_targetOrigin);
        };
    });

});

},{"./DI.js":1,"./kurento.js":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL29wdC9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIkRJLmpzIiwia3VyZW50by5qcyIsImt1cmVudG9fd3JhcHBlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSByaWdncyBvbiAxLzE2LzE2LlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIERJID0ge1xuXG4gICAgYXBwX3RhcmdldE9yaWdpbjogXCIqXCIsICAgICAvLyBUT0RPOiBSZXBsYWNlIHdpdGggYWN0dWFsIGFwcCBzdHJpbmcgb25jZSBmaW5hbGl6ZWQuXG4gICAgLy9hcHBfdGFyZ2V0T3JpZ2luOiBcImNocm9tZS1leHRlbnNpb246Ly9mcGZtZmlnZWxmYWNqZGVvbmdscG5rZ2JpbHBib3BkaVwiLFxuXG4gICAgUkVTVF9xdWVyeV9wYXJhbWV0ZXI6IFwiZW5kcG9pbnRcIlxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERJO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHJpZ2dzIG9uIDEvMTYvMTYuXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5cbnZhciBBUEkgPSB7fTtcbm1vZHVsZS5leHBvcnRzID0gQVBJO1xuXG5cbkFQSS5zZXRfVVJJcyA9IGZ1bmN0aW9uKFVSSXMpIHtcbiAgICAvLyBEdW1teSBmdW5jdGlvbiB0byBnZXQgcmVwbGFjZWQgb25jZSB0aGUgd2VidmlldyBoYXMgcHJvcGVybHkgbG9hZGVkLlxuICAgIC8vIElmIGNhbGxlZCBwcmlvciB0byBiZWluZyByZXBsYWNlZCwgY2FsbCBhZ2FpbiB3aXRoIHRoZSBzYW1lIHBhcmFtZXRlcnMuXG4gICAgc2V0VGltZW91dCgoKSA9PiBBUEkuc2V0X1VSSXMoVVJJcyksIDApXG59O1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZV93aW5kb3cgKFVJKSB7XG4gICAgY29uc29sZS5sb2coXCJjcmVhdGluZyB3cmFwcGVyOiBcIiArIERhdGUubm93KCkpO1xuICAgIGNocm9tZS5hcHAud2luZG93LmNyZWF0ZShcbiAgICAgICAgJ2t1cmVudG9fd3JhcHBlci5odG1sJyxcbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6ICdrdXJlbnRvJyxcbiAgICAgICAgICAgICdvdXRlckJvdW5kcyc6IHsnd2lkdGgnOiA2NDAsICdoZWlnaHQnOiA3Njh9XG4gICAgICAgIH0sXG4gICAgICAgIGNyZWF0ZWRfd2luZG93ID0+IHtcbiAgICAgICAgICAgIEFQSS53cmFwcGVyID0gY3JlYXRlZF93aW5kb3cuY29udGVudFdpbmRvdztcbiAgICAgICAgICAgIEFQSS53cmFwcGVyLlVJID0gVUk7XG4gICAgICAgICAgICBBUEkud3JhcHBlci5tYWluX3dpbmRvdyA9IGNocm9tZS5hcHAud2luZG93LmN1cnJlbnQoKTtcbiAgICAgICAgfVxuICAgIClcbn1cbkFQSS5jcmVhdGVfd2luZG93ID0gY3JlYXRlX3dpbmRvdztcbiIsIi8qKlxuICogQ3JlYXRlZCBieSByaWdncyBvbiAxLzE4LzE2LlxuICovXG5cInVzZSBzdHJpY3RcIjtcblxuXG52YXIgREkgPSByZXF1aXJlKFwiLi9ESS5qc1wiKTtcbi8vdmFyIEdVSSA9IHJlcXVpcmUoXCIuL0dVSS5qc1wiKTtcbnZhciBrdXJlbnRvID0gcmVxdWlyZShcIi4va3VyZW50by5qc1wiKTtcblxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcImNyZWF0ZWQgd3JhcHBlcjogXCIgKyBEYXRlLm5vdygpKTtcbiAgICB2YXIgd2VidmlldyA9ICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndlYnZpZXdcIik7XG5cbiAgICB3ZWJ2aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ3Blcm1pc3Npb25yZXF1ZXN0JywgZXZlbnQgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XG4gICAgICAgIGlmIChldmVudC5wZXJtaXNzaW9uID09PSAnbWVkaWEnKSB7XG4gICAgICAgICAgICBldmVudC5yZXF1ZXN0LmFsbG93KCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHdlYnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignY29udGVudGxvYWQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY29udGVudGxvYWQgaW4gd3JhcHBlcjogXCIgKyBEYXRlLm5vdygpKTtcbiAgICAgICAgdmFyIHBvc3RNZXNzYWdlID0ga3VyZW50by5wb3N0TWVzc2FnZSA9IHdlYnZpZXcuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZTtcbiAgICAgICAgZnVuY3Rpb24gX3Bvc3RNZXNzYWdlIChtZXNzYWdlLCBvcmlnaW4pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgICAgICAgICAgY29uc29sZS5sb2cob3JpZ2luKTtcbiAgICAgICAgICAgIHBvc3RNZXNzYWdlKG1lc3NhZ2UsIG9yaWdpbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdXAgcGx1bWJpbmcgc28gd2VidmlldyBnZXRzIG1lc3NhZ2VzIHdoZW4gYnV0dG9ucyBjbGlja2VkLlxuICAgICAgICBVSS5zdGFydF9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBfcG9zdE1lc3NhZ2Uoe25hbWU6IFwic3RhcnRfcmVjb3JkaW5nXCJ9LCBESS5hcHBfdGFyZ2V0T3JpZ2luKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgVUkuZW5kX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIF9wb3N0TWVzc2FnZSh7bmFtZTogXCJzdG9wX3JlY29yZGluZ1wifSwgREkuYXBwX3RhcmdldE9yaWdpbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1haW5fd2luZG93Lm9uQ2xvc2VkLmFkZExpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgIF9wb3N0TWVzc2FnZSh7bmFtZTogXCJzdG9wX3JlY29yZGluZ1wifSwgREkuYXBwX3RhcmdldE9yaWdpbik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNocm9tZS5hcHAud2luZG93LmN1cnJlbnQoKS5jbG9zZSgpLCAxMDAwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAga3VyZW50by5zZXRfVVJJcyA9IGZ1bmN0aW9uKFVSSXMpIHtcbiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHtuYW1lOiBcImZpbGVfdXJpXCIsIHZhbHVlOiBVUklzLmZpbGVfdXJpfSwgREkuYXBwX3RhcmdldE9yaWdpbik7XG4gICAgICAgICAgICBwb3N0TWVzc2FnZSh7bmFtZTogXCJ3c191cmlcIiwgdmFsdWU6IFVSSXMud3NfdXJpfSwgREkuYXBwX3RhcmdldE9yaWdpbik7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbn0pO1xuIl19
