/**
 * Created by geek on 16-9-2.
 */

app.controller('regLogin',function($scope,Logout) {
    $scope.navigationMenu = function() {
        if (localStorage.getItem('AV/iqnghLfOqAtee5Bo1QAgsAC3-gzGzoHsz/currentUser') == undefined) {
            return true;
        }else {
            return false;
        }
    }
    $scope.logoutClear = function() {
        Logout.logout();
        localStorage.removeItem('AppId');
    }
    $scope.save_juadge = function() {
        localStorage.setItem('Juadge','true');
    }
    $scope.rem_juadge = function() {
        localStorage.removeItem('Juadge');
    }
    $scope.regLogin = function() {
        if(localStorage.getItem('Juadge') == null){
            return false;
        }else {
            return true;
        }
    }
    $scope.juadgeLogin = function() {
        if($scope.loginPhone == undefined || $scope.loginVerification == undefined){
            $scope.aaa = true;
        }else {
            $scope.aaa = false;
            AV.User.logInWithMobilePhoneSmsCode($scope.loginPhone, $scope.loginVerification).then(function (success) {
                console.log(success)
            }, function (error) {
                console.log('err')
            });
        }
    }
    $scope.transmissionLogin = function () {
        if($scope.loginPhone){
            AV.User.requestLoginSmsCode($scope.loginPhone).then(function (success) {
            }, function (error) {
            });
        }
    }

    $scope.transmission = function() {
        if($scope.PhoneNumber){
            AV.Cloud.requestSmsCode($scope.PhoneNumber).then(function () {
            }, function (error) {
            });
        }
    }
    $scope.registered = function() {
        AV.User.signUpOrlogInWithMobilePhone($scope.PhoneNumber, $scope.Verification).then(function (success) {
            // 成功
            console.log(success);
        }, function (error) {
            // 失败
            console.log(error);
        });
    }
})