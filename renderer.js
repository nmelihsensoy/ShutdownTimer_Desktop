const remote = require('electron').remote;
var socket = io.connect('http://localhost:5335');

const Store = require('electron-store');
const store = new Store();

socket.on('connect', function (data) {
    console.log("connected");

    socket.on('deneme', function(data){
        var paragraph = document.getElementById("text");
        paragraph.textContent = data;
        
    });

  });

    function toggleWebServer(){
        var checkBox = document.getElementById("webServerToggle");
        if (checkBox.checked == true){
            store.set('web_server', 'true');
        } else {
            store.set('web_server', 'false');
        }
    }

    function webServerPortListener(value){
        store.set('web_server_port', value);
    }

    function restartApp(){
        var window = remote.getCurrentWindow();
        window.reload()
    }

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

    if(pageName == "settingsPage"){
        if(store.get('web_server') == 'true'){
            document.getElementById("webServerToggle").checked = true;
        }else{
            document.getElementById("webServerToggle").checked = false;
        }
        
        document.getElementById("webServerPort").value = store.get('web_server_port');
        
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