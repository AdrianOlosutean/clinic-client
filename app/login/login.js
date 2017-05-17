app.controller('loginController', ($scope, $http, $rootScope ,$state, $mdToast,api) => {

    $scope.nav = "app/customnav.html";

    $rootScope.logout = function () {
        $state.go('login');
        $rootScope.isLoggedIn = false;
        $rootScope.user = "";
    };

    $scope.login = function () {
        $http.get(api + "users/search/login?username="+$scope.username+"&password="+$scope.password)
            .then(function successCallback(response) {
                let user = response.data;
                let type = user.type;
                if (type === 'SECRETARY')
                    $state.go('secretary');
                else if (type === 'DOCTOR') {
                    $http.get(api+'doctors/search/withUser?username='+user.username).then(function (data) {
                        $state.go('doctor', {doctor: data.data});
                    });
                }
                else if (type === 'ADMIN')
                    $state.go('admin');
            }, function errorCallback(response) {
                $mdToast.show(
                    $mdToast.simple()
                        .content('Invalid Credentials')
                        .hideDelay(1000)
                );
            });
    };
});