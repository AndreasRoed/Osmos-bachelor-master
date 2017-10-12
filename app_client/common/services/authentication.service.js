(function () {
    'use strict';

    angular
        .module('meanApp')
        .service('authentication', authentication);

    authentication.$inject = ['$http', '$window', '$location'];
    function authentication ($http, $window, $location) {

        var saveToken = function (token) {
            $window.localStorage['mean-token'] = token;
        };

        var getToken = function () {
            return $window.localStorage['mean-token'];
        };

        var isLoggedIn = function() {
            var token = getToken();
            var payload;

            if(token){
                payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        var currentUser = function() {
            if(isLoggedIn()){
                var token = getToken();
                var payload = token.split('.')[1];
                payload = decodeURIComponent(window.atob(payload));

                // Replace special characters
                payload = payload.replace(/Ã¦/g,"æ");
                payload = payload.replace(/Ã¸/g,"ø");
                payload = payload.replace(/Ã¥/g,"å");

                payload = JSON.parse(payload);

                return {
                    _id: payload._id,
                    firstname: payload.firstname,
                    lastname: payload.lastname,
                    email: payload.email,
                    admin: payload.admin,
                    academic: payload.academic,
                    industrial: payload.industrial,
                    userLevel: payload.userLevel,
                    imageURL: payload.imageURL,
                    companyname: payload.companyname
                };
            }
        };

        var activateAccount = function (token) {
            return $http.post('/api/activate/' + token).success(function(data) {
                saveToken(data.token);
            });
        };

        var registerUser = function(user) {
            return $http.post('/api/register', user);
        };
        var updateUser = function (user) {
            return $http.put('/api/register', user, { headers: { Authorization: 'Bearer ' + getToken() } })
                .success(function(data){
                    saveToken(data.token);
                });
        };
        var changePassword = function (passwords) {
            return $http.put('/api/user/password', passwords, { headers: { Authorization: 'Bearer ' + getToken() } });
        };
        var facebookLogin = function() {
            return $http.get('/api/auth/facebook').success(function(data) {
                saveToken(data.token);
            });
        };

        var login = function(user) {
            return $http.post('/api/login', user)
                .success(function(data) {
                    saveToken(data.token);
                });
        };

        var logout = function() {
            $window.localStorage.removeItem('mean-token');
            if ($location.path() == '/') {
                location.reload();
            } else {
                $location.path('/');
            }
        };

        var forgotPassword = function(user) {
            return $http.post('/api/forgot', user).success(function(data) {});
        };
        var resetPassword = function(user) {
            return $http.post('/api/forgot/' + user.token, user).success(function(data) {
                saveToken(data.token);
            });
        };

        return {
            currentUser : currentUser,
            saveToken : saveToken,
            getToken : getToken,
            isLoggedIn : isLoggedIn,
            registerUser : registerUser,
            changePassword : changePassword,
            updateUser : updateUser,
            login : login,
            logout : logout,
            facebookLogin : facebookLogin,
            forgotPassword : forgotPassword,
            resetPassword : resetPassword,
            activateAccount : activateAccount
        };
    }
})();