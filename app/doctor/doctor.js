app.controller('doctorController', function ($scope, $http, $timeout, api, $stateParams, $mdToast) {
    $scope.doctor = $stateParams.doctor;

    $scope.accept = function(ev, consultation){

        $http.put(consultation._links.self.href, {
            status: 'DONE',
            description: consultation.description,
            date: consultation.date
        }).then(function (res) {
            consultation.status = 'DONE';
        })
    };

    $scope.onChange = function() {
        $http.put($scope.doctor._links.self.href, {
            firstname: $scope.doctor.firstname,
            lastname: $scope.doctor.lastname,
            available: $scope.doctor.available
        })
    };

    (function tick() {

        $http.get($stateParams.doctor._links.consultations.href).then(function (data) {
            $scope.consultations = data.data._embedded.consultations;

            function isNew(element, index, array) {
                return element.status === 'NEW';
            }
            for (c of $scope.consultations){
                $http.get(c._links.patient.href).then(function(response){
                    c.patient = response.data;
                });
            }
            if($scope.consultations.some(isNew)){
                $mdToast.show(
                    $mdToast.simple()
                        .content('New Consultations Arrived')
                        .hideDelay(1500)
                );
                $scope.consultations.forEach(c => {
                    if(c.status === 'NEW') {
                        $http.put(c._links.self.href, {
                            date: c.date,
                            status: 'WAITING',
                            description: c.description
                        })
                    }
                });
            }

            $timeout(tick, 5000);
        });

    })();
});