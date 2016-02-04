/**
 * Created by riggs on 1/16/16.
 */
"use strict";


window.addEventListener('load', () => {

    document.getElementById("close_button").addEventListener('click', () => {
        main_window.close();
        chrome.app.window.current().close();
    });

    document.getElementById("error_button").addEventListener('click', () => {
        if (ignore_error) {
            document.getElementById("error_button").disabled = false;
            ignore_error();
        }
    });

    document.getElementById("error_message").innerHTML = error_message;

});
