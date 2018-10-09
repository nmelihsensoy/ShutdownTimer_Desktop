// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

const Store = require('electron-store');
const store = new Store();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

    const {ipcMain} = require('electron')
    ipcMain.on('resize', function (e, x, y) { mainWindow.setSize(x, y); });

    function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 500, 
    height: 600, 
    transparent: true, 
    resizable: false, 
    useContentSize: true, 
    maximizable: false, 
    frame: false, 
    titleBarStyle: 'hidden',
    icon: __dirname + '/icons/ic_main.png' 
})
var io  = require('socket.io').listen(5335);

var http = require('http');
var url = require('url');
fs = require('fs');

io.sockets.on('connection', function (socket) {
	socket.on('subscribe', function (data) {
		console.log('Subscribing to '+ data);
	});

	socket.on('testElectron', function (data) {
		console.log("asdasd");
  });
});

console.log(store.get('web_server'));

var web_server_port;
if(store.has('web_server_port')){
  web_server_port = store.get('web_server_port');
}else{
  web_server_port = '8080';
  store.set('web_server_port', );
}

if(store.get('web_server') == 'true'){
  fs.readFile('app/server.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(html);
      var q = url.parse(req.url, true).query;
      var txt = q.year + " " + q.month;
      if(q.year != null & q.month != null){
        io.sockets.emit('deneme', txt);
      }
      res.end();
    }).listen(web_server_port);
  });
}


  // and load the index.html of the app.
  mainWindow.loadFile('app/index.html', {
    rendererSideName : "http"
  } );

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.