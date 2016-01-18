/**
 * Created by riggs on 1/16/16.
 */
"use strict";


var kurento = require("./kurento.js");


var API = {};
module.exports = API;


var UI = {
    start_button: null,
    end_button: null,
    close_button: null,
};
API.UI = UI;


function disable(button) {
    button.disabled = true;
}
API.disable = disable;


function enable(button) {
    button.disabled = false;
}
API.enable = enable;


function Error_Window (message) {

    var this_window = chrome.app.window.current();

    disable(UI.start_button);
    enable(UI.close_button);

    chrome.app.window.create(
        'error.html',
        {
            id: "error",
            'outerBounds': {'width': 320, 'height': 160}
        },
        created_window => {
            created_window.contentWindow.error_message = message;
            created_window.onClosed.addListener(() => { this_window.close(); });
            this_window.onClosed.addListener(() => { created_window.close(); });
        }
    );
}
API.Error_Window = Error_Window;


function init () {

    for (var ID in UI) {
        var element = document.getElementById(ID);
        if (!element) {
            throw "Missing UI element: " + ID;
        }
        UI[ID] = element;
    }

    kurento.create_window(UI);

}
API.init = init;
