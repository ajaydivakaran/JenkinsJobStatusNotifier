var popupViewModel = (function(){

    function initialize(){
        var backgroundPageWindow = chrome.extension.getBackgroundPage();
        backgroundPageWindow.jobStatusNotifier.getConfiguredJobStatuses(_renderJobStatuses);
    }

    function _renderJobStatuses(jobResult){
        var className = jobResult.isLatestRunSuccessful ? "success" : "failure";
        var job = $("<li class='"+ className +"'>"+ jobResult.jobName +"</li>");
        $("#jobStatuses").append(job);
    }

    return  {
        init: initialize
    };
}());

$(function(){
    popupViewModel.init();
});