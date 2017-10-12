(function() {
    'use strict';

    angular
        .module('meanApp')
        .service('toast', toast)
        .controller('toastCtrl', toastCtrl);

    toast.$inject = ['$mdToast'];
    toastCtrl.$inject = ['$scope', '$mdToast', 'toastText', 'toastColor'];

    function toast($mdToast) {

        var delay = 5000;

        var showToast = function(text, color) {

            $mdToast.show({
                hideDelay: delay,
                position: 'bottom right',
                controller: 'toastCtrl',
                templateUrl: '/common/templates/toast-template.html',
                locals: {
                    toastText: text,
                    toastColor: color
                }
            });
        };
        return {
            showToast : showToast
        };
    }

    function toastCtrl ($scope, $mdToast, toastText, toastColor) {
        $scope.toastText = toastText;
        $scope.toastColor = toastColor;
        $scope.closeToast = function () { $mdToast.hide(); };
    }
    
})();