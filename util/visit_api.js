var http = require("http");

var url = require("url");

var visitApi = function(request,callback){

var strUrl = "http://139.129.221.136:8081/x-api/";

var parse = url.parse(strUrl);

//console.log(parse)

var options = {
    "method" : "GET",
    "host"   : parse.hostname,
    "path"   : parse.path,
    "port"   :parse.port,
    "headers": {
        "Authorization":request
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