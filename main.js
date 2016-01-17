/**
 * Created by riggs on 1/16/16.
 */
"use strict";

var Rx = require("rx");
require("rx-dom");
var GUI = require("./GUI");




Rx.DOM.ready().subscribe(GUI.init());
