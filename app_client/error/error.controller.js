(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('errorCtrl', errorCtrl);

    errorCtrl.$inject = ['$location'];

    function errorCtrl ($location) {
        var vm = this;

        vm.showHelp = function() { $location.path('help'); };
    }
})();