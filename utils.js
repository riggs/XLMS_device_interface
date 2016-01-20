/**
 * Created by riggs on 1/16/16.
 */
"use strict";


var API = {};
module.exports = API;


API.hex_parser = function (buffer, byteOffset, length) {
    return Array.from(new Uint8Array(buffer, byteOffset, length))
        .map(i => Number.prototype.toString.call(i, 16).toUpperCase())
        .toString();
};

