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
        jq.append(' <img src=' + chrome.extension.getURL('assets/images/check.svg') + '>');
    }
}

class questNotStarted {
    handleQuest(jq){
        jq.append(' <img src=' + chrome.extension.getURL('assets/images/cross.svg') + ' style="width:15px">');
    }
}

class questInProgress{
    handleQuest(jq){
        jq.append(' <img src=' + chrome.extension.getURL('assets/images/inprogress.svg') + ' style="width:15px">');
    }
}