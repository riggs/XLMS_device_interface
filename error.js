/**
 * Created by riggs on 1/16/16.
 */
"use strict";


window.addEventListener('load', () => {

  [
    [retry, "retry_button"],
    [ignore, "ignore_button"],
    [exit, "exit_button"]
  ].forEach(([func, button_name]) => {
    if (typeof(func) == "function") {

      console.log(func, button_name);

      let button = document.getElementById(button_name);

      button.disabled = false;
      button.addEventListener('click', () => {
        func.call(parent_window);
        close();
      });
    }

  });

  document.getElementById("error_message").innerHTML = error_message;

});
