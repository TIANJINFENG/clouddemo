/**
 * Created by geek on 16-8-15.
 */
app.controller('myCtrl',function($scope,$interval,Logout) {
    $scope.theTime = new Date().toLocaleTimeString();
    $interval(function () {
        $scope.theTime = new Date().toLocaleTimeString();
    }, 1000);
    $scope.navigationMenu = function() {
        if (localStorage.getItem('AV/iqnghLfOqAtee5Bo1QAgsAC3-gzGzoHsz/currentUser') == null) {
            return true;
        }else {
            return false;
        }
    }
    $scope.logoutClear = function() {
        Logout.logout();
        //localStorage.removeItem('AppId');
    }
})