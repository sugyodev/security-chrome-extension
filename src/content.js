var currentUrl = document.URL;
var Keywords = [], DangerUrls = [];
var pageContent = "";

function init() {
    //use chrome local storage
    // chrome.storage.sync.get(['keys', 'urls'], function (items) {
    //     checkUrlIsDanger(items.urls);
    // })

    //use firebase database
    chrome.runtime.sendMessage({ event: "geturls" }, function (response) {
        if (response && response.length > 0) {
            DangerUrls = convertObjAryToAry(response, 'url');
            checkUrlIsDanger(DangerUrls);
        }
        chrome.runtime.sendMessage({ event: "getkeywords" }, function (response) {
            if (response && response.length > 0) {
                Keywords = convertObjAryToAry(response, 'key');
                checkSearchResults(Keywords);
                checkPageContent(Keywords);
            }
        });
    });
}

//Check Search Results
function checkSearchResults() {
    $('#search #rso').children('div').each(function (i, ele) {
        var searchResult = ele.innerText.trim();
        var isKeywordExist = false;
        var div = document.createElement("div");
        Keywords.forEach(function (e, i) {
            if (searchResult.indexOf(e) !== -1) {
                isKeywordExist = true;
                return;
            }
        })
        if (isKeywordExist) {
            div.style.cssText = 'width:8px;height:8px;background-color:red;border-radius:50%;';
        } else {
            div.style.cssText = 'width:8px;height:8px;background-color:green;border-radius:50%;';
        }
        ele.prepend(div);
    })
}

//Get Hostname Form Url
function getHost(url) {
    var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im'),
        m;
    if (url != null) {
        m = url.match(re);
        if (m != null) {
            return m[0];
        }
    }
    return url;
}

//Check current Url
function checkUrlIsDanger() {
    if (currentUrl.indexOf("https://www.google.com/search") !== -1) {
        return;
    }
    DangerUrls.forEach((el, i) => {
        var currentHost = getHost(currentUrl);
        if (el.indexOf(currentHost) !== -1) {
            alert("Access denied to this URL!");
            chrome.runtime.sendMessage({
                event: 'close'
            });
        }
    })
}

//Check Entered Page Content
function checkPageContent(Keywords = []) {
    if (currentUrl.indexOf("https://www.google.com/search") !== -1) {
        return;
    }
    var isKeywordExist = false;
    Keywords.forEach(function (e, i) {
        if (pageContent.indexOf(e) !== -1) {
            isKeywordExist = true;
            return;
        }
    })
    if (isKeywordExist === true) {
        var state = confirm("dangerous keyword has been detected!\nclick \"OK\" to add url and close the site, or click \"CANCEL\" to keep this site");
        if (state) {
            //local storage
            // var ary = [];
            // chrome.storage.sync.get(['keys', 'urls'], function (items) {
            //     if (items.urls && items.urls.length > 0) {
            //         ary = items.urls;
            //         ary.push(currentUrl);
            //     } else {
            //         ary.push(currentUrl);
            //     }
            //     chrome.storage.sync.set({ 'urls': ary }, function () {
            //         console.log('new URL has been added!');
            //     });
            // });

            //firebase
            chrome.runtime.sendMessage({
                event: 'addurl',
                url: currentUrl
            });
            chrome.runtime.sendMessage({ event: 'close' });
        }
    } else {
        // console.log('clean!');
    }
}

//Convert ObjectArray To Array Using a Key
function convertObjAryToAry(obj, key) {
    var ary = [], len = obj.length;
    for (var i = 0; i < len; i++) {
        ary.push(obj[i][key]);
    }
    return ary;
}

document.addEventListener("DOMContentLoaded", () => {
    pageContent = document.body.innerText;
    init();
    // checkPageContent();
    // checkSearchResults();
},{ once: true });

