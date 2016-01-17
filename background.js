/**
 * Created by riggs on 1/16/16.
 */
"use strict";


chrome.app.runtime.onLaunched.addListener(launch_data => {
    if (!launch_data.url) {
        console.log("Error: Unknown session");
        chrome.app.window.create(
            'error.html',
            {
                id: "error",
                'outerBounds': {'width': 320, 'height': 160}
            },
            created_window => {
                created_window.contentWindow.error_message =
                    "Application must be launched via XLMS in order to function properly.";
            }
        );
    } else {
        var storage_items = {};
        storage_items[DI.launch_data_storage_key] = launch_data;
        chrome.storage.local.set(storage_items, () => {
            chrome.app.window.create('interface.html', {
                id: "interface",
                'outerBounds': {'width': 680, 'height': 480}
            });
        });
    }
});
