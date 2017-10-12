(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('industrialRegCtrl', industrialRegCtrl)
        .controller('academicRegCtrl', academicRegCtrl);

    industrialRegCtrl.$inject = ['$location', 'authentication', '$scope', 'country', 'facebook', 'linkedin', 'toast'];
    academicRegCtrl.$inject = ['$location', 'authentication', '$scope', 'country', 'facebook', 'linkedin', 'toast'];

    function industrialRegCtrl ($location, authentication, $scope, country, facebook, linkedin, toast) {
        var vm = this;

        vm.tab1 = true;
        vm.tab2 = false;
        vm.tab3 = false;

        vm.regStart = function(){
            vm.tab1 = true;
            vm.tab2 = false;
            vm.tab3 = false;
        };
        vm.tab1click = function() {
            vm.tab1 = false;
            vm.tab2 = true;
            vm.tab3 = false;
        };

        $scope.countries = country;

        vm.credentials = {
            firstname : "",
            lastname : "",
            companyname : "",
            email : "",
            country : "",
            city : "",
            about : "",
            born : "",
            subscription : "false",
            gender : "",
            zipcode : "",
            phone : "",
            address : "",
            password : "",
            repeatPassword : "",
            industrial : "true",
            academic : "false",
            job_place : "",
            job_title : ""
        };

        vm.checkPw = function() {
            if(vm.credentials.password != "" && vm.credentials.repeatPassword != "") {
                if(vm.credentials.password === vm.credentials.repeatPassword == 0)
                    return false;
                else return true;
            }
            return false;
        };

        vm.onSubmit = function() {
            authentication
                .registerUser(vm.credentials)
                .error(function(err){
                    if (err.message.indexOf('email') > -1) {
                        vm.regStart();
                        $scope.regform.email.$error.used = true;
                    } else {
                        toast.showToast('Error. ' + err.message, 'text-danger');
                    }
                })
                .then(function(){
                    $location.path('/confirmation/' + vm.credentials.email);
                });
        };
        vm.facebookBtn = function () { facebook.facebookLogin(1); };
        vm.linkedInBtn = function () { linkedin.linkedInLogin(1); };
    }

    function academicRegCtrl ($location, authentication, $scope, country, facebook, linkedin, toast) {
        var vm = this;

        vm.tab1 = true;
        vm.tab2 = false;
        vm.tab3 = false;

        vm.regStart = function(){
            vm.tab1 = true;
            vm.tab2 = false;
            vm.tab3 = false;
        };
        vm.tab1click = function() {
            vm.tab1 = false;
            vm.tab2 = true;
            vm.tab3 = false;
        };
        vm.tab2click = function() {
            vm.tab1 = false;
            vm.tab2 = false;
            vm.tab3 = true;
        };

        $scope.countries = country;

        vm.credentials = {
            firstname : "",
            lastname : "",
            companyname : "",
            email : "",
            country : "",
            city : "",
            about : "",
            born : "",
            subscription : "false",
            gender : "",
            zipcode : "",
            phone : "",
            address : "",
            password : "",
            repeatPassword : "",
            industrial : "false",
            academic : "true",
            job_place : "",
            job_title : ""
        };

        vm.checkPw = function() {
            if(vm.credentials.password != "" && vm.credentials.repeatPassword != "") {
                if(vm.credentials.password === vm.credentials.repeatPassword == 0)
                    return false;
                else return true;
            }
            return false;
        };

        vm.onSubmit = function() {
            authentication
                .registerUser(vm.credentials)
                .error(function(err){
                    if (err.message.indexOf('email') > -1) {
                        vm.regStart();
                        $scope.regform.email.$error.used = true;
                    } else {
                        toast.showToast('Error. ' + err.message, 'text-danger');
                    }
                })
                .then(function(){
                    $location.path('/confirmation/' + vm.credentials.email);
                });
        };
        vm.facebookBtn = function () { facebook.facebookLogin(2); };
        vm.linkedInBtn = function () { linkedin.linkedInLogin(2); };
    }
})();