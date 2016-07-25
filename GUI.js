/**
 * Created by riggs on 1/16/16.
 */
"use strict";


import {kurento} from "./kurento";
// import * as DI from "./DI.js";
// import * as device from "./device.js";


export let UI = {
  interface_webview: null,
  exercise_name: null,
  start_button: null,
  end_button: null,
  close_button: null,
};


export function disable(button) {
  button.disabled = true;
}


export function enable(button) {
  button.disabled = false;
}


export function Error_Window(message, callbacks) {

  let this_window = chrome.app.window.current();

  disable(UI.start_button);
  enable(UI.close_button);

  chrome.app.window.create(
    'error.html',
    {
      id: "error" + message,
      'outerBounds': {'width': 320, 'height': 160}
    },
    created_window => {
      created_window.contentWindow.error_message = message;
      created_window.contentWindow.retry = callbacks.retry;
      created_window.contentWindow.ignore = callbacks.ignore;
      created_window.contentWindow.exit = callbacks.exit;
      created_window.contentWindow.parent_window = this_window;
      this_window.onClosed.addListener(() => {
        created_window.close();
      });
    }
  );
}


export default (session_data) => {

  for (let ID in UI) {
    let element = document.getElementById(ID);
    if (!element) {
      throw "Missing UI element: " + ID;
    }
    UI[ID] = element;
  }
  UI.exercise_name.innerHTML = "<h2>" + session_data.course + " " + session_data.exercise + "</h2>";

  kurento.create_window(UI);

  let location = document.createElement("a");
  UI.interface_webview.src = location.href = session_data.interface;
  UI.webview_origin = location.origin;

}
