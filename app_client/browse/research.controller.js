(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('researchCtrl', researchCtrl);

    researchCtrl.$inject = ['meanData', '$routeParams', 'toast'];

    function researchCtrl (meanData, $routeParams, toast) {
        var vm = this;

        meanData.getProfile()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.user = data;
            });

        meanData.showResearch($routeParams.id)
            .error(function(err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data) {
                vm.researchData = data;
            });
    }
})();