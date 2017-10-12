(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('searchCtrl', searchCtrl);

    searchCtrl.$inject = ['$location', '$routeParams', 'meanData', 'toast'];

    function searchCtrl ($location, $routeParams, meanData, toast) {
        var vm = this;

        meanData.getProfile()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.user = data;
            });

        vm.searchString = $routeParams.searchString;
        vm.searchStringTemp = $routeParams.searchString;

        meanData.getUsersSearch()
            .error(function(err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data) {
                vm.dataArray = data;
            });

        vm.searchFilter = function (obj) {
            var re = new RegExp(vm.searchString, 'i');
            return !vm.searchString || re.test(obj.name) || re.test(obj.companyname);
        };

        vm.submitSearch = function() { vm.searchString = vm.searchStringTemp; };
        vm.showProfile = function(id) { $location.path('/browse/user/' + id); };
    }
})();