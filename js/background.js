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
            var isLatestRunSuccessful = !_hasCurrentJobRunFailed(response['color']);
            var jobName = response['displayName'];
            var imagePath = isLatestRunSuccessful ? "../images/green_info.png" : "../images/red_info.png";
            postQueryCallback({
                jobName: jobName,
                isLatestRunSuccessful: isLatestRunSuccessful,
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

    function alarmEventHandler(){
        var _createNotificationHandler = function(jobResult){
            var statusMessage = jobResult.isLatestRunSuccessful ? " is Green" : " is Red";

            !jobResult.isLatestRunSuccessful && chrome.notifications.create(jobResult.jobName, {
                type: "basic",
                title: jobResult.jobName,
                message: jobResult.jobName + statusMessage,
                iconUrl: jobResult.imagePath
            }, function(){});

        };
        getConfiguredJobsStatuses(_createNotificationHandler);
    }

    return {
        alarmEventHandler: alarmEventHandler,
        getConfiguredJobStatuses: getConfiguredJobsStatuses
    };
}());