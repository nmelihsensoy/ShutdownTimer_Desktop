const remote = require('electron').remote;
var socket = io.connect('http://localhost:5335');
const electron = require('electron'); 
const {ipcRenderer} = electron;
const Store = require('electron-store');
const store = new Store();

var appTheme;

if(store.has('appTheme')){
    appTheme = store.get('appTheme')
}else{
    store.set('appTheme', 'light_theme');
    appTheme = store.get('appTheme')
}

document.getElementById('theme_css').href = store.get('appTheme') + '.css';

socket.on('connect', function (data) {
    console.log("connected");

    socket.on('deneme', function(data){
        var paragraph = document.getElementById("text");
        paragraph.textContent = data;
        
    });

  });

    function returnDateAfterHours(hour, minute, second){
        var today = new Date();
        today.setHours(today.getHours() + hour);
        today.setMinutes(today.getMinutes() + minute);
        today.setSeconds(today.getSeconds() + second);

        return today;
    }

    function themeSelector(value){
        if(value == 0){
            store.set('appTheme', 'light_theme');
        }else if(value == 1){
            store.set('appTheme', 'dark_theme');
        }
    }

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

    var x;
    function openPage(pageName, countDownDate) {
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
        
        if(appTheme == "light_theme"){
            document.getElementById("theme_selector").selectedIndex = "0";
        }else if(appTheme == "dark_theme"){
            document.getElementById("theme_selector").selectedIndex = "1";
        }

        document.getElementById("webServerPort").value = store.get('web_server_port');
        
    }else if(pageName == "timerPage"){
        ipcRenderer.send('resize', 500, 300);
        
        //Countdown method
        //https://www.w3schools.com/howto/howto_js_countdown.asp
        x = setInterval(function() {

            // Get todays date and time
            var now = new Date().getTime();
        
            // Find the distance between now and the count down date
            var distance = countDownDate - now;
        
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
            // Display the result in the element with id="demo"
            document.getElementById("countDown").innerHTML = "<span class=\"timerNumbers\">" + days +"</span>: " + "<span class=\"timerNumbers\">" + hours +"</span>: " + "<span class=\"timerNumbers\">" + minutes +"</span>: " + "<span class=\"timerNumbers\">" + seconds +"</span>";
        
            // If the count down is finished, write some text 
            if (distance < 0) {
            clearInterval(x);
            shutdownNow();
            document.getElementById("countDown").innerHTML = "SHUTDOWN NOW!";
            }
        }, 1000);
    }else{
        ipcRenderer.send('resize', 500, 400);
        x = null;
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
    }

    function shutdownCancel(){
        clearInterval(x);
        x = null;
        //exec('shutdown -c', function(error, stdout, stderr){ callback(stdout); });
    }

    shutdown(function(output){
        console.log(output);
    });