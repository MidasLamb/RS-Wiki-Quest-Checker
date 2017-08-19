function addCompletedChecks(userQuests){
    $(".questreq a").each(function(index){
        if ($(this).html().toLowerCase() != "expand" || $(this).html().toLowerCase() != "collapse"){
            var questTitle = $(this).html();
            if (userQuests[questTitle] == "COMPLETED"){
                $(this).append(' <img src=' + chrome.extension.getURL('assets/images/check.svg') + '>');
            }
            if (userQuests[questTitle] == "NOT_STARTED"){
                $(this).append(' <img src=' + chrome.extension.getURL('assets/images/cross.svg') + ' style="width:15px">');
            }
        }
    });
}

function loadUserData(username){
    $.ajax({
        type:"GET",
        url:"https://apps.runescape.com/runemetrics/quests?user=" + username,
        success: function(msg){
            var userQuests = [];
            msg["quests"].forEach(function(item, index){
                userQuests[item["title"]] = item["status"];               
            });
            addCompletedChecks(userQuests);
        }
    })
}

function getConfig(func){
    chrome.storage.sync.get({
        username: ""
    }, func);
}

function init(){
    getConfig(function(config){
        loadUserData(config.username);
    });
}

init();



