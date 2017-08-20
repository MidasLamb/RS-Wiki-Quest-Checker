function saveOptions(){
    var userName = $("#options_username").val();
    chrome.storage.sync.set({
        username: userName
    }, function(){
        $('#status').html("Options Set!");
        setTimeout(function() {
            $('#status').html("");
        }, 1000);
    });
}

$(document).ready(function(){
    $('body').on('click', 'a', function(){
      chrome.tabs.create({url: $(this).attr('href')});
      return false;
    });

    chrome.storage.sync.get({
        username: ""
    }, function(items){
        $("#options_username").val(items.username);
    });

    $("#options_save_button").click(saveOptions);
 });