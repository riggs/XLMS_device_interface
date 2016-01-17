/**
 * Created by riggs on 1/16/16.
 */
"use strict";


window.addEventListener('load', () => {

    document.getElementById("close_button").addEventListener('click', () => {
        chrome.app.window.current().close();
    });

    document.getElementById("error_message").innerHTML = error_message;

});
