(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('projectNewCtrl', projectNewCtrl);

    projectNewCtrl.$inject = ['meanData', '$q', '$filter', '$scope', 'toast'];

    function projectNewCtrl (meanData, $q, $filter, $scope, toast) {
        var vm = this;

        meanData.getProfile()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.user = data;
            });

        vm.searchText = null;
        vm.selectedItem = null;
        vm.project = {
            createdBy : "",
            name : "",
            description : "",
            region: "",
            industry: "",
            function: "",
            tags: []
        };

        vm.transformChip = function transformChip(chip) {
            if (angular.isObject(chip)) {
                return chip;
            }
            return { name: chip }
        };

        vm.querySearch = function querySearch (query) {
            var deferred = $q.defer();
            deferred.resolve( $filter('filter')(vm.tags, { name: query }));
            return deferred.promise;
        };

        meanData.getApprovedTags()
            .error(function(err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data) {
                vm.tags = data;
            });

        meanData.getRegions()
            .error(function(err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data) {
                vm.regions = data;
            });

        meanData.getIndustries()
            .error(function(err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data) {
                vm.industries = data;
            });

        meanData.getFunctions()
            .error(function(err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data) {
                vm.functions = data;
            });

        vm.checkProjectTags = function () {
            if (vm.project.tags && vm.project.tags.length < 3) {
                $scope.tagsError = "Tags are used for matching purpose, please include at least 3!"
            } else {
                $scope.tagsError = "";
                return true;
            }
        };

        vm.checkTags = function () {
            meanData.addTags(vm.project.tags)
                .error(function (err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function(data) {
                    vm.project.tags = data;
                    createProject(vm.project);
                });
        };

        var createProject = function(project) {
           if(vm.project.region == "" || vm.project.industry == "" || vm.project.function == ""){
               toast.showToast('Error. You must fill out region, industry and function', 'text-danger');
           } else {
               meanData.createProject(project)
                   .error(function (err) {
                       toast.showToast('Error. ' + err.message, 'text-danger');
                   })
                   .success(function () {
                       vm.project = {};
                       vm.project.tags = [];
                       $scope.projectNewForm.$setPristine();
                       $scope.projectNewForm.$setUntouched();
                       toast.showToast('Project created successfully', 'text-success');
                   });
           }
        };
    }
})();