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
                 jobs: jobs.val(),
                 serverUrl: serverUrl.val(),
                 userName: userName.val(),
                 apiKey: apiKey.val(),
                 pollingFrequency: pollingFrequency.val(),
                 enableNotifications: enableNotifications.is(":checked")
            }, function() {
            console.log("Save of primary data successful");
            updatePrimaryDataMessage('Save Successful');
            $.notify("Save Successful");

            chrome.alarms.clear("jobStatusTimer");

            var pollingFrequencyInMinutes = parseFloat(pollingFrequency.val());
            chrome.alarms.create("jobStatusTimer", {
                                delayInMinutes: pollingFrequencyInMinutes,
                                periodInMinutes: pollingFrequencyInMinutes
            });
        });

    }

    return {
        init: initialize
    };
}());

$(function(){
   optionsViewModel.init();
});