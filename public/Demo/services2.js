/**
 * Created by geek on 16-8-19.
 */
app.factory('Register',function($location) {
    var register = function(username,password,email) {
        var user = new AV.User();
        user.setUsername(username);
        user.setPassword(password);
        user.setEmail(email);
        return user.signUp().then(function (loginedUser) {
            return $location.path("/myApp");
        }, (function (error) {
            console.log('err'+error)
        }));
    }
    return {register:register};
}).factory('Login',function($location) {
    var login = function(username,password,cb) {
        cb = cb ||function() {}
        return AV.User.logIn(username, password).then(function (loginedUser) {
            cb(loginedUser)
            return $location.path("/myApp");
        }, function (error) {
            alert('用户名或密码错误')
        });
    }
    return {login:login};
}).factory('Logout',function($location) {
    var logout = function() {
        AV.User.logOut();
        var currentUser = AV.User.current();
        if (currentUser) {
            console.log('hehe')
        }
        else {
            console.log('666')
        }
    }
    return {logout:logout};
}).factory('exchangeLeancloud',function() {

    var call = function(function_name,paramsJson,cb) {
        cb = cb || function() {}
        AV.Cloud.run(function_name, paramsJson, {
            success: function(data) {
                cb(data)
            },
            error: function(err) {
                console.log('err:'+err)
            }
        });
    }
    var find = function (ObjectName,UserId,cb) {
        cb = cb || function() {}
        var apps = AV.Object.createWithoutData(ObjectName, UserId);
        var relation = apps.relation('containedApps');
        var query = relation.query();
        query.find().then(function (results) {
            cb(results)
        }, function (error) {
            console.log("err"+error)
        });
    }

    return {call:call,find:find};
}).factory('promptBox',function($mdDialog) {
    var prompt = function(data) {
        $mdDialog.show(
            $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('提示')
                .textContent(data)
                .ariaLabel('Offscreen Demo')
                .ok('确认')
                // Or you can specify the rect to do the transition from
                .openFrom({
                    top: -50,
                    width: 30,
                    height: 80
                })
                .closeTo({
                    left: 1500
                })
        );
    }
    return {prompt:prompt};
})