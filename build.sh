#!/usr/bin/env bash

browserify --debug interface_wrapper.js -o build/interface_wrapper.js
browserify --debug kurento_wrapper.js -o build/kurento_wrapper.js
browserify --debug kurento_webview.js -o build/kurento_webview.js
