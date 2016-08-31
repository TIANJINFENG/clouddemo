var http = require("http");

var url = require("url");

var visitApi = function(callback){

var strUrl = "http://192.168.1.31:8080/test-api/";

var parse = url.parse(strUrl);

//console.log(parse)

var options = {
    "method" : "GET",
    "host"   : parse.hostname,
    "path"   : parse.path,
    "port"   :parse.port,
    "headers": {
        "Authorization":"57ac445e40ab1e000100000467576a2c468d43f1629d21c21ae76947"
    }
};
var req = http.request(options, function(res){

    res.setEncoding("utf-8");

    console.log("@@@@@@@@@@@@######")

    var resData = "";
    res.on("data", function(chunk){

        resData += chunk;

    }).on("end", function(){

        //console.log(resData);
        callback != undefined && callback(resData)

    });
});

req.end();
}
module.exports = visitApi;