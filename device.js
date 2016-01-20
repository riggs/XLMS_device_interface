/**
 * Created by riggs on 1/19/16.
 */
"use strict";


var DI = require("./DI.js");
var HID = require("./RxHID.js");


var API = {};
module.exports = API;


function parse_admin_report (buffer) {
    var dataview = new DataView(buffer);

    var report_length = dataview.getUint8(0);

    var report_ID = dataview.getUint8(1);
}


function build_reports (connection_ID) {

    var reports = {};

    // TODO: Connect to device and retrieve serialization report.



}



API.init = function () {

    // TODO: Get devices.



};