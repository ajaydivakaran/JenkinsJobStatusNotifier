(function(){

    chrome.runtime.onStartup.addListener(function(){
        console.log("Kick starting alarm init");
        var backgroundPageWindow = chrome.extension.getBackgroundPage();
        backgroundPageWindow.jobStatusNotifier.checkAndInitializeAlarm();
    });

}());