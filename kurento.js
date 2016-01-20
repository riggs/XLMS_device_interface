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
        }
    )
};
