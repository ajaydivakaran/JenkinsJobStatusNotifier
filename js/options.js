var optionsViewModel = (function(){

    var jobs;
    var serverUrl;
    var userName;
    var apiKey;
    var pollingFrequency;
    var enableNotifications;
    var jobSelectionDialog;
    var selectedJobs = [];

    function initialize(){
        jobs = $("#jobs");
        serverUrl = $("#serverUrl");
        userName = $("#userName");
        apiKey = $("#apiKey");
        pollingFrequency = $("#pollingFrequency");
        enableNotifications = $("#enableNotifications");
        $("#updateData").on('click', _updatePrimaryData);
        $("#selectJobs").on('click', _showJobSelectionDialog);
        _loadSettings();
        _initalizeJobSelectionialog();
    }

    function _initalizeJobSelectionialog(){
        jobSelectionDialog = $("#jobSelectionDialog").dialog({
            autoOpen: false,
            modal:true,
            resizable: false,
            width: '450px',
            position: 'top'
        });
    }

    function _showJobSelectionDialog(){
        var jobListSection = $("#jobListSection");
        jobListSection.hide();

        var jobList = $("#jobList");
        jobList.html("");

        var jobFetchErrorMessage = $("#jobsFetchErrorMessage");
        jobFetchErrorMessage.hide();

        var loadingJobsMessage = $("#loadingJobsMessage");
        loadingJobsMessage.show();

        $.ajax({
            type: "GET",
            url: "http://" + serverUrl.val().trim() + "/api/json?depth=0",
            dataType: "json",
            async: true,
            headers: {
                "Authorization": "Basic " + window.btoa(userName.val().trim() + ":" + apiKey.val().trim())
            }
        }).done(function(response){
            loadingJobsMessage.hide();
            $.each(response.jobs, function(index, job){
               jobList.append("<li>" + job.name + "</li>")
            });
            jobList.selectable();
            jobListSection.show();
        }).error(function(jqXHR, textStatus, errorThrown){
            loadingJobsMessage.hide();
            jobFetchErrorMessage.show();
        });

        jobSelectionDialog.dialog("open");
    }

    function _loadSettings(){
        chrome.storage.sync.get({
             serverUrl: null,
             userName: null,
             apiKey: null,
             pollingFrequency: "5",
             enableNotifications: true,
             jobs: null
        }, function(items){
           serverUrl.val(items['serverUrl']);
           userName.val(items['userName']);
           apiKey.val(items['apiKey']);
           pollingFrequency.val(items['pollingFrequency']);
           enableNotifications.prop("checked", items['enableNotifications']);
           selectedJobs = items['jobs'];
        });
    }

    function _showSuccessMessage(message){
        $.notify(message, {globalPosition: 'top center', className: 'success'});
    }

    function _showErrorMessage(message){
        $.notify(message, {globalPosition: 'top center', className: 'error', showDuration: 600});
    }

    function _validateValueEntered(field){
        if(field.val().trim() == ''){
            field.addClass('error');
            return false;
        }
        return true;
    }

    function _clearAllFieldErrors(){
        $("input[type=text]").removeClass('error');
    }

    function _validateMandatoryFields(){
        _clearAllFieldErrors();

        return _validateValueEntered(serverUrl) &
               _validateValueEntered(userName) &
               _validateValueEntered(apiKey) &
               _validateValueEntered(pollingFrequency);
    }

    function _validatePollingFrequencyIsValid() {
        var value = pollingFrequency.val().trim();
        var isNumber = !isNaN(parseFloat(value)) && isFinite(value);
        if(!isNumber){
            pollingFrequency.addClass('error');
            _showErrorMessage("Enter valid frequency value (in minutes)");
        }
        return isNumber;
    }

    function _validateServerUrlFormat(){
        var url = serverUrl.val().trim();
        if(url.match(/^\d+\.\d+\.\d+\.\d+:\d+$/)){
            return true;
        }
        serverUrl.addClass('error');
        _showErrorMessage("Incorrect server ip-address:port format");
        return false;
    }

    function _validateServerUrlAndCredentials(){
        var isSuccessful = true;
        $.ajax({
            type: "GET",
            url: "http://" + serverUrl.val().trim() + "/api/json?depth=0",
            dataType: "json",
            async: false,
            headers: {
                "Authorization": "Basic " + window.btoa(userName.val().trim() + ":" + apiKey.val().trim())
            }
        }).done(function(){
            console.log("Credentials valid");
        }).error(function(jqXHR, textStatus, errorThrown){
           if(jqXHR.status == '401'){
                _showErrorMessage("Authentication failure");
                userName.addClass('error');
                apiKey.addClass('error');
           }
           else if(jqXHR.status == '0'){
               serverUrl.addClass('error');
               _showErrorMessage("Verify server ip-address:port");
           }
            isSuccessful = false;
        });

        return isSuccessful;
    }

    function _validateInputs(){
        return _validateMandatoryFields() &&
               _validateServerUrlFormat() &&
              _validateServerUrlAndCredentials() &&
              _validatePollingFrequencyIsValid();
    }

    function _updatePrimaryData(){

        if(!_validateInputs()){
            _showErrorMessage("Invalid settings");
            return;
        }

        chrome.storage.sync.set({
                 jobs: jobs.val().trim(),
                 serverUrl: serverUrl.val().trim(),
                 userName: userName.val().trim(),
                 apiKey: apiKey.val().trim(),
                 pollingFrequency: pollingFrequency.val().trim(),
                 enableNotifications: enableNotifications.is(":checked")
            }, function() {
            _showSuccessMessage("Save Successful");

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