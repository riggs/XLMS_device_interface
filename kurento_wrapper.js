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
            setTimeout(() => chrome.app.window.current().close(), 100);
        });

        kurento.set_URIs = function(URIs) {
            postMessage({name: "file_uri", value: URIs.file_uri}, DI.app_targetOrigin);
            postMessage({name: "ws_uri", value: URIs.ws_uri}, DI.app_targetOrigin);
        };
    });

});
