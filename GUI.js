/**
 * Created by riggs on 1/16/16.
 */
"use strict";


var kurento = require("./kurento.js");
var DI = require("./DI.js");


var API = module.exports = {};


var UI = API.UI = {
    interface_webview: null,
    exercise_name: null,
    start_button: null,
    end_button: null,
    close_button: null,
};


API.disable = function (button) {
    button.disabled = true;
};


API.enable = function (button) {
    button.disabled = false;
};


API.Error_Window = function (message, callback) {

    var this_window = chrome.app.window.current();

    API.disable(UI.start_button);
    API.enable(UI.close_button);

    chrome.app.window.create(
        'error.html',
        {
            id: "error",
            'outerBounds': {'width': 320, 'height': 160}
        },
        created_window => {
            created_window.contentWindow.error_message = message;
            created_window.contentWindow.ignore_error = callback;
            created_window.contentWindow.main_window = this_window;
            this_window.onClosed.addListener(() => { created_window.close(); });
        }
    );
};


API.init = function (session_data) {

    for (var ID in UI) {
        var element = document.getElementById(ID);
        if (!element) {
            throw "Missing UI element: " + ID;
        }
        UI[ID] = element;
    }
    UI.exercise_name.innerHTML = "<h2>" + session_data.course + " " + session_data.exercise + "</h2>";

    kurento.create_window(UI);

    UI.interface_webview.src = session_data.interface;

    UI.interface_webview.addEventListener('loadstop', () => {
        var webview_window = UI.interface_webview.contentWindow;

        window.addEventListener('message', message => {
            if (message.source === webview_window && message.data.name === "ready") {
                API.enable(UI.start_button);
            }
        });

        console.log(Date.now() + "sending session data to webview");
        webview_window.postMessage({name: "session", value: session_data}, DI.app_targetOrigin);

        UI.start_button.addEventListener('click', () => {
            webview_window.postMessage({name: "start_exercise"}, DI.app_targetOrigin);
            API.enable(UI.end_button);
            API.disable(UI.start_button);
            // TODO: Include function to do other stuff.
        });

        UI.end_button.addEventListener('click', () => {
            webview_window.postMessage({name: "end_exercise"}, DI.app_targetOrigin);
            API.enable(UI.start_button);
            webview_window.postMessage(({name: "results_request"}));
            // TODO: Include function to do other stuff.
        });

        UI.close_button.addEventListener('click', () => {
            webview_window.postMessage({name: "end_exercise"}, DI.app_targetOrigin);
            close();
        })
    });

};
