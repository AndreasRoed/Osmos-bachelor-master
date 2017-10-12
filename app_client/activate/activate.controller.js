(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('activateCtrl', activateCtrl)
        .controller('confirmationCtrl', confirmationCtrl);

    activateCtrl.$inject = ['$location', 'authentication', '$routeParams', '$timeout'];
    confirmationCtrl.$inject = ['$location', '$routeParams'];

    function activateCtrl ($location, authentication, $routeParams, $timeout) {
        var vm = this;

        authentication
            .activateAccount($routeParams.token)
            .error(function(err) {
                vm.activationError = err.message;
                $timeout(function() { $location.path('/') }, 5000);
            })
            .success(function() {
                $timeout(function() { $location.path('profile/me') }, 2500);
            });
    }

    function confirmationCtrl ($location, $routeParams) {
        var vm = this;
        vm.email = $routeParams.email;

        vm.backToOsmos = function() {
            $location.path('/');
        };
    }
})();