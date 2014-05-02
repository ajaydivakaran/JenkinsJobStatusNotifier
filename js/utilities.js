window.urlHelper = (function(){

    function normalizeUrl(url){
        var normalizedUrl = url.replace(/\/$/, ""); //remove trailing forward slash if present
        if(normalizedUrl.indexOf("http://") < 0){
            normalizedUrl = "http://" + normalizedUrl;
        }

        return normalizedUrl;
    }


    return {
        normalizeUrl: normalizeUrl
    };
}());