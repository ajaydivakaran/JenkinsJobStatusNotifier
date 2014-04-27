(function(){
    chrome.alarms.onAlarm.addListener(function(alarm){
        if(alarm.name != 'jobStatusTimer'){
            return;
        }
        chrome.notifications.create("", {
            type: "basic",
            title: "Job status",
            message: "Primary message to display",
            iconUrl: "images/green_info.png"
        });
//        chrome.storage.sync.get({
//             jobs: []
//        }, function(items){
//            $.each(items['jobs'], function(index, job){
//               chrome.notifications.create
//            });
//        });

    });

}());