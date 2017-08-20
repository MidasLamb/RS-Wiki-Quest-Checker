var skills = ["Attack","Defence","Strength","Constitution","Ranged","Prayer","Magic","Cooking","Woodcutting","Fletching","Fishing","Firemaking","Crafting","Smithing","Mining","Herblore","Agility","Thieving","Slayer","Farming","Runecrafting","Hunter","Construction","Summoning","Dungeoneering","Divination","Invention"
];

function addQuestCompletedChecks(userQuests){
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

function addLevelDetailChecks(userLevels){
    $(".questdetails-info > ul > li").each(function(index){
        var textArr = $(this).text().split(" ");
        var level = textArr[0];
        if (isNaN(level)){ //Check if it is a number.
            return;
        }
        var skillElement = $(this).find("a").filter(function(index){
            //Find the link element which has a skill name.
            return ($(this).text() in userLevels) 
        });
        var skill = skillElement.text();

        if (level != "" && skill != ""){
            if (userLevels[skill] >= level) {
                skillElement.append(' <img src=' + chrome.extension.getURL('assets/images/check.svg') + '>');
            } else {
                skillElement.append(' <img src=' + chrome.extension.getURL('assets/images/cross.svg') + ' style="width:15px">');
            }
        }
            
    });
}

function loadUserData(username, tries){
    loadUserQuests(username, tries);
    loadUserStats(username, tries);
}

function loadUserQuests(username, tries){
    $.ajax({ // Get the quest data
        type:"GET",
        url:"https://apps.runescape.com/runemetrics/quests?user=" + username,
        success: function(msg){
            if (msg["quests"].length == 0){
                if (tries <= 0){
                    console.log("Could not fetch quest data!");
                } else {
                    console.log("Trying quests again!");
                    loadUserData(username, tries-1);
                }
            } else {
                var userQuests = [];
                msg["quests"].forEach(function(item, index){
                    userQuests[item["title"]] = item["status"];               
                });
                addQuestCompletedChecks(userQuests);
            }
            
        }
    });
}

function loadUserStats(username, tries){
    $.ajax({ // Get the skill data.
        type:"GET",
        url:"https://apps.runescape.com/runemetrics/profile/profile?user=" + username + "&activities=0",
        success: function(msg){
            if ("error" in msg){
                if (tries <= 0){
                    console.log("Could not fetch skills data!");
                } else {
                    Console.log("Trying stats again!");
                    loadUserStats(username, tries-1);
                }
            } else {
                var userLevels = [];
                msg["skillvalues"].forEach(function(item, index){
                // console.log(skills[item["id"]] + ": " +item["level"]);
                    userLevels[skills[item["id"]]] = item["level"];
                    
                });
                addLevelDetailChecks(userLevels);
            }
        }
    });
}

function getConfig(func){
    chrome.storage.sync.get({
        username: ""
    }, func);
}

function init(){
    getConfig(function(config){
        loadUserData(config.username, 1);
    });
}

init();



