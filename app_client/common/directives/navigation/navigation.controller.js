(function () {
    'use strict';

    angular
        .module('meanApp')
        .controller('navigationCtrl', navigationCtrl)
        .controller('loginModalCtrl', loginModalCtrl)
        .controller('newAccountModalCtrl', newAccountModalCtrl);

    navigationCtrl.$inject = ['$location','authentication', '$uibModal', 'facebook', 'linkedin', 'meanData', 'toast'];
    loginModalCtrl.$inject = ['$location', 'authentication', '$scope', '$uibModalInstance'];
    newAccountModalCtrl.$inject = ['$scope', '$uibModalInstance'];

    function navigationCtrl($location, authentication, $uibModal, facebook, linkedin, meanData, toast) {
        var vm = this;

        vm.dropdownUserClass = "dropdown";
        vm.dropdownSettingsClass = "dropdown";
        vm.isActive = function (viewLocation) { return viewLocation === $location.path(); };
        vm.currentUser = authentication.currentUser();

        if (authentication.isLoggedIn()) {
            meanData.getProfile()
                .error(function (err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function (data) {
                    vm.user = data;
                    if (!vm.user.academic && !vm.user.industrial) {
                        openNewAccountModal();
                    }
                });
        }

        vm.logout = function() { authentication.logout(); };
        vm.goToProfile = function(path) { $location.path('profile/' + path); };
        vm.showHome = function() { $location.path('/'); };
        vm.showProfile = function() { $location.path('profile/me'); };
        vm.showRegister = function() { $location.path('register'); };
        vm.showBrowse = function() { $location.path('browse'); };
        vm.showHelp = function() { $location.path('help'); };
        vm.goMyProfile = function() { $location.path('profile/me'); };
        vm.goEditProfile = function() { $location.path('profile/edit'); };
        vm.submitSearch = function() { $location.path('search/' + vm.searchField); };

        vm.showLogin = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/common/templates/loginModal.html',
                controller: 'loginModalCtrl',
                controllerAs: 'vm',
                windowClass: 'loginModal'
            });
            modalInstance.result.then(function (result) {
                if (result === 1) {
                    facebook.facebookLogin();
                }
                if (result === 2) {
                    linkedin.linkedInLogin();
                }
                if (result === 3) {
                    console.log('Maybe?');
                    //twitter.twitterLogin();
                }
            });
        };

        var openNewAccountModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/common/templates/newAccountModal.html',
                controller: 'newAccountModalCtrl'
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    vm.user.academic = true;
                } else {
                    vm.user.industrial = true;
                    vm.user.companyname = vm.user.firstname + " " + vm.user.lastname;
                }
                authentication
                    .updateUser(vm.user)
                    .error(function(err) {
                        toast.showToast('Error. ' + err.message, 'text-danger');
                    })
                    .then(function() {
                        location.reload();
                    });
            });
        };
    }

    function loginModalCtrl ($location, authentication, $scope, $uibModalInstance) {
        var vm = this;

        vm.credentials = {
            email : "",
            password : ""
        };

        vm.onSubmit = function () {
            authentication
                .login(vm.credentials)
                .error(function(err) {
                    vm.credentials.password = "";
                    $scope.error = err.message;
                })
                .then(function(){
                    $location.path('browse');
                    $scope.error = null;
                    $uibModalInstance.close(true);
                });
        };
        
        vm.facebookBtn = function () { $uibModalInstance.close(1); };
        vm.linkedInBtn = function () { $uibModalInstance.close(2); };
        vm.twitterBtn = function () { $uibModalInstance.close(3); };
        
        vm.forgotPassword = function() {
            if (!vm.credentials.email) {
                $scope.error = 'Please enter your email';
            } else {
                authentication.forgotPassword(vm.credentials)
                    .error(function(err) {
                        $scope.error =  err.message;
                    })
                    .success(function(info){
                        $uibModalInstance.dismiss();
                        alert(info.message);
                    })
            }
        };
    }
    function newAccountModalCtrl ($scope, $uibModalInstance) {
        $scope.academicModal = function () { $uibModalInstance.close(true); };
        $scope.industrialModal = function () { $uibModalInstance.close(false); };
    }
})();