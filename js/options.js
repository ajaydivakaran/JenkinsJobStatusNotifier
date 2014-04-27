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
            $.notify("Save Successful", "success");

            chrome.alarms.clear("jobStatusTimer");

            var pollingFrequencyInMinutes = parseFloat(pollingFrequency.val());
            chrome.alarms.create("jobStatusTimer", {
                                delayInMinutes: pollingFrequencyInMinutes,
                                periodInMinutes: pollingFrequencyInMinutes
            });
            initializeAlarmEventHandler();
        });

    }

    function _constructUrl(items){
        var userName = items['userName'].trim();
        var apiKey = items['apiKey'].trim();
        var serverUrl = items['serverUrl'].trim();
        var jobName = items['jobName'].trim();
        return "http://" + userName + ":" + apiKey  + "@" + serverUrl + "/job/" + jobName + "/api/json";
    }

    function initializeAlarmEventHandler(){
        chrome.alarms.onAlarm.addListener(function(alarm){
            if(alarm.name != 'jobStatusTimer'){
                return;
            }

        chrome.storage.sync.get({
             serverUrl: null,
             userName: null,
             apiKey: null,
             enableNotifications: true,
             jobs: null
        }, function(items){
           var jobList = items['jobs'];
           var jobs = jobList.split(",");
            $.each(jobs, function(index, job){
                var url = _constructUrl({
                    userName: items['userName'],
                    apiKey: items['apiKey'],
                    serverUrl: items['serverUrl'],
                    jobName: job
                });

                $.get(url, function(response){
                    var isLatestJobSuccessful = response['color'] == 'blue';
                    var jobName = response['displayName'];
                    var imageName = isLatestJobSuccessful ? "green_info.png" : "red_info.png"
                    var statusMessage = isLatestJobSuccessful ? " is Green" : " is Red";
                    chrome.notifications.create("", {
                        type: "basic",
                        title: jobName,
                        message: jobName + statusMessage,
                        iconUrl: "../images/" + imageName
                    }, function(){});

                });

            });

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