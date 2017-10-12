(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('settingsCtrl', settingsCtrl)
        .controller('settingsModalCtrl', settingsModalCtrl);

    settingsCtrl.$inject = ['meanData', 'toast', '$uibModal', 'authentication', '$scope'];
    settingsModalCtrl.$inject = ['$scope', '$uibModalInstance'];

    function settingsCtrl(meanData, toast, $uibModal, authentication, $scope) {
        var vm = this;

        meanData.getProfile()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.user = data;
                vm.invite = {
                    email : "",
                    byFirstName : data.firstname,
                    byLastName : data.lastname
                };
            });

        vm.onSubmit = function() {
            meanData.inviteUser(vm.invite)
                .error(function (err) {
                    if (err.message.indexOf('14 days') > -1) {
                        $scope.inviteform.email.$error.invited = true;
                    } else if (err.message.indexOf('already registered') > -1) {
                        $scope.inviteform.email.$error.used = true;
                    } else {
                        toast.showToast('Error. ' + err.message, 'text-danger');
                    }
                })
                .success(function () {
                    vm.invite.email = "";
                    $scope.inviteform.email.$error.invited = false;
                    $scope.inviteform.email.$error.used = false;
                    $scope.inviteform.$setPristine();
                    $scope.inviteform.$setUntouched();
                    toast.showToast('User invited', 'text-success');
                });
        };

        var deleteUser = function (id) {
            meanData.deleteUser(id)
                .error(function (err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function () {
                    toast.showToast('Profile deleted successfully', 'text-success');
                    authentication.logout();
                });
        };

        vm.openDeleteAccountModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/common/templates/deleteAccountModal.html',
                controller: 'settingsModalCtrl'
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    deleteUser(authentication.currentUser()._id)
                }
            });
        };
    }
    function settingsModalCtrl ($scope, $uibModalInstance) {
        $scope.ok = function () { $uibModalInstance.close(true); };
        $scope.cancel = function () { $uibModalInstance.dismiss(false); };
    }
})();