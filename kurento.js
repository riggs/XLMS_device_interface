/**
 * Created by riggs on 1/16/16.
 */
"use strict";


var DI = require("./DI");
var GUI = require("./GUI");


var API = {};


function create_window () {
    var this_window = chrome.app.window.current();

    chrome.app.window.create(
        'kurento_wrapper.html',
        created_window => {
            this_window.onClosed.addListener(() => { created_window.close(); });
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
                    for (var ID in GUI.UI) {
                        if (ID.endsWith("_button")) {
                            GUI.UI[ID].addEventListener('click', () => {
                                postMessage({name: ID}, DI.app_targetOrigin);
                            });
                        }
                    }

                    this_window.onClosed.addListener(() => postMessage({name: "close_button"}, DI.app_targetOrigin));

                    API.set_URIs = (URIs) => {
                        postMessage({name: "file_uri", value: URIs.file_uri}, DI.app_targetOrigin);
                        postMessage({name: "ws_uri", value: URIs.ws_uri}, DI.app_targetOrigin);
                    };
                });

            });
        }
    )
}
APi.create_window = create_window;


API.set_URIs = (URIs) => {
    // If called too early, call again until the correct function is called.
    setTimeout(() => API.set_URIs(URIs), 0)
};


module.exports = API;
