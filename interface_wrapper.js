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

// Retrieve session data.
function get_session_data() {
    console.log("launch_url: " + launch_url);

    fetch(URI.parseQuery(URI.parse(launch_url).query)[DI.REST_query_parameter])
        .then(response => response.json())

        .then(
            data => {
                // FIXME: Do something with the data.
                console.log(data);
                session.rest_values = data;
                /*
                 session.session_ID = data.id;
                 var criteria = {};
                 data.config.forEach(obj => { criteria[obj.metric] = obj.threshold });
                 session.criteria = criteria;
                 UI.exercise_name.innerHTML = "<h2>" + data.course + " " + data.exercise + "</h2>";
                 for (var item in criteria) {
                 UI[item + "_criteria"].innerText = criteria[item];
                 }
                 */

                set_URIs(session.kurento_URIs);     // FIXME: Temporary test.
            },
            error => {
                if (error.name === "SyntaxError") {
                    GUI.Error_Window("Invalid session data. Please click 'Start lesson' button again.")
                } else {
                    throw error;
                }
            }
        );
}


function initialize() {
    get_session_data();

    GUI.init(session);

}


Rx.DOM.ready().subscribe(initialize);


window.req = req => require(req);
window.session = session;
