/**
 * Created by geek on 16-8-16.
 */
app.controller('regController',function($scope,$interval,Register){
    $scope.registered = function() {
        //$scope.namewarn = !$scope.username?  '用户名不能为空':'';
        //$scope.passwordwarn = !$scope.password? '密码不能为空':'';
        //$scope.repeatwarn = $scope.password!=$scope.repeatPassword? '密码不一致':'';
        //$scope.emailwarn = !$scope.email? '邮箱不能为空':'';
        //if ($scope.username && $scope.password == $scope.repeatPassword && $scope.email) {
        //    Register.register($scope.username,$scope.password,$scope.email);
        //}

        AV.User.signUpOrlogInWithMobilePhone($scope.phone, $scope.identifying).then(function (success) {
            // 成功
            console.log(success);
        }, function (error) {
            // 失败
            console.log(error);
        });
    }


    $scope.yanzheng = function() {
        AV.User.verifyMobilePhone($scope.identifying).then(function(){
            //验证成功
            console.log('success')
        }, function(err){
            //验证失败
            console.log(err);
        });
    }

    $scope.fasong = function() {
        AV.Cloud.requestSmsCode($scope.phone).then(function (   ) {
        }, function (error) {
        });
    }

});