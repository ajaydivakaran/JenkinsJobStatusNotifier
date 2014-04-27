var optionsViewModel = (function(){

    var jobs = ko.observableArray([]);
    var serverUrl = ko.observable();
    var userName = ko.observable();
    var apiKey = ko.observable();
    var pollingFrequency = ko.observable();
    var enableNotifications = ko.observable();
    var newJobName = ko.observable();
    var addJobMessage = ko.observable();
    var updatePrimaryDataMessage = ko.observable();

    function addJob(){
        if(newJobName()){
            jobs.push(newJobName());
            newJobName("");
            _updateJobs();
            addJobMessage("Added Successfully");
        }
        else{
            addJobMessage("Failed to add");
        }
    }

    function removeJob(jobName){
        jobs.remove(jobName);
        _updateJobs();
    }

    function _updateJobs(){
        chrome.storage.sync.set({jobs: jobs()}, function(){
            console.log("Update of jobs successful");
        });
    }

    function _loadSettings(){
        chrome.storage.sync.get({
             serverUrl: null,
             userName: null,
             apiKey: null,
             pollingFrequency: "60",
             enableNotifications: true,
             jobs: []
        }, function(items){
           serverUrl(items['serverUrl']);
           userName(items['userName']);
           apiKey(items['apiKey']);
           pollingFrequency(items['pollingFrequency']);
           enableNotifications(items['enableNotifications']);
           jobs(items['jobs']);
        });
    }

    function updatePrimaryData(){
        chrome.storage.sync.set({
                 serverUrl: serverUrl(),
                 userName: userName(),
                 apiKey: apiKey(),
                 pollingFrequency: pollingFrequency(),
                 enableNotifications: enableNotifications()
            }, function() {
            console.log("Save of primary data successful");
            updatePrimaryDataMessage('Save Successful');
        });
    }

    _loadSettings();

    return {
        jobs: jobs,
        serverUrl: serverUrl,
        userName: userName,
        apiKey: apiKey,
        newJobName: newJobName,
        addJobMessage: addJobMessage,
        updatePrimaryDataMessage: updatePrimaryDataMessage,
        pollingFrequency: pollingFrequency,
        enableNotifications: enableNotifications,
        addJob: addJob,
        removeJob: removeJob,
        updatePrimaryData: updatePrimaryData
    };
}());

$(function(){
    ko.applyBindings(optionsViewModel);
});