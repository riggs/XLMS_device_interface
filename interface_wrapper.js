/**
 * Created by riggs on 1/16/16.
 */
"use strict";


import GUI, {UI, Error_Window, enable, disable} from "./GUI";
import {get_session, send_results} from "./XLMS";
import {kurento} from "./kurento";
import device, {set, send, receive} from "./device";


const EVENTS = {
  ready: 42,
  start: 0,
  victory: -1,
  failure: -2,
  smiley: 1,
  toilet: 2,
  skull: 3,
  dog: 4,
};


let POLLER_ID = null;


function set_URIs(URIs) {
  if (typeof kurento.set_URIs === "undefined") {
    setTimeout(() => set_URIs(URIs), 100);
    console.log("waiting");
  } else {
    kurento.set_URIs(URIs);
  }
}


function generate_webview_message_handler(other_window, other_window_origin) {
  return message => {
    console.log(message.data);
    switch (message.data.name) {
      case "ready":
        enable(UI.start_button);
        break;
      case "error":
        /* Error messages usage:

         window.addEventListener('message', message => {
         let wrapper_window = message.source;
         wrapper_window.postMessage({
         name: "error",
         id: opaque_ID_created_by_plugin_UI,
         message: "This is the error message that will be displayed to the user.",
         // Up to three options will be presented to the user: retry, ignore, exit
         // Indicate which are allowed for a given error by including them in the types array.
         types: ["retry", "ignore", "exit"]
         }, wrapper_window_origin);     // Chrome App's origin; see DI.js
         });
         */
        let error_types = {
          retry: null,
          ignore: null,
          exit: null
        };
        message.data.types.forEach(type => {
          if (error_types[type] === null) {
            error_types[type] = function () {
              other_window.postMessage({
                name: "error_response",
                id: message.data.id,
                error_type: type
              }, other_window_origin);
            }
          }
        });
        Error_Window(message.data.message, error_types);
        break;
      case "results":
        send_results(message.data.results);
        break;
      case "start_exercise":
        start_exercise();
        break;
      case "end_exercise":
        end_exercise();
        break;
      default:
        console.log("Unknown message:");
        console.log(message);
    }
  };
}


function webview_init(session) {
  let webview_window = UI.interface_webview.contentWindow;

  window.addEventListener('message', generate_webview_message_handler(webview_window, UI.webview_origin));

  console.log(Date.now() + ": sending session data to webview");
  webview_window.postMessage({name: "session", value: session}, UI.webview_origin);

  UI.start_button.addEventListener('click', () => {
    webview_window.postMessage({name: "start_exercise"}, UI.webview_origin);
    enable(UI.end_button);
    disable(UI.start_button);
  });

  UI.end_button.addEventListener('click', () => {
    webview_window.postMessage({name: "end_exercise"}, UI.webview_origin);
    enable(UI.start_button);
    webview_window.postMessage({name: "results_request"}, UI.webview_origin);
  });

  UI.close_button.addEventListener('click', () => {
    webview_window.postMessage({name: "end_exercise"}, UI.webview_origin);
    setTimeout(close, 500);
  });

  device(() => {
    send("timestamp", Date.now(), () => {
      send("timeout", Number(session.configuration.timeout), () => {

      })
    })
  });
}


function init(session) {

  window.session = session; // DEBUG

  GUI(session);

  set_URIs(session.kurento_URIs);

  UI.interface_webview.addEventListener('loadstop', webview_init(session));

}


function launch() {

  console.log("launch_url: " + launch_url);

  get_session(launch_url).then(init);

}


// window.addEventListener('load', launch);


let RUNNING = false;

function start_exercise() {
  enable(UI.end_button);
  disable(UI.start_button);
  RUNNING = true;
}


let webview_window = null;

function end_exercise() {
  if (RUNNING == false) {
    return;
  }
  clearTimeout(POLLER_ID);
  webview_window.postMessage({name: "results_request"}, UI.webview_origin);
}



window.addEventListener('load', () => {

  console.log("launch_url: " + launch_url);

  get_session(launch_url).then((session) => {

    console.log("got session data");
    window.session = session; // DEBUG
    // session.interface = "http://localhost/~riggs/operation_operation_operation/operation.html";

    GUI(session);

    set_URIs(session.kurento_URIs);

    UI.interface_webview.addEventListener('loadstop', () => {
      console.log("webview loaded");
      webview_window = UI.interface_webview.contentWindow;

      window.addEventListener('message', generate_webview_message_handler(webview_window, UI.webview_origin));

      webview_window.postMessage({name: "session", value: session}, UI.webview_origin);

      function run() {
        receive((name, value) => {
          webview_window.postMessage({name, value}, UI.webview_origin);
        });
        POLLER_ID = setTimeout(run, 0);
      }

      function callback(error_message) {
        if (typeof(error_message) === "string") {
          return Error_Window(error_message, {exit: () => {setTimeout(close, 500)}, retry: () => device(callback)});
        }
        run();
        set("timestamp", Date.now(), () => {
          set("timeout", Number(session.configuration.timeout), () => {

            UI.close_button.addEventListener('click', () => {
              webview_window.postMessage({name: "end_exercise"}, UI.webview_origin);
              send("events", Date.now(), EVENTS.failure);
              setTimeout(close, 500);
            });

            UI.end_button.addEventListener('click', () => {
              webview_window.postMessage({name: "end_exercise"}, UI.webview_origin);
              send("events", Date.now(), EVENTS.failure);
              end_exercise();
            });

            UI.start_button.addEventListener('click', () => {
              webview_window.postMessage({name: "start_exercise"}, UI.webview_origin);
              start_exercise();
              send("events", Date.now(), EVENTS.start);
            });
          });
        });
      }
      device(callback);
      console.log("Launched app");
    });
  });
});
