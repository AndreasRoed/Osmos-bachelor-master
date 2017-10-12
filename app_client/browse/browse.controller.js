(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('browseCtrl', browseCtrl);

    browseCtrl.$inject = ['$location', 'meanData', 'country', '$q', '$filter', 'toast'];

    function browseCtrl ($location, meanData, country, $q, $filter, toast) {
        var vm = this;

        meanData.getProfile()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.user = data;
            });

        vm.searchTagsProject = [];
        vm.searchTagsResearch = [];
        vm.checkTypes = [];
        vm.checkRegion = [];
        vm.checkFunction = [];
        vm.checkIndustry = [];
        vm.checkAcademic = true;
        vm.checkIndustrial = true;
        vm.industriesSelected = true;
        vm.functionsSelected = true;
        vm.regionsSelected = true;
        vm.typesSelected = true;

        meanData.getAllResearchBrowse()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.researchesArray = data;
            });

        meanData.getAllProjectsBrowse()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.projectsArray = data;
            });

        meanData.getUsersSearch()
            .error(function(err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data) {
                vm.usersArray = data;
            });

        meanData.getApprovedTags()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data){
                vm.tags = data;
            });

        meanData.getIndustries()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data){
                vm.industries = data;
                vm.selectAllIndustries();
            });

        meanData.getFunctions()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data){
                vm.functions = data;
                vm.selectAllFunctions();
            });

        meanData.getRegions()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data){
                vm.regions = data;
                vm.selectAllRegions();
            });

        meanData.getTypes()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data){
                vm.types = data;
                vm.selectAllTypes();
            });

        vm.selectAllIndustries = function() {
            vm.checkIndustry = [];
            if (vm.industriesSelected) {
                for (var i = 0; i < vm.industries.length; i++) {
                    vm.checkIndustry.push(vm.industries[i]._id);
                }
            }
        };
        vm.selectAllFunctions = function() {
            vm.checkFunction = [];
            if (vm.functionsSelected) {
                for (var i = 0; i < vm.functions.length; i++) {
                    vm.checkFunction.push(vm.functions[i]._id);
                }
            }
        };
        vm.selectAllRegions = function() {
            vm.checkRegion = [];
            if (vm.regionsSelected) {
                for (var i = 0; i < vm.regions.length; i++) {
                    vm.checkRegion.push(vm.regions[i]._id);
                }
            }
        };
        vm.selectAllTypes = function() {
            vm.checkTypes = [];
            if (vm.typesSelected) {
                for (var i = 0; i < vm.types.length; i++) {
                    vm.checkTypes.push(vm.types[i]._id);
                }
            }
        };
        vm.filteredTagsAutoComplete = function (query) {
            var deferred = $q.defer();
            deferred.resolve( $filter('filter')(vm.tags, { name: query }));
            return deferred.promise;
        };
        vm.checkProjectsAgainstFilters = function (project) {
            var industryCheck = vm.checkIndustry.indexOf(project.industry) > -1;
            var functionCheck = vm.checkFunction.indexOf(project.function) > -1;
            var regionCheck = vm.checkRegion.indexOf(project.region) > -1;
            var tagCheck = true;

            if (vm.searchTagsProject.length > 0) {
                var projectTagsIdArray = [];
                for (var j = 0; j < project.tags.length; j++) {
                    projectTagsIdArray.push(project.tags[j]._id);
                }
                for (var i = 0; i < vm.searchTagsProject.length; i++) {
                    if (projectTagsIdArray.indexOf(vm.searchTagsProject[i]._id) === -1) {
                        tagCheck = false;
                        break;
                    }
                }
            }
            return industryCheck == true && functionCheck == true && regionCheck == true && tagCheck == true;
        };
        vm.checkResearchAgainstFilters = function (research) {
            var typesCheck = vm.checkTypes.indexOf(research.type) > -1;
            var tagCheck = true;

            if (vm.searchTagsResearch.length > 0) {
                var researchTagsIdArray = [];
                for (var j = 0; j < research.tags.length; j++) {
                    researchTagsIdArray.push(research.tags[j]._id);
                }
                for (var i = 0; i < vm.searchTagsResearch.length; i++) {
                    if (researchTagsIdArray.indexOf(vm.searchTagsResearch[i]._id) === -1) {
                        tagCheck = false;
                        break;
                    }
                }
            }
            return typesCheck == true && tagCheck == true;
        };
        vm.checkUsersAgainstFilters = function (user) {
            if (vm.checkAcademic == true && vm.checkIndustrial == true) {
                return true;
            } else if ((vm.checkAcademic == user.academic) && (vm.checkIndustrial == user.industrial)) {
                return true;
            }
        };
        vm.getCountry = function (code) {
            for (var i = 0; i < country.length; i++) {
                if (country[i].code === code) {
                    return country[i].name;
                }
            }
        };
        vm.showProfile = function(id) { $location.path('/browse/user/' + id); };
        vm.showProject = function(id) { $location.path('/browse/project/' + id); };
        vm.showResearch = function(id) { $location.path('/browse/research/' + id); };
    }
})();