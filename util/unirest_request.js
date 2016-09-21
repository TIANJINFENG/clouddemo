/*var unirest = require('unirest');

unirest.post('http://localhost:3000/users')
 .headers({'Accept': 'application/json'})
 .send({name:"神",password:1234})
 .end(function (response) {
 console.log(response.body);
 });
/*unirest.post('http://mockbin.com/request')
 .headers({'Content-Type': 'multipart/form-data'})
 .field('parameter', 'value') // Form field
 .attach('file', '/tmp/file') // Attachment
 .end(function (response) {
 console.log(response.body);
 });*/
var unirest =  require("unirest");

var createapi = function(data,strUrl,callback){
unirest.post(strUrl)
    .headers({
     'Content-Type': 'application/json',
     "Authorization":"2da349cbf8e8477961f8f0de64dbef2e"
    })
    .send(JSON.stringify(data))
    .end(function (response) {
     var access = response.body;
     callback != undefined && callback(access.key_id);
        console.log("!!!!!!!!!!!!!!!!!");
        console.log(response.body);
        console.log("!!!!!!!!!!!!!!!!!")
    });
};
module.exports = createapi;