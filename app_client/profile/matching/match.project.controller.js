(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('matchProjectCtrl', matchProjectCtrl);

    matchProjectCtrl.$inject = ['$routeParams', 'meanData', 'toast'];

    function matchProjectCtrl ($routeParams, meanData, toast) {
        var vm = this;

        meanData.getProfile()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.user = data;
            });

        vm.matchedResearch = [];

        meanData.getOneProject($routeParams.id)
            .error(function(err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data) {
                vm.matchedProject = data;
            });

        meanData.getMatchesProject($routeParams.id)
            .error(function(err) {
                vm.matchingError = err.message;
            })
            .success(function(data) {
                vm.matchedObjects = data;
                vm.getMatchingDataLoop();
            });

        meanData.getAllTags()
            .error(function(err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data) {
                vm.tags = data;
            });

        vm.getMatchingDataLoop = function() {
            for (var i = 0; i < vm.matchedObjects.length; i++) {
                vm.getResearch(vm.matchedObjects[i].researchID);
            }
        };

        vm.getResearch = function(researchID) {
            meanData.getOneResearch(researchID)
                .error(function(err) {})
                .success(function(data) {
                    vm.matchedResearch.push(data);
                });
        };

        vm.indexOfResearch = function(id) {
            for (var i = 0; i < vm.matchedObjects.length; i++) {
                if (vm.matchedObjects[i].researchID == id) {
                    return i;
                }
            }
        };
    }
})();