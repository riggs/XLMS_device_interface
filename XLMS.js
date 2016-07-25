/**
 * Created by riggs on 2/4/16.
 */
"use strict";


import * as URI from "urijs";
import {REST_query_parameter} from "./DI";


let session = {
  kurento_URIs: {file_uri: "file_uri", ws_uri: "ws_uri"},
  interface: "GUI_webview_placeholder.html"
};


export function get_session(launch_url) {

  session.endpoint = URI.parseQuery(URI.parse(launch_url).query)[REST_query_parameter];

  return fetch(session.endpoint)
    .then(response => response.json(),
      error => {
        if (error instanceof SyntaxError) {
          GUI.Error_Window("Invalid session data. Please click 'Start lesson' button again.")
        } else {
          console.log(error);
          throw error;
        }
      })
    .then(
      data => {
        session.rest_values = data;
        session.session_ID = data.id;
        session.metrics = data.metrics;
        session.configuration = data.configuration;
        session.hardware = data.hardware;
        session.kurento_URIs.file_uri = "file://" + data.kurento_video_directory + data.id + ".webm";
        session.kurento_URIs.ws_uri = "ws://" + data.kurento_url;
        session.course = data.course;
        session.exercise = data.exercise;
        session.interface = data.interface;

        return session;
      });
}


export function send_results(results) {
  fetch(session.endpoint, {
    method: 'put',
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify(results)
  })
    .then(response => response.json())
    .then(json => console.log(json));
}
