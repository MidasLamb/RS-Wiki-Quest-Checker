
/**
 * Adds the checks to the quest requirements.
 * @param {[quests]} userQuests 
 */
function addQuestCompletedChecks(userQuests){
    $("a").each(function(index){
        if ($(this).html().toLowerCase() != "expand" || $(this).html().toLowerCase() != "collapse"){
            var questTitle = $(this).html();
            if (questTitle in userQuests){
                userQuests[questTitle].handleQuest($(this));
            }
            
        }
    });
}

/**
 * Adds the checks to the skill requirements.
 * @param {[skillName: level]} userLevels 
 */
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
                $(this).prepend(userLevels[skill]+"/");
                skillElement.append(' <img src=' + chrome.extension.getURL('assets/images/cross.svg') + ' style="width:15px">');
            }
        }
            
    });
}

function loadUserData(username, tries){
    loadUserQuests(username, tries);
    loadUserSkills(username, tries);
}

/**
 * Get the user's quest data and pass it along to function addQuestCompleteChecks()
 * @param {string} username - The in-game username of the user.
 * @param {int} tries - The amount of tries to get userdata before giving up.
 */
function loadUserQuests(username, tries){
    $.ajax({ // Get the quest data
        type:"GET",
        url:"https://apps.runescape.com/runemetrics/quests?user=" + username,
        success: function(msg){
            if (msg["quests"].length == 0){
                if (tries <= 0){
                    console.error("Could not fetch quest data!");
                } else {
                    loadUserData(username, tries-1);
                }
            } else {
                var userQuests = [];
                msg["quests"].forEach(function(item, index){
                    var questCompletionObject = null;
                    switch(item["status"]){
                        case "COMPLETED":
                            questCompletionObject = new questCompleted();
                            break;
                        case "NOT_STARTED":
                            questCompletionObject = new questNotStarted();
                            break;
                        case "STARTED":
                            questCompletionObject = new questInProgress();
                            break;
                    }

                    userQuests[item["title"]] = questCompletionObject;

                    if (item["title"] in apiQuestNamesCorrections){
                        var correctName = apiQuestNamesCorrections[item["title"]];
                        userQuests[correctName] = userQuests[item["title"]];
                    }                   
                });
                addQuestCompletedChecks(userQuests);
            }
            
        }
    });
}

/**
 * Loads the users skills and passes it along to the function addLevelDetailChecks().
 * @param {string} username - The in-game username of the user.
 * @param {int} tries - The amount of tries to get userdata before giving up.
 */
function loadUserSkills(username, tries){
    $.ajax({ // Get the skill data.
        type:"GET",
        url:"https://apps.runescape.com/runemetrics/profile/profile?user=" + username + "&activities=0",
        success: function(msg){
            if ("error" in msg){
                if (tries <= 0){
                    console.error("Could not fetch skills data!");
                } else {
                    loadUserSkills(username, tries-1);
                }
            } else {
                var userLevels = [];
                msg["skillvalues"].forEach(function(item, index){
                    userLevels[skills[item["id"]]] = item["level"]; 
                });
                addLevelDetailChecks(userLevels);
            }
        }
    });
}

/**
 * Get the configuration with standard values in case something is missing.
 * @param {requestCallback} func - the function which does something with the configuration.
 */
function getConfig(func){
    chrome.storage.sync.get({
        username: ""
    }, func);
}

function attachColorChange(){
    var colorGreen = "rgb(57, 234, 57)";
    $("li").each(function(){
        $(this).click(function(){
            if ($(this).css("background-color") == colorGreen){
                $(this).css("background-color", "");
            } else {
                $(this).css("background-color", colorGreen);
            }
            
        });
        $(this).css("cursor", "pointer");
    }) ;
}

/**
 * Load the config and start everything.
 */
function init(){
    getConfig(function(config){
        loadUserData(config.username, 5);
    });
    if (window.location.href.indexOf("Quick_guide") !== -1){
        attachColorChange();
    }
    
}

$(document).ready(init);



function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}



