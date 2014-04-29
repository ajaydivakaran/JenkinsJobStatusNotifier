var optionsViewModel = (function(){

    var jobs;
    var serverUrl;
    var userName;
    var apiKey;
    var pollingFrequency;
    var enableNotifications;

    function initialize(){
        jobs = $("#jobs");
        serverUrl = $("#serverUrl");
        userName = $("#userName");
        apiKey = $("#apiKey");
        pollingFrequency = $("#pollingFrequency");
        enableNotifications = $("#enableNotifications");
        $("#updateData").on('click', _updatePrimaryData);
        _loadSettings();
    }

    function _loadSettings(){
        chrome.storage.sync.get({
             serverUrl: null,
             userName: null,
             apiKey: null,
             pollingFrequency: "1",
             enableNotifications: true,
             jobs: null
        }, function(items){
           serverUrl.val(items['serverUrl']);
           userName.val(items['userName']);
           apiKey.val(items['apiKey']);
           pollingFrequency.val(items['pollingFrequency']);
           enableNotifications.prop("checked", items['enableNotifications']);
           jobs.val(items['jobs']);
        });
    }

    function _updatePrimaryData(){
        chrome.storage.sync.set({
                 jobs: jobs.val().trim(),
                 serverUrl: serverUrl.val().trim(),
                 userName: userName.val().trim(),
                 apiKey: apiKey.val().trim(),
                 pollingFrequency: pollingFrequency.val().trim(),
                 enableNotifications: enableNotifications.is(":checked")
            }, function() {
            $.notify("Save Successful", "success");

            var backgroundPageWindow = chrome.extension.getBackgroundPage();
            backgroundPageWindow.jobStatusNotifier.checkAndInitializeAlarm();
        });

    }

    return {
        init: initialize
    };
}());

$(function(){
   optionsViewModel.init();
});