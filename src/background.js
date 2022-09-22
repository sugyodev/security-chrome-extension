const firebaseConfig = {
    apiKey: "AIzaSyDZi7u1BbIt0Di4qzVLZ7Nl4v04OvY1uYU",
    authDomain: "sgfirebasesimple.firebaseapp.com",
    projectId: "sgfirebasesimple",
    storageBucket: "sgfirebasesimple.appspot.com",
    messagingSenderId: "308956582907",
    appId: "1:308956582907:web:3288f972bf0dc9264df15e",
    measurementId: "G-XT69TVCL7N"
};

chrome.runtime.onMessage.addListener(function (response) {
    if (response.event !== 'close') {
        return;
    }
    closeCurrentTab();
});

function closeCurrentTab() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.remove(tabs[0].id);
    });
}

// Initialize Firebase
try {
    self.importScripts('./firebase-compat.js');
    initFirebase();
} catch (e) {
    console.error(e);
}

//Save new Url to Firebase
function addUrlToFirebase(db) {
    chrome.runtime.onMessage.addListener(function (response) {
        if (response.event !== 'addurl') {
            return;
        }
        var addurl = db.collection("urls");
        addurl.add({
            url: response.url,
        });
    });
}

//Remove all Urls of Firebase collection
function removeAllUrlsInFirebase(db) {
    const getandremoveurls = db.collection("urls");
    chrome.runtime.onMessage.addListener(function (response) {
        if (response.event !== 'removeurls') {
            return;
        }
        getandremoveurls.get().then(function (snap) {
            if (snap && snap.empty === false) {
                snap.docs.map(doc => {
                    doc.ref.delete();
                });
            }
            else {
                console.log("No such document!");
            }
        })
    });

}

//Get all Keywords from Firebase
function getKeywordsFromFirebase(db) {
    var getKeywords = db.collection("keywords");
    chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
        if (response.event !== 'getkeywords') {
            return;
        }
        getKeywords.get().then(function (snap) {
            var keywords = [];
            if (snap && snap.empty === false) {
                snap.docs.map(doc => {
                    keywords.push(doc.data());
                });
                setTimeout(function () {
                    sendResponse(keywords);
                }, 1)
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
        return true;
    });
}

//Get all urls from Firebase
function getUrlsFromFirebase(db) {
    var geturls = db.collection("urls");
    chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
        if (response.event !== 'geturls') {
            return;
        }
        geturls.get().then(function (snap) {
            var urls = [];
            if (snap && snap.empty === false) {
                snap.docs.map(doc => {
                    urls.push(doc.data());
                });
            }
            setTimeout(function () {
                sendResponse(urls);
            }, 1)
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
        return true;
    });
}


function initFirebase() {
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
    getKeywordsFromFirebase(db);
    getUrlsFromFirebase(db);
    addUrlToFirebase(db);
    removeAllUrlsInFirebase(db);
}