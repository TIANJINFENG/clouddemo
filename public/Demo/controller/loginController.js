/**
 * Created by geek on 16-8-15.
 */
app.controller('loginController',function($scope,Login) {
    $scope.Login = function() {
        //$scope.loginNamewarn = !$scope.loginUsername?  '请输入用户名':'';
        //$scope.loginPasswordwarn = !$scope.loginPassword? '请输入密码':'';
        if($scope.loginUsername && $scope.loginPassword) {
            Login.login($scope.loginUsername,$scope.loginPassword);

        }
    }
})