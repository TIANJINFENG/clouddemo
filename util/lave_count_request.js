var unirest =  require("unirest");

var createapi = function(strUrl,callback){
    console.log("!!!!!!!!!!!!!!!!!");
    console.log("!!!!!!!!!!!!!!!!!");
    unirest.get(strUrl)
        .headers({
            'Content-Type': 'application/json',
            "Authorization":"2da349cbf8e8477961f8f0de64dbef2e"
        })
        .end(function (response) {
            console.log(response.body);
            var access = response.body;
            callback != undefined && callback(access);
            console.log("!!!!!!!!!!!!!!!!!");
            //console.log(response.body);
            console.log("!!!!!!!!!!!!!!!!!")
        });
};
module.exports = createapi;