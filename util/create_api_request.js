var http = require("http");

var url = require("url");

var createapi = function(data,strUrl,callback){

    var parse = url.parse(strUrl);

    //console.log(parse)

    var options = {

        "method" : "POST",
        "host"   : parse.hostname,
        "path"   : parse.path,
        "port"   :parse.port,
        "headers": {
            'Content-Type': 'application/json',
            "x-tyk-authorization":"352d20ee67be67f6340b4c0605b044b7"
        }
    };
   // console.log("----------------------")

    var req = http.request(options, function(res){

        //console.log("aaaaa")

        res.setEncoding("utf-8");

        console.log("@@@@@@@@@@@@######")

        var resData = "";

        res.on("data", function(chunk){

            resData += chunk;

        }).on("end", function(){

            var access= JSON.parse(resData);

            console.log(access)

            callback != undefined && callback(access.key)

        });
    });

    req.write(JSON.stringify(data));

    req.end();
}

module.exports = createapi