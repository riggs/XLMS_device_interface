/**
 * Created by riggs on 1/16/16.
 */
"use strict";


export let kurento = {};

kurento.create_window = function (UI) {
  console.log("creating wrapper: " + Date.now());
  chrome.app.window.create(
    'kurento_wrapper.html',
    {
      id: 'kurento',
      'outerBounds': {'width': 640, 'height': 540}
    },
    wrapper => {
      wrapper.contentWindow.main_window = chrome.app.window.current();
      wrapper.contentWindow.UI = UI;
      wrapper.contentWindow.kurento = kurento;
    }
  )
};
