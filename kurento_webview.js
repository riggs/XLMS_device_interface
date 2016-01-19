/**
 * Created by riggs on 1/16/16.
 */
"use strict";


window.addEventListener('load', () => {
    console.log(Date.now());
    window.addEventListener('message', message => {
        console.log(Date.now());
        console.log(message.data);
    });
});
