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
            'outerBounds': {'width': 640, 'height': 768}
        },
        kurento_wrapper => {
            kurento_wrapper.contentWindow.addEventListener('load', () => {
                console.log("created wrapper: " + Date.now());
                var webview =  kurento_wrapper.contentWindow.document.getElementById("webview");

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

                    chrome.app.window.current().onClosed.addListener(() => {
                        webview_window.postMessage({name: "stop_recording"}, DI.app_targetOrigin);
                        setTimeout(() => { kurento_wrapper.close(); }, 500);
                    });

                    API.set_URIs = function (URIs) {
                        webview_window.postMessage({name: "file_uri", value: URIs.file_uri}, DI.app_targetOrigin);
                        webview_window.postMessage({name: "ws_uri", value: URIs.ws_uri}, DI.app_targetOrigin);
                    };
                });
            });
        }
    )
};
