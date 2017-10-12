var express = require('express'),
    router = express.Router(),
    jwt = require('express-jwt'),
    passport = require('passport'),
    config = require('../../config/config'),
    path = require('path'),
    auth = jwt({ secret: config.secret, userProperty: 'payload' });

/* CONTROLLERS */
var ctrlUser = require('../controllers/user'),
    ctrlAdmin = require('../controllers/admin'),
    ctrlProject = require('../controllers/projects'),
    ctrlResearch = require('../controllers/research'),
    ctrlTags = require('../controllers/tags'),
    ctrlFb = require('../controllers/auth.fb'),
    ctrlLi = require('../controllers/auth.li.js'),
    ctrlReset = require('../controllers/reset'),
    ctrlUpload = require('../controllers/upload'),
    ctrlCriteria = require('../controllers/criteria'),
    ctrlMatching = require('../controllers/matching');

/* UNPROTECTED ROUTES - FOR REGISTRATION, LOGIN AND FORGOT PASSWORD */
// POST
router.post('/register', ctrlUser.newUser);
router.post('/login', ctrlUser.login);
router.post('/auth/facebook', ctrlFb.loginFacebook);
router.post('/auth/linkedin', ctrlLi.loginLinkedIn);
router.post('/forgot', ctrlReset.forgotPassword);
router.post('/forgot/:token', ctrlReset.resetPassword);
router.post('/activate/:token', ctrlUser.activateUser);

//router.get('/create', ctrlCriteria.createData); // UNCOMMENT ONLY FOR FIRST USAGE, CREATES STATIC DATA WITH HOSTNAME/api/create

/* PROTECTED ROUTES - AVAILABLE TO ALL LOGGED IN USERS, SOME ARE RESTRICTED TO ONLY ACADEMIC/INDUSTRIAL USERS WITHIN THE FUNCTION */
// GET
router.get('/profile', auth, ctrlUser.getProfile);
router.get('/tag', auth, ctrlTags.getAllApprovedTags);
router.get('/project', auth, ctrlProject.getAllProjects);
router.get('/project/single/:id', auth, ctrlProject.getProject);
router.get('/project/browse', auth, ctrlProject.getAllProjectsBrowse);
router.get('/project/browse/:id', auth, ctrlProject.showProject);
router.get('/research', auth, ctrlResearch.getAllResearch);
router.get('/research/single/:id', auth, ctrlResearch.getResearch);
router.get('/research/browse', auth, ctrlResearch.getAllResearchBrowse);
router.get('/research/browse/:id', auth, ctrlResearch.showResearch);
router.get('/user/search', auth, ctrlUser.searchUsers);
router.get('/profile/:id', auth, ctrlUser.showProfile);
router.get('/criteria/industry', auth, ctrlCriteria.getIndustries);
router.get('/criteria/function', auth, ctrlCriteria.getFunctions);
router.get('/criteria/region', auth, ctrlCriteria.getRegions);
router.get('/criteria/types', auth, ctrlCriteria.getTypes);
router.get('/matches/project/:id', auth, ctrlMatching.getMatchesProject);
router.get('/matches/research/:id', auth, ctrlMatching.getMatchesResearch);
// POST
router.post('/tag', auth, ctrlTags.addTags);
router.post('/project', auth, ctrlProject.newProject);
router.post('/research', auth, ctrlResearch.newResearch);
router.post('/invite', auth, ctrlUser.inviteUser);
router.post('/upload/research', auth, ctrlUpload.uploadResearch);
router.post('/upload/picture', auth, ctrlUpload.uploadPicture);
router.post('/upload/project/picture', auth, ctrlUpload.uploadProjectPicture);
router.post('/upload/research/picture', auth, ctrlUpload.uploadResearchPicture);
// PUT
router.put('/register', auth, ctrlUser.updateUser);
router.put('/user/password', auth, ctrlUser.changePassword);
router.put('/research/active', auth, ctrlResearch.changedActiveStatusResearch);
router.put('/project/active', auth, ctrlProject.changedActiveStatusProject);
router.put('/research', auth, ctrlResearch.updateResearch);
router.put('/project', auth, ctrlProject.updateProject);
// DELETE
router.delete('/document/:researchID/:documentID', auth, ctrlResearch.deleteDocument);
router.delete('/research/:id', auth, ctrlResearch.deleteResearch);
router.delete('/project/:id', auth, ctrlProject.deleteProject);
router.delete('/project/:projectID/tag/:tagID', auth, ctrlTags.deleteProjectTag);
router.delete('/research/:researchID/tag/:tagID', auth, ctrlTags.deleteResearchTag);

/* PROTECTED ROUTES - AVAILABLE TO ALL LOGGED IN ADMINISTRATORS */
// GET
router.get('/user', auth, ctrlAdmin.getAllUsers);
router.get('/admin/research', auth, ctrlAdmin.getAllResearch);
router.get('/admin/projects', auth, ctrlAdmin.getAllProjects);
router.get('/tag/all', auth, ctrlTags.getAllTagsAdmin);
// PUT
router.put('/user', auth, ctrlAdmin.changedEnabledStatusUser);
router.put('/user/admin', auth, ctrlAdmin.changeAdminStatusUser);
router.put('/tag', auth, ctrlTags.approveTag);
// DELETE
router.delete('/user/:id', auth, ctrlAdmin.deleteUser);
router.delete('/tag/:id', auth, ctrlTags.deleteTag);

/* TEMP ROUTES */
// url/api/match fra nettleser for å teste matching!
router.get('/match', ctrlMatching.performMatching);

module.exports = router;