/**
 * Created by riggs on 1/16/16.
 */
"use strict";

var Rx = require("rx");
require("rx-dom");
var GUI = require("./GUI");


var session = {

};


// Retrieve session data.
function get_session_data () {
    console.log(lauch_url);
}


function initialize() {
    GUI.init();
    get_session_data();
}


Rx.DOM.ready().subscribe(initialize);
