(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('profileMeCtrl', profileMeCtrl)
        .controller('profileModalCtrl', profileModalCtrl);

    profileMeCtrl.$inject = ['meanData', '$uibModal', 'authentication', 'country', 'uploadData', '$scope', 'toast'];
    profileModalCtrl.$inject = ['$scope', '$uibModalInstance'];

    function profileMeCtrl(meanData, $uibModal, authentication, country, uploadData, $scope, toast) {
        var vm = this;

        vm.countries = country;
        vm.genders = [ "Male", "Female", "Other" ];
        
        vm.password = {
            _id: "",
            oldPassword: "",
            newPassword: "",
            repeatNewPassword: ""
        };

        var getProfile = function () {
            meanData.getProfile()
                .error(function (err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function (data) {
                    vm.user = data;
                    vm.user.born = new Date(vm.user.born);
                });
        };
        getProfile();

        vm.uploadProfilePicture = function (file) {
            if (file) {
                if (file.size > 1048576) {
                    toast.showToast('Error. Image file size is to big', 'text-danger');
                }
                if (!(/\.(gif|jpg|jpeg|png)$/i).test(file.name)) {
                    toast.showToast('Error. Only .jpg, .jpeg, .png & .gif files are accepted', 'text-danger');
                } else {
                    var rand = Math.random().toString(36).substr(2, 6);
                    uploadData.uploadPicture(file, vm.user._id, rand)
                        .error(function (err) {
                            toast.showToast('Error. ' + err.message, 'text-danger');
                        })
                        .success(function () {
                            uploadData.createThumb(file, vm.user._id, rand);
                            authentication.updateUser(vm.user)
                                .error(function(err) {
                                    toast.showToast('Error. ' + err.message, 'text-danger');
                                })
                                .success(function () {
                                    toast.showToast('Profile picture successfully uploaded', 'text-success');
                                    getProfile();
                                });
                        });
                }
            }
        };

        vm.checkPw = function() {
            if(vm.password.newPassword != "" && vm.password.repeatNewPassword != "") {
                if(vm.password.newPassword === vm.password.repeatNewPassword == 0)
                    return false;
                else return true;
            }
            return false;
        };

        vm.openPassChangeAccountModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/common/templates/passChangeModal.html',
                controller: 'profileModalCtrl'
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    if (vm.password.newPassword === vm.password.repeatNewPassword == 0) {
                        toast.showToast('Error. New passwords must match', 'text-danger');
                    } else if (vm.password.newPassword.length < 8) {
                        toast.showToast('Error. New password must be at least 8 digits long', 'text-danger');
                    } else if (vm.password.oldPassword == null && vm.user.pwdSalt) {
                        toast.showToast('Error. Old password is required', 'text-danger');
                    } else {
                        vm.password._id = vm.user._id;
                        authentication.changePassword(vm.password)
                            .error(function (err) {
                                toast.showToast('Error. ' + err.message, 'text-danger');
                            })
                            .success(function () {
                                toast.showToast('Your password has been successfully changed', 'text-success');
                                vm.password = {};
                                $scope.passwordform.$setPristine();
                                $scope.passwordform.$setUntouched();
                                getProfile();
                            });
                    }
                }
            });
        };

        vm.openSaveAccountModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/common/templates/saveAccountModal.html',
                controller: 'profileModalCtrl'
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    authentication
                        .updateUser(vm.user)
                        .error(function(err) {
                            toast.showToast('Error. ' + err.message, 'text-danger');
                        })
                        .success(function() {
                            $scope.profileform.$setPristine();
                            $scope.profileform.$setUntouched();
                            toast.showToast('Profile updated successfully', 'text-success');
                            getProfile();
                        });
                }
            });
        };

        angular.element(document).ready(function () {
           if (localStorage.getItem("passReset")) {
                toast.showToast('Password reset successfully', 'text-success');
                localStorage.removeItem("passReset");
            }
        });
    }
    function profileModalCtrl ($scope, $uibModalInstance) {
        $scope.ok = function () { $uibModalInstance.close(true); };
        $scope.cancel = function () { $uibModalInstance.dismiss(false); };
    }
})();