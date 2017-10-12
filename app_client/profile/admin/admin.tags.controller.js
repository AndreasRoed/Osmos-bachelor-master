(function() {
    'use strict';

    angular
        .module('meanApp')
        .controller('adminTagsCtrl', adminTagsCtrl)
        .controller('deleteTagModalCtrl', deleteTagModalCtrl);

    adminTagsCtrl.$inject = ['meanData', '$uibModal', 'toast'];
    deleteTagModalCtrl.$inject = ['$scope', '$uibModalInstance', 'tagToDelete'];

    function adminTagsCtrl (meanData, $uibModal, toast) {
        var vm = this;

        meanData.getProfile()
            .error(function (err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function (data) {
                vm.user = data;
            });

        vm.itemsByPage = 10;

        meanData.getAllTags()
            .error(function(err) {
                toast.showToast('Error. ' + err.message, 'text-danger');
            })
            .success(function(data) {
                vm.tableTags = data;
            });

        vm.approveTag = function(tag) {
            meanData.approveTag(tag)
                .error(function (err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function () {
                    var index = vm.tableTags.indexOf(tag);
                    if (index !== -1) {
                        vm.tableTags[index].approved = !vm.tableTags[index].approved;
                    }
                });
        };

        vm.deleteTag = function(tag) {
            meanData.deleteTag(tag._id)
                .error(function (err) {
                    toast.showToast('Error. ' + err.message, 'text-danger');
                })
                .success(function () {
                    var index = vm.tableTags.indexOf(tag);
                    if (index !== -1) {
                        vm.tableTags.splice(index, 1);
                        toast.showToast('Tag successfully deleted', 'text-success');
                    }
                });
        };

        vm.openDeleteModal = function (tag) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/common/templates/deleteTagModal.html',
                controller: 'deleteTagModalCtrl',
                resolve: {
                    tagToDelete: tag
                }
            });

            modalInstance.result.then(function (result) {
                if (result) {
                    vm.deleteTag(tag);
                }
            });
        };
    }

    function deleteTagModalCtrl ($scope, $uibModalInstance, tagToDelete) {
        $scope.t = tagToDelete.name;
        $scope.ok = function () { $uibModalInstance.close(true); };
        $scope.cancel = function () { $uibModalInstance.dismiss(false); };
    }
})();