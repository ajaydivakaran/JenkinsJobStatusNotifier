window.jobStatusNotifier = (function(){

    function _constructJobStatusQueryUrl(items){
        var userName = items['userName'].trim();
        var apiKey = items['apiKey'].trim();
        var serverUrl = items['serverUrl'].trim();
        var jobName = items['jobName'].trim();

        return "http://" + userName + ":" + apiKey  + "@" + serverUrl + "/job/" + jobName + "/api/json?depth=0";
    }

    function _getConfiguredJobsStatuses(postQueryCallback){
        chrome.storage.sync.get({
             serverUrl: null,
             userName: null,
             apiKey: null,
             jobs: null
        }, function(items){
            var jobList = items['jobs'];
            var jobs = jobList.split(",");
            $.each(jobs, function(index, job){
                var url = _constructJobStatusQueryUrl({
                    userName: items['userName'],
                    apiKey: items['apiKey'],
                    serverUrl: items['serverUrl'],
                    jobName: job
                });

                $.get(url, function(response){
                    var isLatestRunSuccessful = response['color'] == 'blue';
                    var jobName = response['displayName'];
                    var imageName = isLatestRunSuccessful ? "green_info.png" : "red_info.png"
//                    var statusMessage = isLatestRunSuccessful ? " is Green" : " is Red";
                    postQueryCallback({
                        jobName: jobName,
                        isLatestRunSuccessful: isLatestRunSuccessful,
                        imageName: imageName
                    });
                });

            });

        });

    }

    function alarmEventHandler(){
        var _createNotificationHandler = function(jobResult){
            var statusMessage = jobResult.isLatestRunSuccessful ? " is Green" : " is Red";
            chrome.notifications.create("", {
                type: "basic",
                title: jobResult.jobName,
                message: jobResult.jobName + statusMessage,
                iconUrl: "../images/" + jobResult.imageName
            }, function(){});

        };
        _getConfiguredJobsStatuses(_createNotificationHandler);
    }

//    function initializeAlarmEventHandler(){
//        chrome.alarms.onAlarm.addListener(function(alarm){
//            if(alarm.name != 'jobStatusTimer'){
//                return;
//            }
//
//        chrome.storage.sync.get({
//             serverUrl: null,
//             userName: null,
//             apiKey: null,
//             enableNotifications: true,
//             jobs: null
//        }, function(items){
//            var jobList = items['jobs'];
//            var jobs = jobList.split(",");
//            $.each(jobs, function(index, job){
//                var url = _constructUrl({
//                    userName: items['userName'],
//                    apiKey: items['apiKey'],
//                    serverUrl: items['serverUrl'],
//                    jobName: job
//                });
//
//                $.get(url, function(response){
//                    var isLatestJobSuccessful = response['color'] == 'blue';
//                    var jobName = response['displayName'];
//                    var imageName = isLatestJobSuccessful ? "green_info.png" : "red_info.png"
//
//                });
//
//            });
//
//        });
//
//
//
//        });
//    }


    return {
        alarmEventHandler: alarmEventHandler
    };
}());