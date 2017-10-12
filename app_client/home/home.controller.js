(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$location', 'meanData', 'authentication', 'toast'];

    function homeCtrl ($location, meanData, authentication, toast) {
        var vm = this;

        if (authentication.isLoggedIn()) {
            meanData.getProfile()
                .error(function (err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function (data) {
                    vm.user = data;
                });
        }
        vm.showAcademic = function() { $location.path('register/academic'); };
        vm.showIndustrial = function() { $location.path('register/industrial'); };
    }
})();