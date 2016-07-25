/**
 * Created by riggs on 1/16/16.
 */
"use strict";


import {app_targetOrigin} from "./DI";


window.addEventListener('load', () => {
  console.log("created wrapper: " + Date.now());
  let webview = document.getElementById("webview");

  webview.addEventListener('permissionrequest', event => {
    // console.log(event);
    if (event.permission === 'media') {
      event.request.allow();
    }
  });

  webview.addEventListener('loadstop', () => {
    console.log("loadstop in webview: " + Date.now());
    let webview_window = webview.contentWindow;

    console.log(window.UI);
    // Set up plumbing so webview gets messages when buttons clicked.
    window.UI.start_button.addEventListener('click', () => {
      webview_window.postMessage({name: "start_recording"}, app_targetOrigin);
    });

    window.UI.end_button.addEventListener('click', () => {
      webview_window.postMessage({name: "stop_recording"}, app_targetOrigin);
    });

    main_window.onClosed.addListener(() => {
      webview_window.postMessage({name: "stop_recording"}, app_targetOrigin);
      setTimeout(close, 500);
    });

    window.kurento.set_URIs = function (URIs) {
      webview_window.postMessage({name: "URIs", value: URIs}, app_targetOrigin);
    };
  });
});
