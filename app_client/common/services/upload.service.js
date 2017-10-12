(function() {
    'use strict';

    angular
        .module('meanApp')
        .service('uploadData', uploadData);

    uploadData.$inject = ['authentication', 'Upload'];

    function uploadData (authentication, Upload) {

        var uploadResearch = function (file, research) {
            var currentUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '');
             return Upload.upload({
                url: currentUrl + '/api/upload/research',
                headers: { Authorization: 'Bearer ' + authentication.getToken() },
                data: { 'userID':research.createdBy, 'projectID':research._id, file:file }
            });
        };

        var uploadPicture = function (file, uploader, rand) {
            var currentUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '');
            var fileExt = file.name.split('.')[file.name.split('.').length -1];
            var newFile = Upload.rename(file, rand + "." + fileExt);
            return Upload.upload({
                url: currentUrl + '/api/upload/picture',
                headers: { Authorization: 'Bearer ' + authentication.getToken() },
                data: { 'userID':uploader, file:newFile }
            });
        };

        var createThumb = function (file, uploader, rand) {
            var currentUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '');
            var fileExt = file.name.split('.')[file.name.split('.').length -1];
            Upload.resize(file, 50, 50, 0.8, "image/" + fileExt).then(
                function(resizedFile){
                    resizedFile = Upload.rename(resizedFile, rand + "_thumb." + fileExt);
                    return Upload.upload({
                        url: currentUrl + '/api/upload/picture',
                        headers: { Authorization: 'Bearer ' + authentication.getToken() },
                        data: { 'userID':uploader, file:resizedFile }
                    });
                });
        };

        var uploadProjectPicture = function (file, project, rand) {
            var currentUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '');
            var fileExt = file.name.split('.')[file.name.split('.').length -1];
            var newFile = Upload.rename(file, rand + "." + fileExt);
            return Upload.upload({
                url: currentUrl + '/api/upload/project/picture',
                headers: { Authorization: 'Bearer ' + authentication.getToken() },
                data: { 'userID':project.createdBy, 'projectID':project._id, file:newFile }
            });
        };

        var createProjectThumb = function (file, project, rand) {
            var currentUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '');
            var fileExt = file.name.split('.')[file.name.split('.').length -1];
            Upload.resize(file, 50, 50, 0.8, "image/" + fileExt).then(
                function(resizedFile){
                    resizedFile = Upload.rename(resizedFile, rand + "_thumb." + fileExt);
                    return Upload.upload({
                        url: currentUrl + '/api/upload/project/picture',
                        headers: { Authorization: 'Bearer ' + authentication.getToken() },
                        data: { 'userID':project.createdBy, 'projectID':project._id, file:resizedFile }
                    });
                });
        };

        var uploadResearchPicture = function (file, research, rand) {
            var currentUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '');
            var fileExt = file.name.split('.')[file.name.split('.').length -1];
            var newFile = Upload.rename(file, rand + "." + fileExt);
            return Upload.upload({
                url: currentUrl + '/api/upload/research/picture',
                headers: { Authorization: 'Bearer ' + authentication.getToken() },
                data: { 'userID':research.createdBy, 'researchID':research._id, file:newFile }
            });
        };

        var createResearchThumb = function (file, research, rand) {
            var currentUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '');
            var fileExt = file.name.split('.')[file.name.split('.').length -1];
            Upload.resize(file, 50, 50, 0.8, "image/" + fileExt).then(
                function(resizedFile){
                    resizedFile = Upload.rename(resizedFile, rand + "_thumb." + fileExt);
                    return Upload.upload({
                        url: currentUrl + '/api/upload/research/picture',
                        headers: { Authorization: 'Bearer ' + authentication.getToken() },
                        data: { 'userID':research.createdBy, 'researchID':research._id, file:resizedFile }
                    });
                });
        };

        return {
            uploadResearch : uploadResearch,
            uploadPicture : uploadPicture,
            createThumb : createThumb,
            uploadProjectPicture :uploadProjectPicture,
            createProjectThumb : createProjectThumb,
            uploadResearchPicture : uploadResearchPicture,
            createResearchThumb : createResearchThumb
        };
    }
})();