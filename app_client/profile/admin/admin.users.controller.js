(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('adminUsersCtrl', adminUsersCtrl)
        .controller('deleteUserModalCtrl', deleteUserModalCtrl);


    adminUsersCtrl.$inject = ['meanData', '$uibModal', 'toast'];
    deleteUserModalCtrl.$inject = ['$scope', '$uibModalInstance', 'userToDelete'];

    function adminUsersCtrl (meanData, $uibModal, toast) {
        var vm = this;

        meanData.getProfile()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.user = data;
            });

        vm.itemsByPage = 10;

        meanData.getAllUsers()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.tableAdminUsers = data;

            });

        vm.disableEnableUser = function (user) {
            meanData.disableEnableUser(user)
                .error(function(err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function() {
                    var index = vm.tableAdminUsers.indexOf(user);
                    if (index !== -1) {
                        vm.tableAdminUsers[index].disabled = !vm.tableAdminUsers[index].disabled;
                    }
                });
        };

        vm.adminUser = function(user) {
            meanData.adminUser(user)
                .error(function (err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function() {
                    var index = vm.tableAdminUsers.indexOf(user);
                    if (index !== -1) {
                        vm.tableAdminUsers[index].admin = !vm.tableAdminUsers[index].admin;
                    }
                });
        };

        var deleteUser = function(user) {
            meanData.deleteUser(user._id)
                .error(function(err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function() {
                    var index = vm.tableAdminUsers.indexOf(user);
                    if (index !== -1) {
                        vm.tableAdminUsers.splice(index, 1);
                        toast.showToast('User successfully deleted', 'text-success');
                    }
                });
        };

        vm.openDeleteModal = function (user) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/common/templates/deleteUserModal.html',
                controller: 'deleteUserModalCtrl',
                resolve: {
                    userToDelete: user
                }
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    deleteUser(user);
                }
            });
        };

        vm.thumbURL = function (url) { return url.substring(0, url.lastIndexOf('.')) + '_thumb.' + url.split('.')[url.split('.').length -1]; };
    }

    function deleteUserModalCtrl ($scope, $uibModalInstance, userToDelete) {
        $scope.user = userToDelete.firstname + ' ' + userToDelete.lastname;
        $scope.ok = function () { $uibModalInstance.close(true); };
        $scope.cancel = function () { $uibModalInstance.dismiss(false); };
    }
})();