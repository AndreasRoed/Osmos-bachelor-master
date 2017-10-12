(function () {
    'use strict';

    angular
        .module('meanApp')
        .service('facebook', facebook);

    facebook.$inject = ['$http', '$location','$window', 'authentication'];
    function facebook ($http, $location, $window, authentication) {

        // Asynchronously initialize Facebook SDK
        $window.fbAsyncInit = function() {
            FB.init({
                appId: '685588878210137',
                responseType: 'token',
                version: 'v2.0'
            });
        };
        // Asynchronously load Facebook SDK
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        var facebookLogin = function (type) {
            FB.login(function(response) {
                FB.api('/me?locale=en_US&fields=first_name,last_name,email,hometown,locale,location', function(profile) {
                    if (!profile || profile.error) {
                        alert(profile.error.message);
                    } else {
                        var data = {
                            // for type, 1 = industrial, 2 = academic
                            signedRequest: response.authResponse.signedRequest,
                            profile: profile,
                            type: type
                        };
                        $http.post('/api/auth/facebook', data)
                            .success(function(data) {
                                authentication.saveToken(data.token);
                                $location.path('browse');
                            });
                    }
                });
            }, {scope: 'email'});
        };
        return {
            facebookLogin : facebookLogin
        };
    }
})();