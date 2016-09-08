/**
 * Created by geek on 16-8-16.
 */
app.controller('createAppController',function($scope,exchangeLeancloud,promptBox) {
    var user_items = JSON.parse(localStorage.getItem('AV/iqnghLfOqAtee5Bo1QAgsAC3-gzGzoHsz/currentUser'));

    $scope.addApp = function () {
        if($scope.appName){

            var paramsJson = {
                app_name: $scope.appName
            };
            exchangeLeancloud.call('juadge',paramsJson,function(data) {
                promptBox.prompt(data);
                $scope.appName = '';
            });

        }
    }

})