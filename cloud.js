var AV = require('leanengine');

var md5 = require('js-md5');

var request_key = require('./util/unirest_request');

var request_lave_count = require('./util/lave_count_request');

var passport = require('./passport/passport');

//var LocalStrategy = require('passport-local').Strategy;

var http_visit_api = require('./util/visit_api');

var data = require('./data')

var key = require('./key');

var Tyk_count = require('./models/tyk.js');

var Tyk_api = require('./models/api_id.js');

var App = AV.Object.extend('App');

var limit_app = function(results,app,request,user,response){
   for (var i = 0; i <= results.length; i++) {
       if (i == results.length) {
         app.set('app_name', request.params.app_name);
         app.set('status','未审核');
         app.set('number', 1);
         app.set('user_id',[]);
         app.set('user_name',request.currentUser.attributes.username)
         console.log('###############3！');
         app_acl(request.currentUser,function(acl) {
           app.setACL(acl);
           app.save().then(function (results) {
             var relation = user.relation('containedApps');
             relation.add(results);
             user.save();
             response.success("创建成功")
           }),function(error){response.error('')};
         })
       }
       if (request.params.app_name == results[i].attributes.app_name) {
         break;
       }
     }
};

var get_administrator = function(cb){
  var roleQuery = new AV.Query(AV.Role);
  roleQuery.equalTo('name', 'Administrator');
  roleQuery.first().then(function (adminRole) {
    var userRelation = adminRole.relation('users');
    userRelation.query().find().then(function (userList) {
      cb(userList[0])
    }, function (error) {})
  }, function (error) {})
};

var app_acl = function(currentuser,cb){
  get_administrator(function(administrator){
    var acl = new AV.ACL();
    acl.setPublicReadAccess(true)
    acl.setWriteAccess(currentuser, true);
    acl.setWriteAccess(administrator, true);
    cb(acl);
    console.log("$$$$$$$$$$$$$$$$$$$")
  })
};

AV.Cloud.define('registerSmsCode', function(request, response){
  AV.Cloud.requestSmsCode(request.params.username).then(function (success) {
    response.success("已发送")
  }, function (error) {
  });
});

AV.Cloud.define('register', function(request, response){
  AV.Cloud.signUpOrlogInWithMobilePhone(request.params.username,request.params.smscode).then(function (success) {
    response.success("登录成功")
  }, function (error) {
  });
});

AV.Cloud.define('LoginSmsCode', function(request, response) {
  AV.User.requestLoginSmsCode(request.params.username).then(function (success) {
    response.success("已发送")
  }, function (error) {
  });
});

AV.Cloud.define('Login', function(request, response) {
    response.log('登录成功')
});

AV.Cloud.define('Logout', function(request, response) {
  AV.User.logOut();
  var currentUser = AV.User.current();
  if(currentUser){
  response.success('失败！')
  }
  else{response.success('成功！')}
});

AV.Cloud.define('juadge', function(request, response) {
    get_administrator(function(administrator){
      var user = request.currentUser;
      console.log(user)
          if(user.attributes.username == administrator.attributes.username){
            response.success("管理员")
          }
          else{ response.success("用户")}

  });
});

AV.Cloud.define('create_app', function(request, response) {
  var user = request.currentUser;
  var relation = user.relation('containedApps');
  var query = relation.query();
  query.find().then(function (all_apps) {
    if(all_apps.length < 2 ) {
      var app = new App();
      var query = new AV.Query('App');
      query.equalTo('number', 1);
      query.find().then(function (results) {
        limit_app(results,app,request,user,response);
        response.success("名字已存在")
      }, function (error) {
      });
    }
    else{
      response.success("创建已达上限！！！");
    }
  }, function (){
    response.error('');
  });
});

AV.Cloud.define('get_app', function(request, response) {
  var user = request.currentUser;
  console.log(user)
  var relations = user.relation('containedApps');
  var query = relations.query();
  query.find({
    success: function (results) {
      response.success(results)
    },
    error:function (){
      response.error('');
    }
  }, function (error) {
  });
});

AV.Cloud.define('show_relation_app', function(request, response) {
  var currentuser = request.currentUser;
  var user = AV.Object.createWithoutData('_User', currentuser.id);
  var query = new AV.Query('App');
  query.equalTo('containedUser', user);
  query.find().then(function (results) {
    response.success(results)
  }, function (error) {
  });
});

AV.Cloud.define('delete_app', function(request, response) {
  var todo = AV.Object.createWithoutData('App',request.params.objectId);
  todo.destroy(
      {
        success: function (success) {
          response.success("删除成功")
        },
        error:function (){
          response.error('');
        }
      })
});

AV.Cloud.define('relation_user', function(request, response) {
  var query = new AV.Query('_User');
  query.equalTo('username', request.params.username);
  query.find({
    success: function (results) {
      var user = AV.Object.createWithoutData('_User',results[0].id);
      var query = new AV.Query('App');
      query.get(request.params.appID).then(function (app) {
        var ready_relation_users =  app.get('user_id');
        ready_relation_users.push(results[0].id);
        var ready_change_app = AV.Object.createWithoutData('App', request.params.appID);
        ready_change_app.set("user_id",ready_relation_users);
        var relation = ready_change_app.relation('containedUser');
        relation.add(user);
        ready_change_app.save();
        response.success("添加用户成功！")
      },function(error){})
    },
    error:function (){
      response.error('');
    }
  })
});

AV.Cloud.define('relation_app_acl', function(request, response) {
  app_acl(request.currentUser,function(acl){
    var query = new AV.Query('App');
    query.get(request.params.appID).then(function (app) {
      var ready_change_app_acl = AV.Object.createWithoutData('App', request.params.appID);
      var userid = app.get('user_id');
      for(i=0;i<userid.length;i++){
        var user = AV.Object.createWithoutData('_User',userid[i]);
        //acl.setReadAccess(userId,true);
        acl.setWriteAccess(user, true);
      }
      ready_change_app_acl.setACL(acl);
      ready_change_app_acl.save().then(function(){
        response.success("权限设置成功")
      });
    });
  });
});

AV.Cloud.define('show_relation_user', function(request, response) {
  var app = AV.Object.createWithoutData('App', request.params.appID);
  var relation = app.relation('containedUser');
  var query = relation.query();
  query.find().then(function (results) {
    var relation_user = [];
      for(i=0;i<results.length;i++){
        if(results[i].id != request.currentUser.id){
          relation_user.push(results[i]);
        }
      }
    response.success(relation_user);
    }, function (){response.error('');
  });
});

AV.Cloud.define('get_api', function(request, response) {
  var Api = AV.Object.extend('Api');
  var api = new Api();
  get_administrator(function(administrator){
      api.set('api_json', data)
      var acl = new AV.ACL();
      acl.setPublicReadAccess(true);
      acl.setWriteAccess(administrator, true);
      api.setACL(acl);
      api.save().then(function(results){
        response.success(results)
      },function(error){
      })
    })
});

AV.Cloud.define('create_api', function(request, response) {
  //var Api = AV.Object.extend('Api');
  //var api = new Api();
  //get_administrator(function(administrator){
    var strUrl = "http://139.129.221.136:3000/api/apis/";
    request_key(key,strUrl,function(datas) {
      console.log(datas)
      response.success(datas)
      //api.set('api_json', data);
      //api.set('number', 1);
      //var acl = new AV.ACL();
      //acl.setPublicReadAccess(true);
      //acl.setWriteAccess(administrator, true);
      //api.setACL(acl);
      //api.save(
      //    {
      //      success: function (results) {
      //        response.success(results)
      //      },
      //      error: function () {
      //        response.error('');
      //      }
      //    })
    });
  //})
});

AV.Cloud.define('delete_api', function(request, response) {
  var strUrl = "http://139.129.221.136:3000/api/apis/";
  http_visit_api(strUrl,'DELETE',function(datas) {
    console.log(datas)
    response.success(datas)
  });
});

AV.Cloud.define('open_api', function(request, response) {
  var query = new AV.Query('Api');
  query.equalTo("objectId",'57c533d379bc440063f1375f')
  query.find({
    success: function (results) {
      response.success(results)
    },
    error:function (){
      response.error('');
    }
  }, function (error) {
  });
});

AV.Cloud.define('check', function(request, response) {
  var app = AV.Object.createWithoutData('App',  request.params.appId);
  app.set('status','checking')
  app.save().then(function(results){
    response.success("checking")
  },function(error){response.error('错误信息')});
});

AV.Cloud.define('get_check', function(request, response) {
  var check = new AV.Query("App");
  check.equalTo("number",1);
  check.find().then(function(results){
    response.success(results)
  },function(error){console.log(error)})
});

AV.Cloud.define('consent_check', function(request, response) {
  var strUrl = "http://139.129.221.136:3000/api/keys/";
  request_key(key,strUrl,function(datas) {
    var app = AV.Object.createWithoutData('App', request.params.appId);
    app.set('status','success');
    app.set("app_key",datas);
    app.save().then(function(results){
      response.success('success')
    },function(error){})
  });
});

AV.Cloud.define('no_consent_check', function(request, response) {
  var app = AV.Object.createWithoutData('App', request.params.appId);
  app.set('status','resubmitted')
  app.save().then(function(results){
      response.success('resubmitted')
    },function(error){})
});

/*var  date=new Date();
var k = new Date()
k.setHours(18)
k.setMinutes(5)
k.setSeconds(0)
//console.log(k-date)
setTimeout(freez_time(),10000)

function freez_time(){

  //console.log("123")
  setInterval(function(){console.log("Hello world");},500)

}*/

AV.Cloud.define('add_api', function(request, response) {
  var access_time = new Date();
  var api_time = access_time.toLocaleDateString()
  var app = AV.Object.createWithoutData('App', '57c8ed0f75c4cd1f675f2746');
 // var api_items = [];
  app.set('b0398b95563741c07b52242f1a3c55c5', [{api_time: api_time,count:0}])
  app.save().then(function(results){
    response.success(results)
  },function(error){})
});

AV.Cloud.define('access_api', function(request, response) {
  var strUrl = "http://139.129.221.136:8081/test-api/";
  //console.log('@@@@@@@@@@@@@@@@@@@@@@')
   http_visit_api(strUrl,"GET", request.params.token, function (datas) {
  //http_visit_api(strUrl,"GET",'57d249276369210eef0000035e37362f501d4dba6039a7cc8e8cda98', function (datas) {
    console.log(datas)
      response.success(datas)
    })
});

AV.Cloud.define('get_lave_count', function(request, response) {
  Tyk_api.get(request.params.mongo_id, function (err, tyk_api) {
    if (err) {
      tyk_api = [];
    }
    var api_id = tyk_count.api_id
    var strUrl = "http://139.129.221.136:3000/api/apis/"+api_id+"/keys/"+request.params.token;
    // var strUrl = "http://139.129.221.136:3000/api/apis/"+'5ffd529e30934c68412ef12f3b186c1e'+
    // "/keys/"+'57d249276369210eef0000035e37362f501d4dba6039a7cc8e8cda98';
    request_lave_count(strUrl,function (datas) {
      console.log(datas);
      response.success(datas.data.quota_remaining)
    })
  });
});

AV.Cloud.define('mongodb', function(request, response) {
  Tyk_count.get(request.params.date, function (err, tyk_count) {
    if (err) {
      tyk_count = [];
    }
    response.success(tyk_count)
  });
});

module.exports = AV.Cloud;
