/**
 * Created by riggs on 1/16/16.
 */
"use strict";


var DI = require("./DI.js");


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
        var webview_window = webview.contentWindow;

        // Set up plumbing so webview gets messages when buttons clicked.
        UI.start_button.addEventListener('click', () => {
            webview_window.postMessage({name: "start_recording"}, DI.app_targetOrigin);
        });

        UI.end_button.addEventListener('click', () => {
            webview_window.postMessage({name: "stop_recording"}, DI.app_targetOrigin);
        });

        main_window.onClosed.addListener(() => {
            webview_window.postMessage({name: "stop_recording"}, DI.app_targetOrigin);
            setTimeout(close, 500);
        });

        API.set_URIs = function (URIs) {
            webview_window.postMessage({name: "URIs", value: URIs}, DI.app_targetOrigin);
        };
    });
});
