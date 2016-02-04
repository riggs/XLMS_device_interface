/**
 * Created by riggs on 1/16/16.
 */
"use strict";

// Libraries.
var Rx = require("rx");
require("rx-dom");

// Local files.
let GUI = require("./GUI.js");
let XLMS = require("./XLMS.js");
let kurento = require("./kurento.js");


function set_URIs(URIs) {
    if (typeof kurento.set_URIs === "undefined") {
        setTimeout(() => set_URIs(URIs), 100);
        console.log("waiting");
    } else {
        kurento.set_URIs(URIs);
    }
}


function launch () {
    console.log("launch_url: " + launch_url);

    XLMS.get_session(launch_url)
        .then(session => {

            set_URIs(session.kurento_URIs);

            GUI.init(session);

            window.session = session;
        });
}


Rx.DOM.ready().subscribe(launch);


window.req = req => require(req);
