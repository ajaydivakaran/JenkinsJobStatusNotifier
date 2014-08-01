var popupViewModel = (function(){
    var optionsLink;

    function _optionsLinkClickHandler(event){
        chrome.tabs.create({'url': chrome.extension.getURL("html/options.html")});
        event.preventDefault();
    }

    function initialize(){
        var optionsLink = $("#optionsPageLink");
        optionsLink.on('click', _optionsLinkClickHandler);

        var refreshJobsLink = $("#refresh_jobs");
        optionsLink.on('click', _refreshJobs);

        _refreshJobs();
    }

    function _refreshJobs(){
        var backgroundPageWindow = chrome.extension.getBackgroundPage();
        $("#jobStatuses").html('');
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