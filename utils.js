/**
 * Created by riggs on 1/16/16.
 */
"use strict";


var API = {};
module.exports = API;


API.hex_parser = function (buffer) {
    return Array.from(new Uint32Array(buffer))
        .map(function (i) {
            return Number.prototype.toString.call(i, 16).toUpperCase();
        })
        .toString();
};

