(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('adminResearchCtrl', adminResearchCtrl)
        .controller('deleteResearchModalCtrl', deleteResearchModalCtrl);

    adminResearchCtrl.$inject = ['meanData', '$uibModal', 'toast'];
    deleteResearchModalCtrl.$inject = ['$scope', '$uibModalInstance', 'researchToDelete'];

    function adminResearchCtrl (meanData, $uibModal, toast) {
        var vm = this;

        meanData.getProfile()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.user = data;
            });

        vm.itemsByPage = 10;
        vm.userNames = [];

        meanData.getAllResearch()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.tableAdminResearch = data;
            });

        meanData.getAllUsers()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.userNames = data;
            });

        vm.disableEnableResearch = function (research) {
            meanData.disableEnableResearch(research)
                .error(function(err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function() {
                    var index = vm.tableAdminResearch.indexOf(research);
                    if (index !== -1) {
                        vm.tableAdminResearch[index].active = !vm.tableAdminResearch[index].active;
                    }
                });
        };

        var deleteResearch = function (research) {
            meanData.deleteResearch(research._id)
                .error(function (err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function() {
                    var index = vm.tableAdminResearch.indexOf(research);
                    if (index !== -1) {
                        vm.tableAdminResearch.splice(index, 1);
                        toast.showToast('Research successfully deleted', 'text-success');
                    }
                });
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
            var index = vm.tableAdminResearch.indexOf(research);
            if (index !== -1) {
                var indexURL = vm.tableAdminResearch[index].documentURLs.indexOf(URL);
                if (indexURL !== -1) {
                    vm.tableAdminResearch[index].documentURLs.splice(indexURL, 1);
                }
            }
        };

        vm.thumbURL = function (url) { return url.substring(0, url.lastIndexOf('.')) + '_thumb.' + url.split('.')[url.split('.').length -1]; };

        vm.getUserName = function (id) {
            for (var i = 0; i < vm.userNames.length; i++) {
                if (vm.userNames[i]._id == id) {
                    return vm.userNames[i].companyname;
                }
            }
        };

        vm.openDeleteModal = function (research) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/common/templates/deleteResearchModal.html',
                controller: 'deleteResearchModalCtrl',
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

        vm.openDeleteDocumentModal = function (document, URL) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/common/templates/deleteDocumentModal.html',
                controller: 'deleteResearchModalCtrl',
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

    function deleteResearchModalCtrl ($scope, $uibModalInstance, researchToDelete) {
        $scope.research = researchToDelete.name;
        $scope.document = researchToDelete.name;
        $scope.ok = function () { $uibModalInstance.close(true); };
        $scope.cancel = function () { $uibModalInstance.dismiss(false); };
    }
})();