(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('projectAllCtrl', projectAllCtrl)
        .controller('deleteProjectModalCtrl', deleteProjectModalCtrl);

    projectAllCtrl.$inject = ['meanData', 'authentication', '$uibModal', '$location', 'toast', 'uploadData', '$filter', '$q'];
    deleteProjectModalCtrl.$inject = ['$scope', '$uibModalInstance', 'projectToDelete'];

    function projectAllCtrl (meanData, authentication, $uibModal, $location, toast, uploadData, $filter, $q) {
        var vm = this;

        meanData.getProfile()
            .error(function (err) {
                toast.showToast("Error. " + err.message, "text-danger");
            })
            .success(function (data) {
                vm.user = data;
            });

        var getProjects = function() {
            meanData.getProjects(authentication.currentUser()._id)
                .error(function (err) {
                    toast.showToast("Error. " + err.message, "text-danger");
                })
                .success(function (data) {
                    vm.projects = data;
                });
        };
        getProjects();

        meanData.getAllTags()
            .error(function(err) {
                toast.showToast("Error. " + err.message, "text-danger");
            })
            .success(function(data) {
                vm.tags = data;
            });

        vm.transformChip = function transformChip(chip, tags) {
            if (angular.isObject(chip)) {
                for (var i = 0; i < tags.length; i++) {
                    if (tags[i]._id == chip._id) {
                        return chip = null;
                    }
                }
                return chip;
            }
            return { name: chip }
        };

        vm.querySearch = function querySearch (query) {
            var deferred = $q.defer();
            deferred.resolve( $filter('filter')(vm.tags, { name: query }));
            return deferred.promise;
        };

        vm.saveProject = function (project, form) {
            meanData.addTags(project.tags)
                .error(function (err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function (data) {
                    project.tags = data;
                    vm.updateProject(project, form);
                });
        };

        vm.updateProject = function (project, form) {
            meanData.updateProject(project)
                .error(function (err) {
                    toast.showToast("Error. " + err.message, "text-danger");
                })
                .success(function () {
                    form.$setPristine();
                    form.$setUntouched();
                    toast.showToast('Project updated successfully', 'text-success');
                });
        };

        vm.disableEnableProject = function (project) {
            meanData.disableEnableProject(project)
                .error(function(err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function() {
                    var index = vm.projects.indexOf(project);
                    if (index !== -1) {
                        vm.projects[index].active = !vm.projects[index].active;
                    }
                });
        };

        vm.uploadProjectPicture = function (file, project) {
            if (file) {
                if (file.size > 1048576) {
                    toast.showToast('Error. Image file size is to big', 'text-danger');
                }
                if (!(/\.(gif|jpg|jpeg|png)$/i).test(file.name)) {
                    toast.showToast('Error. Only .jpg, .jpeg, .png & .gif files are accepted', 'text-danger');
                } else {
                    var rand = Math.random().toString(36).substr(2, 6);
                    uploadData.uploadProjectPicture(file, project, rand)
                        .error(function (err) {
                            toast.showToast('Error. ' + err.message, 'text-danger');
                        })
                        .success(function () {
                            uploadData.createProjectThumb(file, project, rand);
                            meanData.updateProject(project)
                                .error(function(err) {
                                    toast.showToast('Error. ' + err.message, 'text-danger');
                                })
                                .success(function () {
                                    toast.showToast('Project picture successfully uploaded', 'text-success');
                                    getProjects();
                                });
                        });
                }
            }
        };

        var deleteProject = function (project) {
            meanData.deleteProject(project._id)
                .error(function (err) {
                    toast.showToast("Error. " + err.message, "text-danger");
                })
                .success(function() {
                    var index = vm.projects.indexOf(project);
                    if (index !== -1) {
                        vm.projects.splice(index, 1);
                        toast.showToast('Project deleted successfully', 'text-success');
                    }
                });
        };

        vm.showMatches = function(project) { $location.path('profile/matches/project/' + project._id); };

        vm.openDeleteModal = function (project) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/common/templates/deleteProjectModal.html',
                controller: 'deleteProjectModalCtrl',
                resolve: {
                    projectToDelete: project
                }
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    deleteProject(project);
                }
            });
        };
    }
    function deleteProjectModalCtrl ($scope, $uibModalInstance, projectToDelete) {
        $scope.project = projectToDelete.name;
        $scope.ok = function () { $uibModalInstance.close(true); };
        $scope.cancel = function () { $uibModalInstance.dismiss(false); };
    }
})();