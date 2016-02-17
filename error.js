/**
 * Created by riggs on 1/16/16.
 */
"use strict";


window.addEventListener('load', () => {

    [
        [retry, "retry_button"],
        [ignore, "ignore_button"],
        [exit, "exit_button"]
    ].forEach(([func, button]) => {
        if (func instanceof Function) {
            document.getElementById(button).disabled = false;

            document.getElementById(button).addEventListener('click', () => {
                func.call(parent_window);
                close();
            });
        }
    });

    document.getElementById("error_message").innerHTML = error_message;

});
