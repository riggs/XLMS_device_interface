#!/usr/bin/env bash

browserify --debug interface.js -o build/interface.js
browserify --debug kurento_wrapper.js -o build/kurento_wrapper.js
browserify --debug kurento_webview.js -o build/kurento_webview.js
