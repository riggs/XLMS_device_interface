/**
 * Created by riggs on 1/19/16.
 */
"use strict";


var Rx = require("rx");
var TextDecoder = require("text-encoding").TextDecoder;


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


function get_parser (type, offset, length) {
    switch (type) {
        case 0b00:  // UTF-8
            return dataview => TextDecoder('utf-8').decode(new Uint8Array(dataview.buffer, offset, length));
        case 0b01:  // Int
            switch (length) {
                case 1:
                    return dataview => dataview.getInt8(offset);
                case 2:
                    return dataview => dataview.getInt16(offset);
                case 4:
                    return dataview => dataview.getInt32(offset);
                case 8:
                    return dataview => dataview.getInt32(offset) << 32 + dataview.getInt32(offset + 4);
                default:
                    return dataview => utils.hex_parser(dataview.buffer, offset, length);
            }
        case 0b10:  // UInt
            switch (length) {
                case 1:
                    return dataview => dataview.getUint8(offset);
                case 2:
                    return dataview => dataview.getUint16(offset);
                case 4:
                    return dataview => dataview.getUint32(offset);
                case 8:
                    return dataview => dataview.getUint32(offset) << 32 + dataview.getUint32(offset + 4);
                default:
                    return dataview => utils.hex_parser(dataview.buffer, offset, length);
            }
        case 0b11:  // Float
            switch (length) {
                case 4:
                    return dataview => dataview.getFloat32(offset);
                case 8:
                    return dataview => dataview.getFloat64(offset);
                default:
                    return dataview => utils.hex_parser(dataview.buffer, offset, length);
            }
        default:
            return dataview => utils.hex_parser(dataview.buffer, offset, length);
   }
}


function parse_admin_report (dataview) {

    var buffer_length = dataview.byteLength;

    var report_offset = 0;

    var report_schemas = {};

    while (report_offset < buffer_length) {

        var report_length = dataview.getUint8(report_offset);

        var report_ID = dataview.getUint8(report_offset + 1);
        var schema = report_schemas[report_ID] || {};

        var report_types = dataview.getUint8(report_offset + 2);

        var report_name_length = dataview.getUint8(report_offset + 3);

        var schema_name = TextDecoder('utf-8').decode(
            new Uint8Array(dataview.buffer, report_offset + 4, report_name_length)
        );

        var parser_functions = [];

        for (var mask in report_type_masks) {
            if (mask & report_types) {
                schema[report_type_masks[mask]] = {name: schema_name, parsers: parser_functions};
            }
        }

        var data_byte_offset = 0;    // Byte offset for data to be parsed.
        for (var i = 4 + report_offset + report_name_length + 1; i < report_offset + report_length; ++i) {
            var byte = dataview.getUint8(i);
            var data_type = 0b11 & byte;
            var data_length = byte >> 2;

            parser_functions.push(get_parser(data_type, data_byte_offset, data_length));

            data_byte_offset += data_length;
        }

        report_schemas[report_ID] = schema;
        // This must be the last statement of the while loop.
        report_offset += report_length;
    }

    return report_schemas;
}


function build_reports (connection_ID) {

    // TODO: Connect to device and retrieve serialization report.

    // TODO: Create DataView of buffer from report and pass it to parse_admin_report.

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