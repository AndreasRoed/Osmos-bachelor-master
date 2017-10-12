(function() {
    'use strict';

    angular
        .module('meanApp')
        .service('meanData', meanData);

    meanData.$inject = ['$http', 'authentication'];
    function meanData ($http, authentication) {
        /*
            TAGS
         */
        var getApprovedTags = function () {
            return $http.get('/api/tag', { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var addTags = function(tags) {
            return $http.post('/api/tag', tags, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var approveTag = function(tag) {
            return $http.put('/api/tag/', tag, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var deleteTag = function(id) {
            return $http.delete('/api/tag/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var deleteProjectTag = function(project, tag) {
            return $http.delete('/api/project/' + project + '/tag/' + tag, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var deleteResearchTag = function(research, tag) {
            return $http.delete('/api/research/' + research + '/tag/' + tag, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var getAllTags = function() {
            return $http.get('/api/tag/all', { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        /*
            USERS
         */
        var getProfile = function () {
            return $http.get('/api/profile', { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var getAllUsers = function () {
            return $http.get('/api/user', { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var getAllResearch = function () {
            return $http.get('/api/admin/research', { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var getAllProjects = function () {
            return $http.get('/api/admin/projects', { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var disableEnableUser = function (user) {
            return $http.put('/api/user', user, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var adminUser = function (user) {
            return $http.put('/api/user/admin', user, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var deleteUser = function (id) {
            return $http.delete('/api/user/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var inviteUser = function (invite) {
            return $http.post('/api/invite/', invite, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        /*
            PROJECTS
         */
        var createProject = function(project) {
            return $http.post('/api/project', project, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var getOneProject = function (id) {
            return $http.get('/api/project/single/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var getProjects = function () {
            return $http.get('/api/project', { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var getAllProjectsBrowse = function () {
            return $http.get('/api/project/browse', { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var showProject = function(id) {
            return $http.get('/api/project/browse/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var disableEnableProject = function (project) {
            return $http.put('/api/project/active', project, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var deleteProject = function (id) {
            return $http.delete('/api/project/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var updateProject = function (project) {
            return $http.put('/api/project', project, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        /*
            RESEARCH
         */
        var createResearch = function(research) {
            return $http.post('/api/research', research, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var getOneResearch = function (id) {
            return $http.get('/api/research/single/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var getResearch = function () {
            return $http.get('/api/research', { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var getAllResearchBrowse = function () {
            return $http.get('/api/research/browse', { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var showResearch = function(id) {
            return $http.get('/api/research/browse/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var deleteResearch = function (id) {
            return $http.delete('/api/research/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var disableEnableResearch = function (research) {
            return $http.put('/api/research/active', research, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var deleteDocument = function (research, document) {
            return $http.delete('/api/document/' + research._id + '/' + document._id, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var updateResearch = function (research) {
            return $http.put('/api/research', research, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        /*
            SEARCH
         */
        var getUsersSearch = function () {
            return $http.get('/api/user/search', { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var showProfile = function(id) {
            return $http.get('/api/profile/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        /*
            CRITERIA / REGISTRATION
         */
        var getRegions = function() {
            return $http.get('/api/criteria/region', { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var getIndustries = function() {
            return $http.get('/api/criteria/industry', { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var getFunctions = function() {
            return $http.get('/api/criteria/function', { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var getTypes = function() {
            return $http.get('/api/criteria/types', { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        /*
            MATCHING
         */
        var getMatchesProject = function(id) {
            return $http.get('/api/matches/project/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        var getMatchesResearch = function(id) {
            return $http.get('/api/matches/research/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
        };
        return {
            getProfile : getProfile,
            getAllUsers : getAllUsers,
            getAllResearch : getAllResearch,
            getAllProjects : getAllProjects,
            disableEnableUser : disableEnableUser,
            adminUser : adminUser,
            deleteUser : deleteUser,
            createProject : createProject,
            getProjects : getProjects,
            getAllProjectsBrowse : getAllProjectsBrowse,
            showProject : showProject,
            createResearch : createResearch,
            getResearch : getResearch,
            getAllResearchBrowse : getAllResearchBrowse,
            showResearch : showResearch,
            deleteResearch : deleteResearch,
            disableEnableResearch : disableEnableResearch,
            disableEnableProject : disableEnableProject,
            deleteDocument : deleteDocument,
            getApprovedTags : getApprovedTags,
            addTags : addTags,
            getAllTags : getAllTags,
            approveTag : approveTag,
            deleteTag : deleteTag,
            deleteProjectTag :deleteProjectTag,
            deleteResearchTag : deleteResearchTag,
            getUsersSearch : getUsersSearch,
            showProfile : showProfile,
            getIndustries : getIndustries,
            getFunctions : getFunctions,
            getRegions : getRegions,
            getTypes : getTypes,
            getMatchesProject : getMatchesProject,
            getMatchesResearch : getMatchesResearch,
            deleteProject : deleteProject,
            updateResearch : updateResearch,
            updateProject : updateProject,
            getOneProject : getOneProject,
            getOneResearch : getOneResearch,
            inviteUser : inviteUser
        };
    }
})();