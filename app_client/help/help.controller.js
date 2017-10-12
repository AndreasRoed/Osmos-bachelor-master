(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('helpCtrl', helpCtrl);

    helpCtrl.$inject = ['meanData', 'authentication', 'toast'];

    function helpCtrl (meanData, authentication, toast) {
        var vm = this;

        if (authentication.isLoggedIn()) {
            meanData.getProfile()
                .error(function (err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function (data) {
                    vm.user = data;
                });
        }
    }
})();