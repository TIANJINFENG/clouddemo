var http = require("http");

var url = require("url");

var visitApi = function(strUrl,method,request,callback){

var parse = url.parse(strUrl);
var options = {
    "method" : method,
    "host"   : parse.hostname,
    "path"   : parse.path,
    "port"   :parse.port,
    "headers": {
        "Authorization":request
    }
};
var req = http.request(options, function(res){
    res.setEncoding("utf-8");
    res.on("data", function(chunk){
        //console.log(chunk)
        callback != undefined && callback(chunk)

    }).on("end", function(){
        //console.log(resData);
    });
});
req.end();
};
module.exports = visitApi;