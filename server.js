//Lets require/import the HTTP module
var http = require('http');
var fs = require('fs');
var dispatcher = require('httpdispatcher');
var querystring = require('querystring');

//Lets define a port we want to listen to
const PORT=8080; 

//We need a function which handles requests and send response
function handleRequest(request, response){
    try {
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

dispatcher.setStatic('resources');
dispatcher.setStaticDirname('.');

dispatcher.onGet("/index.html", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream('index.html').pipe(res);
});

dispatcher.onGet("/", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream('index.html').pipe(res);
});

dispatcher.onPost("/car", function(req, res) {
    var info ='';
    req.addListener('data', function(chunk) {
        info += chunk;
    }).addListener('end', function() {
        info = querystring.parse(info);
        res.writeHead(200);
        console.log(info);
        res.end();
    });
});

dispatcher.onError(function(req, res) {
    res.writeHead(404);
});

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
