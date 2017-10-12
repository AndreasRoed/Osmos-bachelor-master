(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('researchAllCtrl', researchAllCtrl)
        .controller('deleteModalCtrl', deleteModalCtrl);

    researchAllCtrl.$inject = ['meanData', 'authentication', '$uibModal', '$location', 'toast', 'uploadData', '$filter', '$q'];
    deleteModalCtrl.$inject = ['$scope', '$uibModalInstance', 'researchToDelete'];

    function researchAllCtrl (meanData, authentication, $uibModal, $location, toast, uploadData, $filter, $q) {
        var vm = this;

        meanData.getProfile()
            .error(function (err) {
                toast.showToast("Error. " + err.message, "text-danger");
            })
            .success(function (data) {
                vm.user = data;
            });

        var getResearch = function() {
            meanData.getResearch(authentication.currentUser()._id)
                .error(function (err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function (data) {
                    vm.research = data;
                });
        };
        getResearch();

        meanData.getAllTags()
            .error(function(err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data) {
                vm.tags = data;
            });

        vm.transformChip = function transformChip(chip, tags) {
            if (angular.isObject(chip)) {
                for (var i = 0; i < tags.length; i++) {
                    if (tags[i]._id == chip._id) {
                        return chip = null;
                    }
                }
                return chip;
            }
            return { name: chip }
        };

        vm.querySearch = function querySearch (query) {
            var deferred = $q.defer();
            deferred.resolve( $filter('filter')(vm.tags, { name: query }));
            return deferred.promise;
        };

        vm.saveResearch = function (research, form) {
            meanData.addTags(research.tags)
                .error(function (err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function (data) {
                    research.tags = data;
                    vm.updateResearch(research, form);
                });
        };

        vm.updateResearch = function (research, form) {
            meanData.updateResearch(research)
                .error(function (err) {
                    toast.showToast("Error. " + err.message, "text-danger");
                })
                .success(function () {
                    form.$setPristine();
                    form.$setUntouched();
                    toast.showToast('Research updated successfully', 'text-success');
                });
        };

        vm.uploadDocument = function(files, research, numOfExistingFiles) {
            if (files) {
                if ((files.length + numOfExistingFiles) > 5) {
                    toast.showToast('Error. A maximum of 5 files are allowed per research', 'text-danger');
                    vm.files = null;
                } else {
                    for (var i = 0; i < files.length; i++) {
                        if (files[i].size > 20971520) {
                            toast.showToast('Error. Max file size is 20MB', 'text-danger');
                            return;
                        }
                        if (!(/\.(pdf)$/i).test(files[i].name)) {
                            toast.showToast('Error. Only .pdf files are accepted', 'text-danger');
                            return;
                        }
                    }
                    files.forEach(function(file) {
                        uploadData.uploadResearch(file, research)
                            .error(function(err) {
                                toast.showToast('Error. ' + err.message, 'text-danger');
                            })
                            .success(function() {
                                vm.files = null;
                                getResearch();
                                toast.showToast('Document successfully uploaded', 'text-success');
                            });
                    });
                }
            }
        };

        vm.uploadResearchPicture = function (file, research) {
            if (file) {
                if (file.size > 1048576) {
                    toast.showToast('Error. Image file size is to big', 'text-danger');
                }
                if (!(/\.(gif|jpg|jpeg|png)$/i).test(file.name)) {
                    toast.showToast('Error. Only .jpg, .jpeg, .png & .gif files are accepted', 'text-danger');
                } else {
                    var rand = Math.random().toString(36).substr(2, 6);
                    uploadData.uploadResearchPicture(file, research, rand)
                        .error(function (err) {
                            toast.showToast('Error. ' + err.message, 'text-danger');
                        })
                        .success(function () {
                            uploadData.createResearchThumb(file, research, rand);
                            meanData.updateResearch(research)
                                .error(function(err) {
                                    toast.showToast('Error. ' + err.message, 'text-danger');
                                })
                                .success(function () {
                                    toast.showToast('Research picture successfully uploaded', 'text-success');
                                    getResearch();
                                });
                        });
                }
            }
        };
        

        vm.deleteDocument = function (research, URL) {
            meanData.deleteDocument(research, URL)
                .error(function (err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function() {
                    removeDocument(research, URL);
                    toast.showToast('Document successfully deleted', 'text-success');
                });
        };
        
        var removeDocument = function(research, URL) {
            var index = vm.research.indexOf(research);
            if (index !== -1) {
                var indexURL = vm.research[index].documentURLs.indexOf(URL);
                if (indexURL !== -1) {
                    vm.research[index].documentURLs.splice(indexURL, 1);
                }
            }
        };

        vm.disableEnableResearch = function (research) {
            meanData.disableEnableResearch(research)
                .error(function(err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function() {
                    var index = vm.research.indexOf(research);
                    if (index !== -1) {
                        vm.research[index].active = !vm.research[index].active;
                    }
                });
        };
        
        var deleteResearch = function (research) {
            meanData.deleteResearch(research._id)
                .error(function (err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function() {
                    var index = vm.research.indexOf(research);
                    if (index !== -1) {
                        vm.research.splice(index, 1);
                        toast.showToast('Research successfully deleted', 'text-success');
                    }
                });
        };
        
        vm.openDeleteModal = function (research) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/common/templates/deleteResearchModal.html',
                controller: 'deleteModalCtrl',
                resolve: {
                    researchToDelete: research
                }
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    deleteResearch(research);
                }
            });
        };

        vm.showMatches = function(research) { $location.path('profile/matches/research/' + research._id); };

        vm.openDeleteDocumentModal = function (document, URL) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/common/templates/deleteDocumentModal.html',
                controller: 'deleteModalCtrl',
                resolve: {
                    researchToDelete: URL
                }
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    vm.deleteDocument(document, URL);
                }
            });
        };
    }

    function deleteModalCtrl ($scope, $uibModalInstance, researchToDelete) {
        $scope.research = researchToDelete.name;
        $scope.document = researchToDelete.name;
        $scope.ok = function () { $uibModalInstance.close(true); };
        $scope.cancel = function () { $uibModalInstance.dismiss(false); };
    }
})();