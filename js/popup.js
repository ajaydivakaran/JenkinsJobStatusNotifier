var popupViewModel = (function(){

    function initialize(){
        var backgroundPageWindow = chrome.extension.getBackgroundPage();
        backgroundPageWindow.jobStatusNotifier.getConfiguredJobStatuses(_renderJobStatuses);
    }

    function _renderJobStatuses(jobResult){
        var job = $("<li class='"+ jobResult.jobStatus +"'>"+ jobResult.jobName +"</li>");
        $("#jobStatuses").append(job);
    }

    return  {
        init: initialize
    };
}());

$(function(){
    popupViewModel.init();
});