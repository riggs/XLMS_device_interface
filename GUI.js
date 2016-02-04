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


API.Error_Window = function (message, retry_callback, ignore_callback, exit_callback) {

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
            created_window.contentWindow.retry = retry_callback;
            created_window.contentWindow.ignore = ignore_callback;
            created_window.contentWindow.exit = exit_callback;
            this_window.onClosed.addListener(() => { created_window.close(); });
        }
    );
};


function generate_message_handler (other_window) {
    let location = document.createElement("a");
    location.href = other_window.src;
    let other_window_origin = location.origin;
    return message => {
        switch (message.source) {
            case other_window:
                switch (message.data.name) {
                    case "ready":
                        API.enable(UI.start_button);
                        break;
                    case "error":
                        let error_types = {
                            retry: null,
                            ignore: null,
                            exit: null
                        };
                        message.data.types.forEach(type => {
                            if (error_types[type] === null) {
                                error_types[type] = () => {
                                    other_window.postMessage({
                                        name: "error_response",
                                        id: message.data.id,
                                        error_type: type
                                    }, other_window_origin);
                                }
                            }
                            API.Error_Window(
                                message.data.message,
                                error_types.retry,
                                error_types.ignore,
                                error_types.exit
                            );
                        });
                        break;
                }
                break;
            default:
                console.log("Unknown message:");
                console.log(window);
        }
    };
}


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

    let location = document.createElement("a");
    location.href = UI.interface_webview.src = session_data.interface;
    let webview_origin = location.origin;

    let message_handler = generate_message_handler(UI.interface_webview);

    UI.interface_webview.addEventListener('loadstop', () => {
        var webview_window = UI.interface_webview.contentWindow;

        window.addEventListener('message', message_handler);

        console.log(Date.now() + "sending session data to webview");
        webview_window.postMessage({name: "session", value: session_data}, webview_origin);    // FIXME: Figure out what to do about targetOrigin.

        UI.start_button.addEventListener('click', () => {
            webview_window.postMessage({name: "start_exercise"}, webview_origin);
            API.enable(UI.end_button);
            API.disable(UI.start_button);
            // TODO: Include function to do other stuff.
        });

        UI.end_button.addEventListener('click', () => {
            webview_window.postMessage({name: "end_exercise"}, webview_origin);
            API.enable(UI.start_button);
            webview_window.postMessage(({name: "results_request"}));
            // TODO: Include function to do other stuff.
        });

        UI.close_button.addEventListener('click', () => {
            webview_window.postMessage({name: "end_exercise"}, webview_origin);
            setTimeout(close, 500);
        })
    });

};
