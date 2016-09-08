//var http_key = require('../util/key_request');

var http_api = require('../util/create_api_request')

var http_key = require('../util/unirest_request')

var http_visit_api = require('../util/visit_api')

var data = require('../data')

var key = require('../key')



function Controllerindex(data,key){

    //this.data = data;

    //this.key = key;

}

Controllerindex.prototype.index= function(req,res){

     res.render ('index')

}
Controllerindex.prototype.logout= function(req,res){

    req.logout();

    res.redirect('/');
};

Controllerindex.prototype.dataBox = function(req,response){

    var strUrl = "http://139.129.221.136:8081/tyk/keys/create";
var a = function(cb){
    http_key(key,strUrl,function(datas){
        cb(datas)
    })
}
    a(function(qwe){
        console.log("++++++++++++++++++")
        console.log(qwe)
        console.log("++++++++++++++++++")
    })

};

Controllerindex.prototype.create_api= function(req,response){

    var strUrl = "http://139.129.221.136:8081/tyk/apis/";

    http_api(data,strUrl,function(datas){

        response.json (datas)

    })
};

Controllerindex.prototype.visit_api= function(req,response){

    http_visit_api(request, function(datas){

        response.json (datas)

    })
}
module.exports = new Controllerindex();