/**
 * Created by riggs on 1/16/16.
 */
"use strict";


var API = {};
module.exports = API;


API.set_URIs = function(URIs) {
    // Dummy function to get replaced once the webview has properly loaded.
    // If called prior to being replaced, call again with the same parameters.
    console.log("calling again: " + URIs);
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
