app.controller('secretaryController', function ($scope, $mdDialog, $mdToast, $window, $http, api, $timeout) {
    $scope.patients = [];
    $scope.newpatient = {};
    $scope.patientConsultationsDialog = (ev, patient) => {
        $mdDialog.show({
            controller: PatientConsultationsController,
            templateUrl: 'app/secretary/consultationsDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                patient: patient
            },
            clickOutsideToClose: true
        })
    };

    $scope.editPatientDialog = (ev, patient) => {
        $mdDialog.show({
            controller: PatientEditController,
            templateUrl: 'app/secretary/editDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                patient: patient
            },
            clickOutsideToClose: true
        })
    };

    $scope.insert = () => {
        $scope.newpatient.birthDate = $scope.newpatient.birthDate.toISOString().slice(0, 10);
        $http.post(api + 'patients', $scope.newpatient)
            .then(function successCallback(response) {
                $mdDialog.hide();
            }, function errorCallback(response) {

                if (response.data.errors) {
                    let error = response.data.errors[0];
                    let errorMessage = error.property + ': ' + error.message;
                    $mdToast.show(
                        $mdToast.simple()
                            .content(errorMessage)
                            .hideDelay(2000)
                    );
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Invalid Data')
                            .hideDelay(3000)
                    );
                }
            });
    };

    (function tick() {
        $http.get(api + 'patients').success(function (data) {
            $scope.patients = data._embedded.patients;
            $timeout(tick, 3000);
        });
    })();
});

function PatientEditController($scope, patient, $http, $mdToast, $mdDialog, $mdToast) {
    $scope.patient = patient;

    $scope.update = () => {
        $scope.patient.birthDate = $scope.patient.birthDate.toISOString().slice(0, 10);
        $http.put(patient._links.self.href, patient)
            .then(function successCallback(response) {
                $mdDialog.hide();
            }, function errorCallback(response) {
                let error = response.data.errors[0];
                let errorMessage = error.property + ': ' + error.message;
                $mdToast.show(
                    $mdToast.simple()
                        .content(errorMessage)
                        .hideDelay(3000)
                );
            });
    }
}

function PatientConsultationsController($scope,patient, $http, api, $mdToast, $mdDialog, $timeout) {
    $scope.patient = patient;
    $scope.availableDoctors = [];
    $scope.consultations = [];
    $scope.newconsultation = {};

    (function tick() {
        $http.get(patient._links.consultations.href).success(function (data) {
            $scope.consultations = data._embedded.consultations;
            $scope.consultations.forEach(c => {
                $http.get(c._links.doctor.href).success(data => {
                    c.doctor = data;
                })
            });
        });
    })();

    (function tick() {
        $http.get(api + 'doctors/search/availables?availability=true').success(function (data) {
            $scope.availableDoctors = data._embedded.doctors;
        });
    })();

    $scope.insert = newconsultation =>{
        $scope.newconsultation.date = $scope.newconsultation.date.toISOString().slice(0, 10);
        $scope.newconsultation.patient = $scope.patient._links.self.href;
        $scope.newconsultation.status = 'NEW';
        $http.post(api+'consultations', newconsultation)
            .success(function (data) {
                var newdata = data;
                $http.get($scope.newconsultation.doctor).success(doc => {
                    newdata.doctor = doc;
                    $scope.consultations.push(data);
                });
            })

    };

    $scope.delete = consultation => {
        $http.delete(consultation._links.self.href, patient);
        let index = $scope.consultations.indexOf(consultation);
        $scope.consultations.splice(index, 1);
    }
}