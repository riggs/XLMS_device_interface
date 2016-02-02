/**
 * Created by riggs on 1/16/16.
 */
"use strict";

// Libraries.
var Rx = require("rx");
require("rx-dom");
let URI = require("urijs");

// Local files.
let DI = require("./DI.js");
let GUI = require("./GUI.js");
let kurento = require("./kurento.js");


var session = {
    kurento_URIs: {file_uri: "file_uri", ws_uri: "ws_uri"},
    interface: "GUI_webview_placeholder.html"
};


function set_URIs(URIs) {
    if (typeof kurento.set_URIs === "undefined") {
        setTimeout(() => set_URIs(URIs), 100);
        console.log("waiting");
    } else {
        kurento.set_URIs(URIs);
    }
}


function initialize() {
    console.log("launch_url: " + launch_url);

    fetch(URI.parseQuery(URI.parse(launch_url).query)[DI.REST_query_parameter])
        .then(response => response.json())

        .then(
            data => {
                session.rest_values = data;
                session.session_ID = data.id;
                session.metrics = data.metrics;
                session.configuration = data.configuration;
                session.hardware = data.hardware;
                session.kurento_URIs.file_uri = "file://" + data.kurento_video_directory + data.id + ".webm";
                session.kurento_URIs.ws_uri = "ws://" + data.kurento_url;
                session.course = data.course;
                session.exercise = data.exercise;
                session.interface = data.interface;

                set_URIs(session.kurento_URIs);

                GUI.init(session);
            },
            error => {
                if (error instanceof SyntaxError) {
                    GUI.Error_Window("Invalid session data. Please click 'Start lesson' button again.")
                } else {
                    console.log(error);
                    throw error;
                }
            }
        );
}

Rx.DOM.ready().subscribe(initialize);


window.req = req => require(req);
window.session = session;
