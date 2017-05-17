app.controller('adminController', function ($scope,$mdDialog, $window,$http ,api,$mdToast) {

    $scope.insertUserDialog = function(ev) {
        $mdDialog.show({
            controller: UserDialogController,
            templateUrl: 'app/admin/consultationsDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
            .then(function(newBook) {
                $window.location.reload();
            });
    };

    $scope.deleteRowCallback = function(rows){
        for (let row of rows) {

            $http.get(api+"users/search/deleteByUsername?username="+row[0].value)
                .then(function successCallback(response) {});
        }
        $mdToast.show(
            $mdToast.simple()
                .content('Deleted : '+rows.length)
                .hideDelay(3000)
        );
    };

    $scope.saveRowCallback = function(row){
        let user = {
            username: row[0],
            type: row[1],
            firstname: row[2],
            lastname: row[3]
        };
        $http.put(api+"users/"+row[0], user)
            .then(function successCallback(response) {
                $mdToast.show(
                    $mdToast.simple()
                        .content('Row changed')
                        .hideDelay(3000)
                );
            }, function errorCallback(response) {
                $mdToast.show(
                    $mdToast.simple()
                        .content('Invalid Data')
                        .hideDelay(3000)
                );
            });

    };


    $http.get(api+"users")
        .then(function(response) {
            $scope.users = response.data._embedded.users;
        });
});

function UserDialogController($scope, $mdDialog, $http, $mdToast) {
    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.insert = function(answer) {
        let newUser = {
            username: $scope.username,
            password: $scope.password,
            type: $scope.type,
            firstname: $scope.firstname,
            lastname: $scope.lastname
        };
        $http.post("http://localhost:8080/users", newUser)
            .then(function successCallback(response) {
                $mdDialog.hide();
            }, function errorCallback(response) {
                let elem = angular.element(document.getElementById('userInsertDialog'));
                $mdToast.show(
                    $mdToast.simple()
                        .content('Invalid')
                        .parent(elem)
                        .hideDelay(3000)
                );
            });
    };
}