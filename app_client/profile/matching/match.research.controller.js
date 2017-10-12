(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('matchResearchCtrl', matchResearchCtrl);

    matchResearchCtrl.$inject = ['$routeParams', 'meanData', 'toast'];

    function matchResearchCtrl ($routeParams, meanData, toast) {
        var vm = this;

        meanData.getProfile()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.user = data;
            });

        vm.matchedProjects = [];

        meanData.getOneResearch($routeParams.id)
            .error(function(err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data) {
                vm.matchedResearch = data;
            });

        meanData.getMatchesResearch($routeParams.id)
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
                vm.getProject(vm.matchedObjects[i].projectID);
            }
        };

        vm.getProject = function(projectID) {
            meanData.getOneProject(projectID)
                .error(function(err) {})
                .success(function(data) {
                    vm.matchedProjects.push(data);
                });
        };

        vm.indexOfProject = function(id) {
            for (var i = 0; i < vm.matchedObjects.length; i++) {
                if (vm.matchedObjects[i].projectID == id) {
                    return i;
                }
            }
        };
    }
})();