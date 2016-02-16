/**
 * Created by riggs on 1/19/16.
 */
"use strict";


var Rx = require("rx");
var TextDecoder = require("text-encoding").TextDecoder;
var TextEncoder = require("text-encoding").TextEncoder;


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


let MAX_INT32 = Math.pow(2, 32);


function get_encoders_decoders (type, offset, length) {
    switch (type) {
        case 0b00:  // UTF-8
            return [() => console.log("utf8_decode"), () => console.log("utf8_encode")];
            return [
                dataview => TextDecoder('utf8').decode(new Uint8Array(dataview.buffer, offset, length)),
                (dataview, value) => {
                    (new Uint8Array(dataview.buffer, offset, length)).set(TextEncoder('utf8').encode(value));
                }
            ];
        case 0b01:  // Int
            switch (length) {
                case 1:
                    return [() => console.log("Int8_decode"), () => console.log("Int8_encode")];
                    return [
                        dataview => dataview.getInt8(offset),
                        (dataview, value) => dataview.setInt8(offset, value)
                    ];
                case 2:
                    return [() => console.log("Int16_decode"), () => console.log("Int16_encode")];
                    return [
                        dataview => dataview.getInt16(offset),
                        (dataview, value) => dataview.setInt16(offset, value)
                    ];
                case 4:
                    return [() => console.log("Int32_decode"), () => console.log("Int32_encode")];
                    return [
                        dataview => dataview.getInt32(offset),
                        (dataview, value) => dataview.setInt32(offset, value)
                    ];
                case 8:
                    return [() => console.log("Int64_decode"), () => console.log("Int64_encode")];
                    return [
                        dataview => dataview.getInt32(offset) * MAX_INT32 + dataview.getInt32(offset + 4),
                        (dataview, value) => {
                            dataview.setInt32(offset, Math.floor(value / MAX_INT32));
                            dataview.setInt32(offset + 4, value % MAX_INT32);
                        }
                    ];
                default:
                    return [() => console.log("Unknown Int: hex_parser"), () => console.log("Unknown Int: hex_writer")];
                    return [
                        dataview => utils.hex_parser(dataview.buffer, offset, length),
                        (dataview, value) => utils.hex_writer(dataview.buffer, offset, value)
                    ];
            }
        case 0b10:  // UInt
            switch (length) {
                case 1:
                    return [() => console.log("Uint8_decode"), () => console.log("Uint8_encode")];
                    return [
                        dataview => dataview.getUint8(offset),
                        (dataview, value) => dataview.setUint8(offset, value)
                    ];
                case 2:
                    return [() => console.log("Uint16_decode"), () => console.log("Uint16_encode")];
                    return [
                        dataview => dataview.getUint16(offset),
                        (dataview, value) => dataview.setUint16(offset, value)
                    ];
                case 4:
                    return [() => console.log("Uint32_decode"), () => console.log("Uint32_encode")];
                    return [
                        dataview => dataview.getUint32(offset),
                        (dataview, value) => dataview.setUint32(offset, value)
                    ];
                case 8:
                    return [() => console.log("Uint64_decode"), () => console.log("Uint64_encode")];
                    return [
                        dataview => dataview.getUint32(offset) * MAX_INT32 + dataview.getUint32(offset + 4),
                        (dataview, value) => {
                            dataview.setUint32(offset, Math.floor(value / MAX_INT32));
                            dataview.setUint32(offset + 4, value % MAX_INT32);
                        }
                    ];
                default:
                    return [() => console.log("Unknown Uint: hex_parser"), () => console.log("Unknown Uint: hex_writer")];
                    return [
                        dataview => utils.hex_parser(dataview.buffer, offset, length),
                        (dataview, value) => utils.hex_writer(dataview.buffer, offset, value)
                    ];
            }
        case 0b11:  // Float
            switch (length) {
                case 4:
                    return [() => console.log("Float32_decode"), () => console.log("Float32_encode")];
                    return [
                        dataview => dataview.getFloat32(offset),
                        (dataview, value) => dataview.setFloat32(offset, value)
                    ];
                case 8:
                    return [() => console.log("Float64_decode"), () => console.log("Float64_encode")];
                    return [
                        dataview => dataview.getFloat64(offset),
                        (dataview, value) => dataview.setFloat64(offset, value)
                    ];
                default:
                    return [() => console.log("Unknown Float: hex_parser"), () => console.log("Unknown Float: hex_writer")];
                    return [
                        dataview => utils.hex_parser(dataview.buffer, offset, length),
                        (dataview, value) => utils.hex_writer(dataview.buffer, offset, value)
                    ];
            }
        default:
            return [() => console.log("Unknown type: hex_parser"), () => console.log("Unknown type: hex_writer")];
            return [
                dataview => utils.hex_parser(dataview.buffer, offset, length),
                (dataview, value) => utils.hex_writer(dataview.buffer, offset, value)
            ];
   }
}


function build_decoder_function (functions) => {
    return function (dataview) {
        return functions.forEach(func => func.call(null, dataview));
    }
}


function build_encoder_function (functions, byte_length) {
    return function (...args) {
        let buffer = new ArrayBuffer(byte_length);
        let dataview = new DataView(buffer);
        functions.forEach((func, index) => func.call(null, dataview, args[index]))
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

        var schema_name = TextDecoder('utf8').decode(
            new Uint8Array(dataview.buffer, report_offset + 4, report_name_length)
        );

        var decoder_functions = [];
        var encoder_functions = [];

        var data_byte_offset = 0;    // Byte offset for data to be parsed.
        for (var i = 4 + report_offset + report_name_length; i < report_offset + report_length; ++i) {
            var byte = dataview.getUint8(i);
            var data_type = 0b11 & byte;
            var data_length = byte >> 2;

            var [decoder, encoder] = get_encoders_decoders(data_type, data_byte_offset, data_length);
            decoder_functions.push(decoder);
            encoder_functions.push(encoder);

            data_byte_offset += data_length;
        }
        // Now data_byte_offset has a value of the total byte length for the specified report.

        for (var mask in report_type_masks) {
            if (mask & report_types) {
                schema[report_type_masks[mask]] = {
                    name: schema_name,
                    decode: build_decoder_function(decoder_functions),
                    encode: build_encoder_function(encoder_functions, data_byte_offset)
                };
            }
        }

        report_schemas[report_ID] = schema;
        // This must be the last statement of the while loop.
        report_offset += report_length;
    }

    return report_schemas;
}
window.parse_admin_report = parse_admin_report;


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