/**
 * Created by geek on 16-8-23.
 */
app.controller('myAppController',function($scope,exchangeLeancloud,promptBox,$timeout,$location) {

    exchangeLeancloud.call('get_app',{paramsJson:'paramsJson'},function(data) {
        $scope.results = data;
    });

    $timeout(function() {
        document.myForm.button1.click();
    }, 500);

    $scope.toAppItems = function(AppId) {
        localStorage.setItem('AppId',AppId);
        $location.path("/App");
    }

    $scope.deleteApp = function (AppId) {
        var paramsJson = {
            objectId: AppId
        };
        exchangeLeancloud.call('delete_app',paramsJson,function(data) {
            promptBox.prompt(data);
        })
        document.getElementById(AppId).remove();
    }


})