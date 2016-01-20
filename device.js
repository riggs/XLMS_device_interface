/**
 * Created by riggs on 1/19/16.
 */
"use strict";


var Rx = require("rx");


var DI = require("./DI.js");
var HID = require("./RxHID.js");
var utils = require("./utils.js");


var API = {};
module.exports = API;


API.connection_ID = null;


var report_type_masks = {
    // Bitmask: report type
    0x01: "input",
    0x02: "output",
    0x04: "get_feature",
    0x08: "set_feature"
};


function parse_admin_report (buffer) {

    var buffer_length = buffer.byteLength;
    var dataview = new DataView(buffer);

    var report_offset = 0;

    var report_schemas = {};

    while (report_offset < buffer_length) {

        var report_length = dataview.getUint8(0 + report_offset);

        var report_ID = dataview.getUint8(1 + report_offset);
        var schema = report_schemas[report_ID] || {};

        var report_types = dataview.getUint8(2 + report_offset);

        var parser_functions = [];

        for (var mask in report_type_masks) {
            if (mask & report_types) {
                schema[report_type_masks[mask]] = parser_functions;
            }
        }

        var report_name_length = dataview.getUint8(3 + report_offset);

        // FIXME: Build name string from UTF-8 bytes.
        var report_name = schema.name = '';

        var byte_offset = 5 + report_offset + report_name_length;

        while (byte_offset < report_offset + report_length) {

        }

        report_schemas[report_ID] = schema;
        // This must be the last statement of the while loop.
        report_offset += report_length;
    }

    return report_schemas;
}


function build_reports (connection_ID) {

    // TODO: Connect to device and retrieve serialization report.


}



API.init = function () {

    var connection = Rx.Observable.just({filters: []})
        .flatMap(filters => HID.getDevices(filters))
        .flatMap(devices_array => devices_array)
        .do(console.log)
        // TODO: UI to select from multiple devices.
        .first()
        .pluck('deviceId')
        .flatMap(device_ID => HID.connect(device_ID) )
        .pluck('connectionId')
        .do(connectionId => {
            API.connection_ID = connectionId;
        })
        .flatMap(connectionId => HID.receiveFeatureReport(
            connectionId,
            DI.admin_report_ID
        ))
        .do(utils.hex_parser)
        ;

};