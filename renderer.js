const remote = require('electron').remote;
var socket = io.connect('http://localhost:5335');
  
socket.on('connect', function (data) {
    console.log("connected");

    socket.on('deneme', function(data){
        if(data != "undefined"){
            var paragraph = document.getElementById("text");
            paragraph.textContent = data;
        }
        
    });

  });

    function closeWindow(){
        var window = remote.getCurrentWindow();
        window.close();
    }

    function minimizeWindow(){
        var window = remote.getCurrentWindow();
        window.minimize();
    }

    function hideIcons(){
        document.getElementsByClassName("settingsButton").style.display = "none";
    }

    function openPage(pageName) {
    // Hide all elements with class="pageContent" by default
    var i, pageContent, tablinks;
    pageContent = document.getElementsByClassName("pageContent");
    for (i = 0; i < pageContent.length; i++) {
        pageContent[i].style.display = "none";
    }

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";
    }

    var exec = require('child_process').exec;

    function shutdownNow(callback){
        exec('shutdown now', function(error, stdout, stderr){ callback(stdout); });
    }

    function shutdownOneHour(callback){
        exec('shutdown -h +60', function(error, stdout, stderr){ callback(stdout); });
        ipcRenderer.send('resize', 400, 300);
    }

    function shutdownCancel(callback){
        exec('shutdown -c', function(error, stdout, stderr){ callback(stdout); });
        ipcRenderer.send('resize', 800, 600);
    }

    shutdown(function(output){
        console.log(output);
    });