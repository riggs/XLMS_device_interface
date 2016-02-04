/**
 * Created by riggs on 1/16/16.
 */
"use strict";


window.addEventListener('load', () => {

    if (retry) {
        document.getElementById("retry_button").disabled = false;

        document.getElementById("retry_button").addEventListener('click', () => {
            retry();
        });
    }

    if (ignore) {
        document.getElementById("ignore_button").disabled = false;

        document.getElementById("ignore_button").addEventListener('click', () => {
            ignore();
        });
    }

    if (exit) {
        document.getElementById("exit_button").disabled = false;

        document.getElementById("exit_button").addEventListener('click', () => {
            exit();
        });
    }

    document.getElementById("error_message").innerHTML = error_message;

});
