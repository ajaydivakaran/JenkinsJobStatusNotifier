window.jobStatusNotifier = (function(){

    function _constructJobStatusQueryUrl(items){
        var serverUrl = items['serverUrl'];
        var jobName = items['jobName'];

        return "http://" + serverUrl + "/job/" + jobName + "/api/json?depth=0";
    }

    function _hasCurrentJobRunFailed(currentJobColor){
        return currentJobColor != 'blue' && currentJobColor != 'blue_anime';
    }

    function _getJobStatus(currentJobColor){
        if(currentJobColor == 'blue')
            return 'success';
        else if(currentJobColor == 'blue_anime')
            return 'success_building';
        else
            return 'failure';
    }

    function _queryJobStatus(queryParams, postQueryCallback){
        var url = _constructJobStatusQueryUrl(queryParams);

        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            headers: {
                "Authorization": "Basic " + window.btoa(queryParams.userName + ":" + queryParams.apiKey)
            }
        }).done(function(response){
            var hasLatestRunFailed = _hasCurrentJobRunFailed(response['color']);
            var jobName = response['displayName'];
            var imagePath = hasLatestRunFailed ? "../images/red_info.png": "../images/green_info.png";
            postQueryCallback({
                jobName: jobName,
                isLatestRunSuccessful: !hasLatestRunFailed,
                imagePath: imagePath,
                jobStatus: _getJobStatus(response['color'])
            });
        });
    }

    function getConfiguredJobsStatuses(postQueryCallback){
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

    function _alarmEventHandler(){
        var _createNotificationHandler = function(jobResult){
            var statusMessage = jobResult.isLatestRunSuccessful ? " is Green" : " is Red";

            console.log(jobResult.jobName + " last run successful: " + jobResult.isLatestRunSuccessful);

            !jobResult.isLatestRunSuccessful && chrome.notifications.create("", {
                type: "basic",
                title: jobResult.jobName,
                message: jobResult.jobName + statusMessage,
                iconUrl: jobResult.imagePath
            }, function(notificationId){
                console.log("Created notification with id:" + notificationId);
            });

        };
        getConfiguredJobsStatuses(_createNotificationHandler);
    }

    function checkAndInitializeAlarm(){
        chrome.alarms.clear("jobStatusTimer");
        chrome.alarms.onAlarm.removeListener(_alarmListener);

        chrome.storage.sync.get({
             pollingFrequency: "1",
             enableNotifications: false
        }, function(result){
                if(!result['enableNotifications']){
                    console.log("Notifications not enabled.");
                    return;
                }

                var pollingFrequencyInMinutes = parseFloat(result['pollingFrequency']);
                chrome.alarms.create("jobStatusTimer", {
                            delayInMinutes: pollingFrequencyInMinutes,
                            periodInMinutes: pollingFrequencyInMinutes
                });
                _initializeAlarmEventHandler();
           });

    }

    function _initializeAlarmEventHandler(){
        chrome.alarms.onAlarm.addListener(_alarmListener);
    }

    function _alarmListener(alarm){
        console.log("Alarm triggered!");
        if(alarm.name != 'jobStatusTimer'){
            console.log("Skipping unwanted alarm event");
            return;
        }
        _alarmEventHandler();
    }

    return {
        checkAndInitializeAlarm: checkAndInitializeAlarm,
        getConfiguredJobStatuses: getConfiguredJobsStatuses
    };
}());