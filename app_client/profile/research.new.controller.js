(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('researchNewCtrl', researchNewCtrl);

    researchNewCtrl.$inject = ['$scope', 'meanData', 'uploadData', '$q', '$filter', 'toast'];

    function researchNewCtrl ($scope, meanData, uploadData, $q, $filter, toast) {
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
        vm.research = {
            createdBy : "",
            name : "",
            description : "",
            type : "",
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

        meanData.getTypes()
            .error(function(err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data) {
                vm.types = data;
            });

        vm.checkResearchTags = function () {
            if (vm.research.tags && vm.research.tags.length < 3) {
                $scope.tagsError = "Tags are used for matching purpose, please include at least 3!"
            } else {
                $scope.tagsError = "";
                return true;
            }
        };

        vm.createMain = function () {
            if (vm.files != null) {
                if (vm.files.length > 5) {
                    toast.showToast('Error. You can upload a maximum of 5 files', 'text-danger');
                    return;
                } else {
                    for (var i = 0; i < vm.files.length; i++) {
                        if (!(/\.(pdf)$/i).test(vm.files[i].name)) {
                            toast.showToast('Error. Only .pdf files are accepted', 'text-danger');
                            return;
                        }
                    }
                }
            }
            if(vm.research.type != ""){
                meanData.addTags(vm.research.tags)
                    .error(function (err) {
                        toast.showToast('Error. ' + err.message, 'text-danger');
                    })
                    .success(function(data) {
                        vm.research.tags = data;
                        createResearch(vm.research);
                    });
            } else {
                toast.showToast('Error. You must choose research type', 'text-danger');
            }
        };

        var createResearch = function(research) {
            meanData.createResearch(research)
                .error(function (err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function (newResearch) {
                    if (vm.files) {
                        upload(vm.files, newResearch);
                    }
                    vm.research = {};
                    vm.research.tags = [];
                    $scope.researchNewForm.$setPristine();
                    $scope.researchNewForm.$setUntouched();
                    toast.showToast('Research created successfully', 'text-success');
                });
        };

        var upload = function (files, research) {
            files.forEach(function(file) {
                uploadData.uploadResearch(file, research)
                    .error(function(err) {
                        toast.showToast('Error. ' + err.message, 'text-danger');
                    })
                    .success(function() {
                        vm.files = null;
                    });
            });
        };
    }
})();