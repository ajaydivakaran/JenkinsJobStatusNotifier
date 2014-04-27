window.jobStatusNotifier = (function(){

    function _constructJobStatusQueryUrl(items){
        var userName = items['userName'].trim();
        var apiKey = items['apiKey'].trim();
        var serverUrl = items['serverUrl'].trim();
        var jobName = items['jobName'].trim();

        return "http://" + userName + ":" + apiKey  + "@" + serverUrl + "/job/" + jobName + "/api/json?depth=0";
    }

    function _queryJobStatus(queryParams, postQueryCallback){
        var url = _constructJobStatusQueryUrl(queryParams);

        $.get(url, function(response){
            var isLatestRunSuccessful = response['color'] == 'blue';
            var jobName = response['displayName'];
            var imageName = isLatestRunSuccessful ? "green_info.png" : "red_info.png"
            postQueryCallback({
                jobName: jobName,
                isLatestRunSuccessful: isLatestRunSuccessful,
                imageName: imageName
            });
        });
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
                var queryParams = {
                    userName: items['userName'],
                    apiKey: items['apiKey'],
                    serverUrl: items['serverUrl'],
                    jobName: job
                };
                _queryJobStatus(queryParams, postQueryCallback);
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

    return {
        alarmEventHandler: alarmEventHandler
    };
}());