#!/usr/bin/env bash

browserify --debug interface.js -o build/interface.js
browserify --debug kurento_webview.js -o build/kurento_webview.js
