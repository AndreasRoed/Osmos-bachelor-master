(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('projectCtrl', projectCtrl);

    projectCtrl.$inject = ['meanData', '$routeParams', 'toast'];

    function projectCtrl (meanData, $routeParams, toast) {
        var vm = this;

        meanData.getProfile()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.user = data;
            });

        meanData.showProject($routeParams.id)
            .error(function(err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data) {
                vm.projectData = data;
            });
    }
})();