/**
 * Created by geek on 16-8-29.
 */
app.controller('appItemsController',function($scope,exchangeLeancloud,promptBox,$mdDialog) {
    var app_Id = localStorage.getItem('AppId');



    var api_Json = new AV.Query('Api');
    api_Json.get('57c533d379bc440063f1375f').then(function (data) {
        $scope.api_Json = data.attributes.api_json;
    }, function (error) {
       console.log("err:"+error);
    });


    //var token = new AV.Query('App');
    //token.get(app_Id).then(function (data) {
    //    $scope.token = data.attributes.app_key;
    //}, function (error) {
    //    console.log("err:"+error);
    //})


    $scope.ggggg = function() {
        var paramsJson = {
            appID: app_Id
        };
        exchangeLeancloud.call('open_relation_user',paramsJson,function(data) {
            $scope.actors = data;
        });
    }


    $scope.restriction = function (userId,ev) {
            // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('是否给已选用户添加权限？')
            .textContent('')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('添加权限')
            .cancel('取消');

            $mdDialog.show(confirm).then(function(result) {
                //$scope.status = 'You decided to name your dog ' + result + '.';
                var paramsJson = {
                    userID: userId,
                    appID: app_Id
                };
                exchangeLeancloud.call('relation_app_acl',paramsJson,function(data){
                    promptBox.prompt(data);
                })
            }, function() {
                //$scope.status = 'You didn\'t name your dog.';
            });
    }


    $scope.addCoagent = function() {
        if($scope.coagent) {
            var paramsJson = {
                username: $scope.coagent,
                appID: app_Id
            };
            exchangeLeancloud.call('relation_user',paramsJson,function(data) {
                promptBox.prompt(data);
                $scope.coagent = '';
            });
        }
    }
})