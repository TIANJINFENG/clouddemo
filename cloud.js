var AV = require('leanengine');

var http_api = require('./util/create_api_request')

var http_visit_api = require('./util/visit_api')

var data = require('./data')

var key = require('./key')

var strUrl = "http://139.129.221.136:8081/tyk/keys/create";

//var strUrl = "http://192.168.1.31:8080/tyk/keys/create";

var App = AV.Object.extend('App');


/*function app_acl(request,cb){
  cb = cb||function() {}
  http_api(key,strUrl, function(datas) {
  var app = new App();
  var roleQuery = new AV.Query(AV.Role);
  roleQuery.equalTo('name', 'Administrator');
  roleQuery.first().then(function (adminRole) {
    var userRelation = adminRole.relation('users');
    userRelation.query().find().then(function (userList) {
     // app.set('app_name',request.params.app_name);
      app.set('app_name',"niaho")
      app.set("app_key",datas)
      var acl = new AV.ACL();
      acl.setPublicReadAccess(true);

      acl.setWriteAccess(request.currentUser,true);

      acl.setWriteAccess(userList[0],true);

      app.setACL(acl);


     cb = (app)

    }, function (error) {

    })
  }, function (error) {

  })
  })
}*/


AV.Cloud.define('juadge', function(request, response) {
  var user = request.currentUser;
  var relation = user.relation('containedApps');
  var query = relation.query();
  query.find({
    success: function (all_apps) {
      if(all_apps.length < 2 ) {
        console.log('1！！！！！！！')
            //app_acl(request,function(app){
        http_api(key,strUrl,function(datas) {
          var app = new App();
          var roleQuery = new AV.Query(AV.Role);
          roleQuery.equalTo('name', 'Administrator');
          roleQuery.first().then(function (adminRole) {
                var userRelation = adminRole.relation('users');
                userRelation.query().find().then(function (userList) {
                  app.set('app_name',request.params.app_name);
                  app.set("app_key",datas)
                  //app.set('user_id',)
                  var acl = new AV.ACL();
                  acl.setPublicReadAccess(true);
                  acl.setWriteAccess(request.currentUser,true);
                  acl.setWriteAccess(userList[0],true);
                  app.setACL(acl);
                app.save().then(function (results) {
                  var relation = user.relation('containedApps');
                  relation.add(results);
                  user.save()
                  //response.success(results)
                  response.success("创建成功")
                })
           // })
      }, function (error) {})
        }, function (error) {})
        })
      }
      else{response.success("创建已达上限！！！");}
    },
    error:function (){
      response.error('');
    }
  });
})

AV.Cloud.define('get_api', function(request, response) {
  var Api = AV.Object.extend('Api');
  var api = new Api();
  var roleQuery = new AV.Query(AV.Role);
  roleQuery.equalTo('name', 'Administrator');
  roleQuery.first().then(function (adminRole) {
    var userRelation = adminRole.relation('users');
    userRelation.query().find().then(function (userList) {
      api.set('api_json',data)
      var acl = new AV.ACL();
      acl.setPublicReadAccess(true);
      acl.setWriteAccess(userList[0],true);
      api.setACL(acl);
      api.save(
          {
            success: function (results) {
              response.success(results)
            },
            error:function (){
              response.error('');
            }
          })
    }, function (error) {})
  }, function (error) {})
});
AV.Cloud.define('create_api', function(request, response) {
  var Api = AV.Object.extend('Api');
  var api = new Api();
  var roleQuery = new AV.Query(AV.Role);
  roleQuery.equalTo('name', 'Administrator');
  roleQuery.first().then(function (adminRole) {
    var userRelation = adminRole.relation('users');
    userRelation.query().find().then(function (userList) {
      api.set('api_json',data)
      var acl = new AV.ACL();
      acl.setPublicReadAccess(true);
      acl.setWriteAccess(userList[0],true);
      api.setACL(acl);
      api.save(
          {
            success: function (results) {
              response.success(results)
            },
            error:function (){
              response.error('');
            }
          })
    }, function (error) {})
  }, function (error) {})
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
AV.Cloud.define('relation_user', function(request, response) {
  var query = new AV.Query('_User');
  query.equalTo('username', request.params.username);
  query.find({
    success: function (results) {
      var user = AV.Object.createWithoutData('_User',results[0].id);
      var app = AV.Object.createWithoutData('App', request.params.app_id);
      var acl = new AV.ACL();
      acl.setPublicReadAccess(true);
      acl.setWriteAccess(results[0],true);
      app.setACL(acl);
      var relation = app.relation('containedUser');
      relation.add(user);
      app.save()
      response.success("关联成功")
    },
    error:function (){
      response.error('');
    }
  })
});



module.exports = AV.Cloud;
