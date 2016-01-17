/**
 * Created by riggs on 1/16/16.
 */
"use strict";


var DI = require("./DI");
var GUI = require("./GUI");


var API = {};


API.set_URIs = function(URIs) {
    // Dummy function to get replaced once the webview has properly loaded.
    // If called prior to being replaced, call again with the same parameters.
    setTimeout(() => API.set_URIs(URIs), 0)
};


function create_window () {
    var this_window = chrome.app.window.current();

    chrome.app.window.create(
        'kurento_wrapper.html',
        created_window => {
            var kurento_window = API.kurento_window = created_window.contentWindow;

            kurento_window.addEventListener('load', () => {
                var webview =  document.getElementById("webview");

                webview.addEventListener('permissionrequest', event => {
                    console.log(event);
                    if (event.permission === 'media') {
                        event.request.allow();
                    }
                });

                webview.addEventListener('contentload', () => {
                    var postMessage = webview.contentWindow.postMessage;

                    // Set up plumbing so webview gets messages when buttons clicked.
                    GUI.UI.start_button.addEventListener('click', () => {
                        postMessage({name: "start_recording"}, DI.app_targetOrigin);
                    });

                    GUI.UI.stop_button.addEventListener('click', () => {
                        postMessage({name: "stop_recording"}, DI.app_targetOrigin);
                    });

                    this_window.onClosed.addListener(() => {
                        postMessage({name: "stop_recording"}, DI.app_targetOrigin);
                        setTimeout(created_window.close, 100);
                    });

                    API.set_URIs = function(URIs) {
                        postMessage({name: "file_uri", value: URIs.file_uri}, DI.app_targetOrigin);
                        postMessage({name: "ws_uri", value: URIs.ws_uri}, DI.app_targetOrigin);
                    };
                });

            });
        }
    )
}
APi.create_window = create_window;


module.exports = API;
