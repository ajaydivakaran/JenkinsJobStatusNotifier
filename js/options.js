var optionsViewModel = (function(){

    var jobs = ko.observableArray([]);
    var serverUrl = ko.observable();
    var userName = ko.observable();
    var apiKey = ko.observable();
    var pollingFrequency = ko.observable();
    var enableNotifications = ko.observable();
    var newJobName = ko.observable();
    var addJobMessage = ko.observable();

    function addJob(){
        if(newJobName()){
            jobs.push(newJobName());
            newJobName("");
            addJobMessage("Added Successfully");
        }
        else{
            addJobMessage("Failed to add");
        }
    }

    function removeJob(){

    }

    function updatePrimaryData(){

    }


    return {
        jobs: jobs,
        serverUrl: serverUrl,
        userName: userName,
        apiKey: apiKey,
        newJobName: newJobName,
        addJobMessage: addJobMessage,
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