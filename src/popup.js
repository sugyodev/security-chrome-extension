(function () {
    'use strict';
    const inputArea = document.getElementById('edit-box');
    const resetBtn = document.getElementById('reset');
    inputArea.focus();
    inputArea.addEventListener('keyup', function onkeyup(event) {
        if (event.keyCode === 13) {
            chrome.runtime.sendMessage({
                event: 'addurl',
                url: inputArea.value.trim()
            });
            // var ary = [];
            // var text = inputArea.value
            // chrome.storage.sync.get(['keys', 'urls'], function (items) {
            //     if (items.urls && items.urls.length > 0) {
            //         ary = items.urls;
            //         ary.push(text);
            //     } else {
            //         ary.push(text);
            //     }
            //     chrome.storage.sync.set({ 'urls': ary }, function () {
            //         console.log('new URL has been added!');
            //     });
            // });
            alert("New url has been added successfully!");
            inputArea.value = '';
        }
    }, false);
    resetBtn.addEventListener('click', function () {
        confirm("Do you want to really reset all the urls?") && initStorage();
    }, false)
})();

//fornat dangerous urls list 
function initStorage() {
    // local storage
    // chrome.storage.sync.set({ keys: [], urls: [] }, function () {
    //     console.log('data has been emptyed!');
    // });

    // firebase db
    chrome.runtime.sendMessage({
        event: 'removeurls',
    });
    alert('all urls removed successfully!');
}
