/**
 * Created by riggs on 1/16/16.
 */
"use strict";


var API = {};


function hex_parser(buffer) {
    return Array.from(new Uint32Array(buffer))
        .map(function (i) {
            return Number.prototype.toString.call(i, 16).toUpperCase();
        })
        .toString();
}
API.hex_parser = hex_parser;


module.exports = API;
