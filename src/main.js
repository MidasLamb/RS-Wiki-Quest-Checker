var skills = ["Attack","Defence","Strength","Constitution","Ranged","Prayer","Magic","Cooking","Woodcutting","Fletching","Fishing","Firemaking","Crafting","Smithing","Mining","Herblore","Agility","Thieving","Slayer","Farming","Runecrafting","Hunter","Construction","Summoning","Dungeoneering","Divination","Invention"
]; //Used to turn skill ID's into usable names.

var apiQuestNamesCorrections = [];
apiQuestNamesCorrections["Great Brain Robbery"] = "The Graet Brain Robbery";
apiQuestNamesCorrections["Curse of Arrav"] = "The Curse of Arrav";
apiQuestNamesCorrections["Chosen Commander"] = "The Chosen Commander";
apiQuestNamesCorrections["Fairy Tale III - Battle at Orks Rift"] = "Fairy Tale III - Orks Rift";
apiQuestNamesCorrections["Slug Menace"] = "The Slug Menace";
apiQuestNamesCorrections["Dig Site"] = "The Dig Site";


/**
 * Adds the checks to the quest requirements.
 * @param {[quests]} userQuests 
 */
function addQuestCompletedChecks(userQuests){
    $("a").each(function(index){
        if ($(this).html().toLowerCase() != "expand" || $(this).html().toLowerCase() != "collapse"){
            var questTitle = $(this).html();
            if (userQuests[questTitle] == "COMPLETED"){
                $(this).append(' <img src=' + chrome.extension.getURL('assets/images/check.svg') + '>');
            }
            if (userQuests[questTitle] == "NOT_STARTED"){
                $(this).append(' <img src=' + chrome.extension.getURL('assets/images/cross.svg') + ' style="width:15px">');
            }
            if (userQuests[questTitle] == "STARTED"){
                $(this).append(' <img src=' + chrome.extension.getURL('assets/images/inprogress.svg') + ' style="width:15px">');
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
                    userQuests[item["title"]] = item["status"];
                    if (item["title"] in apiQuestNamesCorrections){
                        var correctName = apiQuestNamesCorrections[item["title"]];
                        userQuests[correctName] = item["status"];
                        console.log("Correction! " + item["title"] + " becomes " + correctName );
                    }
                                   
                });
                console.log(userQuests);
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

/**
 * Load the config and start everything.
 */
function init(){
    getConfig(function(config){
        loadUserData(config.username, 5);
    });
}

init();



