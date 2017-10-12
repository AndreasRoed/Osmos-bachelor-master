(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('profileCtrl', profileCtrl);

    profileCtrl.$inject = ['meanData', '$routeParams', 'country', 'toast'];

    function profileCtrl (meanData, $routeParams, country, toast) {
        var vm = this;

        meanData.getProfile()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.user = data;
            });

        meanData.showProfile($routeParams.id)
            .error(function(err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data) {
                vm.profileData = data;
            });

        vm.getCountry = function (code) {
            for (var i = 0; i < country.length; i++) {
                if (country[i].code === code) {
                    return country[i].name;
                }
            }
        };
    }
})();