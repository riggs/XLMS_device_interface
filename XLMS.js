/**
 * Created by riggs on 2/4/16.
 */
"use strict";


let URI = require("urijs");
let DI = require("./DI.js");


var API = module.exports = {};


var session = {
    kurento_URIs: {file_uri: "file_uri", ws_uri: "ws_uri"},
    interface: "GUI_webview_placeholder.html"
};


API.get_session = function (launch_url) {

    session.endppoint = URI.parseQuery(URI.parse(launch_url).query)[DI.REST_query_parameter];

    return fetch(session.endppoint)
        .then(response => response.json(),
            error => {
                if (error instanceof SyntaxError) {
                    GUI.Error_Window("Invalid session data. Please click 'Start lesson' button again.")
                } else {
                    console.log(error);
                    throw error;
                }
            })
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

                return session;
            });
};


API.send_results = function (results) {
    fetch(session.endpoint, {
        method: 'put',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(results)
    })
        .then(response => response.json())
        .then(json => console.log(json));
};
