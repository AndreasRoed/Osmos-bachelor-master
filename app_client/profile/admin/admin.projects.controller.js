(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('adminProjectsCtrl', adminProjectsCtrl)
        .controller('deleteProjectModalCtrl', deleteProjectModalCtrl);

    adminProjectsCtrl.$inject = ['meanData', '$uibModal', 'toast'];
    deleteProjectModalCtrl.$inject = ['$scope', '$uibModalInstance', 'projectToDelete'];

    function adminProjectsCtrl (meanData, $uibModal, toast) {
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

        meanData.getAllProjects()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.tableAdminProject = data;
            });

        meanData.getAllUsers()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.userNames = data;
            });

        vm.disableEnableProject = function (project) {
            meanData.disableEnableProject(project)
                .error(function(err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function() {
                    var index = vm.tableAdminProject.indexOf(project);
                    if (index !== -1) {
                        vm.tableAdminProject[index].active = !vm.tableAdminProject[index].active;
                    }
                });
        };

        var deleteProject = function (project) {
            meanData.deleteProject(project._id)
                .error(function (err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function() {
                    var index = vm.tableAdminProject.indexOf(project);
                    if (index !== -1) {
                        vm.tableAdminProject.splice(index, 1);
                        toast.showToast('Project successfully deleted', 'text-success');
                    }
                });
        };

        vm.thumbURL = function (url) { return url.substring(0, url.lastIndexOf('.')) + '_thumb.' + url.split('.')[url.split('.').length -1]; };

        vm.getUserName = function (id) {
            for (var i = 0; i < vm.userNames.length; i++) {
                if (vm.userNames[i]._id == id) {
                    return vm.userNames[i].firstname + " " + vm.userNames[i].lastname;
                }
            }
        };

        vm.openDeleteModal = function (project) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/common/templates/deleteProjectModal.html',
                controller: 'deleteProjectModalCtrl',
                resolve: {
                    projectToDelete: project
                }
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    deleteProject(project);
                }
            });
        };
    }

    function deleteProjectModalCtrl ($scope, $uibModalInstance, projectToDelete) {
        $scope.project = projectToDelete.name;
        $scope.ok = function () { $uibModalInstance.close(true); };
        $scope.cancel = function () { $uibModalInstance.dismiss(false); };
    }
})();