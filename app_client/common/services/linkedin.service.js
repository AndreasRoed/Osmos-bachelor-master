(function () {
    'use strict';

    angular
        .module('meanApp')
        .service('linkedin', linkedin);

    linkedin.$inject = ['$http', '$location','$window', 'authentication'];
    function linkedin ($http, $location, $window, authentication) {

        var linkedInLogin = function (type) {
            // want dynamic redirect uri etc here
            var client_id = '';
            var redirect_uri = window.location.protocol.slice(0, window.location.protocol.length - 1) + '%3A%2F%2F' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '');
            var state = '';

            if (!type) {
                state = '00000000'; // no type (from login modal)
            } else if (type == 1) {
                state = '11111111'; // industrial
            } else if (type == 2) {
                state = '22222222'; // academic
            }

            var url = 'https://www.linkedin.com/uas/oauth2/authorization' +
                '?response_type=code' +
                '&client_id=77a19gf2dpnlkp' +
                '&redirect_uri=' + redirect_uri +
                '&state=' + state +
                '&scope=r_basicprofile%20r_emailaddress';

            $window.open(url, '_self');
        };

        var linkedInAuth = function (qs) {
            return $http.post('/api/auth/linkedin', qs);
        };

        return {
            linkedInLogin : linkedInLogin,
            linkedInAuth : linkedInAuth
        };
    }
})();