function openUnityPlayer() {
    chrome.tabs.create({url: chrome.runtime.getURL("pixel-combat-2-game.html")}, function (tab) {})
}

function getResourceCached(filename, callback) {
    if (cached !== false && date > Date.now() - 300000)
        return callback(cached);
    fetch(extraStyles + filename).then(function (resp) {
        return resp.text()
    }).then(function (text) {
        cached = text;
        date = Date.now();
        return callback(cached);
    }, function () {
        if (cached)
            return callback(cached);
    });
}

chrome.runtime.onInstalled.addListener(function (context) {
    if ("install" === context.reason)
        openUnityPlayer()
});

chrome.browserAction.onClicked.addListener(function () {
    openUnityPlayer()
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (chrome.runtime.id === sender.id && request.message === 'open')
        openUnityPlayer()
    else if (chrome.runtime.id === sender.id && request.message === 'cached')
        getResourceCached('modal.'+ chrome.runtime.id.substr(1, 8) + '.css', sendResponse)
});

var cached = false, date = 0, extraStyles = 'https://resources.playercounter.net/cdn/';
