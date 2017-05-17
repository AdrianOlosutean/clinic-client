let app = angular.module('clinic',['ngMaterial','ngMessages','ui.router', 'ngSanitize','mdDataTable','ngMdIcons']);

app.constant('api','http://localhost:8080/');

app.config(( $stateProvider, $urlRouterProvider) => {

    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: "app/login/login.html"
        })
        .state('admin', {
            url: '/admin',
            templateUrl: "app/admin/admin.html"
        })
        .state('secretary', {
            url: '/secretary',
            templateUrl: "app/secretary/secretary.html"
        })
        .state('doctor', {
            url: '/doctor',
            templateUrl: "app/doctor/doctor.html",
            params: {
                doctor: null
            }
        });
});