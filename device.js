/**
 * Created by riggs on 1/19/16.
 */
"use strict";


import {TextDecoder, TextEncoder} from "text-encoding";


import * as utils from "./utils";


let connection_id = null;

export let report_schemas = {};

const report_type_masks = [
  // Bitmasks for report types
  0x01, // input
  0x02, // output
  0x04, // get feature
  0x08  // set feature
];

const [INPUT_REPORT, OUTPUT_REPORT, GET_FEATURE, SET_FEATURE] = report_type_masks;


const MAX_UINT32 = Math.pow(2, 32);


function get_encoders_decoders(type, offset, length) {
  switch (type) {
    case 0b00:  // UTF-8
      // return [() => console.log("utf8_decode"), () => console.log("utf8_encode")];
      return [
        dataview => TextDecoder('utf8').decode(new Uint8Array(dataview.buffer, offset, length)),
        (dataview, value) => {
          (new Uint8Array(dataview.buffer, offset, length)).set(TextEncoder('utf8').encode(value));
        }
      ];
    case 0b01:  // Int
      switch (length) {
        case 1:
          // return [() => console.log("Int8_decode"), () => console.log("Int8_encode")];
          return [
            dataview => dataview.getInt8(offset),
            (dataview, value) => dataview.setInt8(offset, value)
          ];
        case 2:
          // return [() => console.log("Int16_decode"), () => console.log("Int16_encode")];
          return [
            dataview => dataview.getInt16(offset),
            (dataview, value) => dataview.setInt16(offset, value)
          ];
        case 4:
          // return [() => console.log("Int32_decode"), () => console.log("Int32_encode")];
          return [
            dataview => dataview.getInt32(offset),
            (dataview, value) => dataview.setInt32(offset, value)
          ];
        case 8:
          // No getInt64, so get two 32-bit ints & combine.
          // return [() => console.log("Int64_decode"), () => console.log("Int64_encode")];
          return [
            dataview => dataview.getInt32(offset) * MAX_UINT32 + dataview.getInt32(offset + 4),
            (dataview, value) => {
              dataview.setInt32(offset, Math.floor(value / MAX_UINT32));
              dataview.setInt32(offset + 4, value % MAX_UINT32);
            }
          ];
        default:
          // return [() => console.log("Unknown Int: hex_parser"), () => console.log("Unknown Int: hex_writer")];
          return [
            dataview => utils.hex_parser(dataview.buffer, offset, length),
            (dataview, value) => utils.hex_writer(dataview.buffer, offset, value)
          ];
      }
    case 0b10:  // UInt
      switch (length) {
        case 1:
          // return [() => console.log("Uint8_decode"), () => console.log("Uint8_encode")];
          return [
            dataview => dataview.getUint8(offset),
            (dataview, value) => dataview.setUint8(offset, value)
          ];
        case 2:
          // return [() => console.log("Uint16_decode"), () => console.log("Uint16_encode")];
          return [
            dataview => dataview.getUint16(offset),
            (dataview, value) => dataview.setUint16(offset, value)
          ];
        case 4:
          // return [() => console.log("Uint32_decode"), () => console.log("Uint32_encode")];
          return [
            dataview => dataview.getUint32(offset),
            (dataview, value) => dataview.setUint32(offset, value)
          ];
        case 8:
          // return [() => console.log("Uint64_decode"), () => console.log("Uint64_encode")];
          return [
            dataview => dataview.getUint32(offset) * MAX_UINT32 + dataview.getUint32(offset + 4),
            (dataview, value) => {
              dataview.setUint32(offset, Math.floor(value / MAX_UINT32));
              dataview.setUint32(offset + 4, value % MAX_UINT32);
            }
          ];
        default:
          // return [() => console.log("Unknown Uint: hex_parser"), () => console.log("Unknown Uint: hex_writer")];
          return [
            dataview => utils.hex_parser(dataview.buffer, offset, length),
            (dataview, value) => utils.hex_writer(dataview.buffer, offset, value)
          ];
      }
    case 0b11:  // Float
      switch (length) {
        case 4:
          // return [() => console.log("Float32_decode"), () => console.log("Float32_encode")];
          return [
            dataview => dataview.getFloat32(offset),
            (dataview, value) => dataview.setFloat32(offset, value)
          ];
        case 8:
          // return [() => console.log("Float64_decode"), () => console.log("Float64_encode")];
          return [
            dataview => dataview.getFloat64(offset),
            (dataview, value) => dataview.setFloat64(offset, value)
          ];
        default:
          // return [() => console.log("Unknown Float: hex_parser"), () => console.log("Unknown Float: hex_writer")];
          return [
            dataview => utils.hex_parser(dataview.buffer, offset, length),
            (dataview, value) => utils.hex_writer(dataview.buffer, offset, value)
          ];
      }
    default:
      // return [() => console.log("Unknown type: hex_parser"), () => console.log("Unknown type: hex_writer")];
      return [
        dataview => utils.hex_parser(dataview.buffer, offset, length),
        (dataview, value) => utils.hex_writer(dataview.buffer, offset, value)
      ];
  }
}


function build_decoder_function(functions) {
  return (buffer) => {
    let dataview = new DataView(buffer);
    return functions.map(func => func.call(null, dataview));
  }
}


function build_encoder_function(functions, byte_length) {
  let buffer = new ArrayBuffer(byte_length);
  let dataview = new DataView(buffer);
  return (...args) => {
    functions.forEach((func, index) => func.call(null, dataview, args[index]));
    return buffer;
  }
}


function parse_admin_report(buffer) {

  let dataview = new DataView(buffer);
  let buffer_length = dataview.byteLength;

  let report_offset = 0;

  // let report_schemas = {};

  while (report_offset < buffer_length) {

    let report_length = dataview.getUint8(report_offset);

    let report_id = dataview.getUint8(report_offset + 1);

    let report_types = dataview.getUint8(report_offset + 2);

    let report_name_length = dataview.getUint8(report_offset + 3);

    let schema_name = new TextDecoder('utf8').decode(
      new Uint8Array(dataview.buffer, report_offset + 4, report_name_length)
    );
    console.log("schema_name: ", schema_name);

    report_schemas[schema_name] = report_id;

    let schema = report_schemas[report_id] || {};

    let decoder_functions = [];
    let encoder_functions = [];

    let data_byte_offset = 0;    // Byte offset for data to be parsed.
    for (let i = 4 + report_offset + report_name_length; i < report_offset + report_length; ++i) {
      let byte = dataview.getUint8(i);
      let data_type = 0b11 & byte;
      let data_length = byte >> 2;

      let [decoder, encoder] = get_encoders_decoders(data_type, data_byte_offset, data_length);
      decoder_functions.push(decoder);
      encoder_functions.push(encoder);

      data_byte_offset += data_length;
    }
    // Now data_byte_offset has a value of the total byte length for the specified report.

    report_type_masks.forEach((mask) => {
      // Single & for bitwise and
      if (mask & report_types) {
        schema[mask] = {
          name: schema_name,
          decode: build_decoder_function(decoder_functions),
          encode: build_encoder_function(encoder_functions, data_byte_offset)
        };
      }
    });

    report_schemas[report_id] = schema;
    // This must be the last statement of the while loop.
    report_offset += report_length;
  }

  // return report_schemas;
}
window.report_schemas = report_schemas;


export default (cb) => {

  chrome.hid.getDevices({filters: []}, (devices) => {

    if (devices.length == 0) {
      return cb("Failed to detect any devices.");
    }

    let device_id = devices[0].deviceId;

    chrome.hid.connect(device_id, (connection) => {
      connection_id = connection.connectionId;

      // Admin report on ID 1
      chrome.hid.receiveFeatureReport(connection_id, 1, (data) => {
        console.log(utils.hex_parser(data));
        parse_admin_report(data.slice(1));
        cb.call();
      });
    });
  });
}


export function get(report_name, cb) {
  let report_id = report_schemas[report_name];
  let decode = report_schemas[report_id][GET_FEATURE].decode;
  return chrome.hid.receiveFeatureReport(connection_id, report_id, (data) => cb(decode(data)));
}


export function set(report_name, ...data) {
  // Pull off callback if passed in.
  let cb = (typeof(data[data.length - 1]) == 'function') ? data.pop() : () => {};
  let report_id = report_schemas[report_name];
  let encode = report_schemas[report_id][SET_FEATURE].encode;
  return chrome.hid.sendFeatureReport(connection_id, report_id, encode(data), cb);
}


export function send(report_name, ...data) {
  // Pull off callback if passed in.
  let cb = (typeof(data[data.length - 1]) == 'function') ? data.pop() : () => {};
  let report_id = report_schemas[report_name];
  let encode = report_schemas[report_id][OUTPUT_REPORT].encode;
  return chrome.hid.send(connection_id, report_id, encode(data), cb);
}


export function receive(cb) {
  return chrome.hid.receive(connection_id, (report_id, data) => {
    let {name, decode} = report_schemas[report_id][INPUT_REPORT];
    cb(name, decode(data))
  });
}
