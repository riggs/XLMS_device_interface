/**
 * Created by riggs on 1/16/16.
 */
"use strict";


export function hex_parser(buffer, byteOffset, length) {
  return Array.from(new Uint8Array(buffer, byteOffset, length))
    .map(i => Number.prototype.toString.call(i, 16).toUpperCase())
    .toString();
}


export function hex_writer(buffer, byteOffset, values) {
  (new Uint8Array(buffer, byteOffset)).set(values);
}
