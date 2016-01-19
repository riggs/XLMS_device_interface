/**
 * Created by riggs on 1/16/16.
 */
"use strict";


var DI = require("./DI.js");


var API = {};
module.exports = API;


API.create_window = function (UI) {
    console.log("creating wrapper: " + Date.now());
    chrome.app.window.create(
        'kurento_wrapper.html',
        {
            id: 'kurento',
            'outerBounds': {'width': 640, 'height': 540}
        },
        wrapper => {
            wrapper.contentWindow.main_window = chrome.app.window.current();
            wrapper.contentWindow.UI = UI;
            wrapper.contentWindow.API = API;

            /*
             var wrapper_window = wrapper.contentWindow;
            wrapper_window.addEventListener('load', () => {
                console.log("created wrapper: " + Date.now());
                var webview =  wrapper_window.document.getElementById("webview");

                webview.addEventListener('permissionrequest', event => {
                    console.log(event);
                    if (event.permission === 'media') {
                        event.request.allow();
                    }
                });

                webview.addEventListener('loadstop', () => {
                    console.log("loadstop in webview: " + Date.now());
                    var webview_window = webview.contentWindow;

                    // Set up plumbing so webview gets messages when buttons clicked.
                    UI.start_button.addEventListener('click', () => {
                        webview_window.postMessage({name: "start_recording"}, DI.app_targetOrigin);
                    });

                    UI.end_button.addEventListener('click', () => {
                        webview_window.postMessage({name: "stop_recording"}, DI.app_targetOrigin);
                    });

                    wrapper_window.main_window = chrome.app.window.current();
                    wrapper_window.webview_window = webview_window;

                    API.set_URIs = function (URIs) {
                        webview_window.postMessage({name: "file_uri", value: URIs.file_uri}, DI.app_targetOrigin);
                        webview_window.postMessage({name: "ws_uri", value: URIs.ws_uri}, DI.app_targetOrigin);
                    };
                });
            });
            */
        }
    )
};
