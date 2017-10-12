(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('resetCtrl', resetCtrl);

    resetCtrl.$inject = ['$location', 'authentication', '$routeParams', 'toast'];

    function resetCtrl ($location, authentication, $routeParams, toast) {
        var vm = this;

        vm.credentials = {
            password : "",
            repeatPassword : "",
            token : $routeParams.token
        };

        vm.onSubmit = function() {
            if (vm.credentials.password === vm.credentials.repeatPassword == 0) {
                toast.showToast('Error. New passwords must match', 'text-danger');
            } else if (vm.credentials.password.length < 8) {
                toast.showToast('Error. New password must be at least 8 digits long', 'text-danger');
            } else {
                authentication
                    .resetPassword(vm.credentials)
                    .error(function(err){
                        vm.credentials.password = "";
                        vm.credentials.repeatPassword = "";
                        toast.showToast('Error. ' + err.message, 'text-danger');
                    })
                    .then(function(){
                        localStorage.setItem("passReset", true);
                        $location.path('profile/me');
                    });
            }
        };

        vm.checkPw = function() {
            if(vm.credentials.password != "" && vm.credentials.repeatPassword != "") {
                if(vm.credentials.password === vm.credentials.repeatPassword == 0)
                    return false;
                else return true;
            }
            return false;
        };
    }
})();