/**
 * Created by riggs on 1/16/16.
 */
"use strict";

var Rx = require("rx");
require("rx-dom");
var GUI = require("./GUI.js");
var kurento = require("./kurento.js");


var session = {
    kurento_URIs: {file_uri: "file_uri", ws_uri: "ws_uri"}
};


// Retrieve session data.
function get_session_data () {
    console.log("launch_url: " + launch_url);
    kurento.set_URIs(session.kurento_URIs);
}


function initialize() {
    GUI.init();
    get_session_data();
}


Rx.DOM.ready().subscribe(initialize);
