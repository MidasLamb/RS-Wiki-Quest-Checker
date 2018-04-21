class questCompletion{
    /**
     * 
     * @param {*} jq : The object on which to act, this should be the <a> tags with the quest name within.
     * 
     */
    handleQuest(jq){}
}

class questCompleted {
    handleQuest(jq){
        jq.append(' <img src=' + chrome.extension.getURL('assets/images/check.svg') + ' style="width:auto; height: 1em; padding-bottom: 0.2em;">');
        jq.css("white-space", "nowrap");
    }
}

class questNotStarted {
    handleQuest(jq){
        jq.append(' <img src=' + chrome.extension.getURL('assets/images/cross.svg') + ' style="width:auto; height: 1em; padding-bottom: 0.2em;">');
        jq.css("white-space", "nowrap");
    }
}

class questInProgress{
    handleQuest(jq){
        jq.append(' <img src=' + chrome.extension.getURL('assets/images/inprogress.svg') + ' style="width:auto; height: 1em; padding-bottom: 0.2em;">');
        jq.css("white-space", "nowrap");
    }
}