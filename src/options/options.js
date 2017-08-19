function loadOptions(){
    chrome.storage.sync.get({
        username: ""
    }, function(items){
        document.getElementById("options_username").value = items.username;
    });
    document.getElementById('options_save_button').addEventListener('click',
    saveOptions);
}

function saveOptions(){
    var userName = document.getElementById("options_username").value;
    chrome.storage.sync.set({
        username: userName
    }, function(){
        document.getElementById('status').innerHTML="Options Set!";
        setTimeout(function() {
            document.getElementById('status').innerHTML="";
        }, 1000);
    });
}

document.addEventListener('DOMContentLoaded', loadOptions);
