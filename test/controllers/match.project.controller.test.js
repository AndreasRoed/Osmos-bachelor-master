describe('matchProjectCtrl', function() {
    var createController, scope, researchSingleRequestHandler, routeParams, projectSingleRequestHandler, tagRequestHandler, $httpBackend, profileRequestHandler, projectMatchRequestHandler, toastRequestHandler;

    beforeEach(module('meanApp'));
    beforeEach(inject(function($controller, $rootScope, _authentication_, _$httpBackend_){
        scope = $rootScope.$new();
        mockRouteParams();
        $httpBackend = _$httpBackend_;

        profileRequestHandler = $httpBackend.when('GET', '/api/profile').respond();
        projectSingleRequestHandler = $httpBackend.when('GET', '/api/project/single/test').respond({"__v":0,"_id":"573ee18ccff5be32611d7d7c","createdAt":"2016-05-20T10:06:04.920Z","createdBy":"5720b164ede13f1b4419f557","description":"This is a test upload to create  match.","name":"Solar panels","type":"571c6b9e7a6bd5fd0b1ebba3","imageURL":"images/default_research.png","tags":[{"name":"renewable","_id":"573d9f882a86be2a04a825c4"},{"name":"research","_id":"573ee089cff5be32611d7d78"},{"name":"solar","_id":"573ee18ccff5be32611d7d7b"}],"documentURLs":[{"name":"HINGDATA2012_2013_2013-03-06.pdf","URL":"/research/5720b164ede13f1b4419f557/573ee18ccff5be32611d7d7c/HINGDATA2012_2013_2013-03-06-1463738765070.pdf","_id":"573ee18dcff5be32611d7d7d"}],"active":true});
        projectMatchRequestHandler = $httpBackend.when('GET', '/api/matches/project/test').respond([{"researchID":"test","projectID":"test","matchingPercent":66.66666666666666,"matchedAt":"2016-05-20T10:06:19.144Z","_id":"573ee19bcff5be32611d7d7f","__v":0,"matchedTags":[{"name":"renewable","_id":"573d9f882a86be2a04a825c4"},{"name":"research","_id":"573ee089cff5be32611d7d78"}],"collaboration":false,"active":true}]);
        tagRequestHandler = $httpBackend.when('GET', '/api/tag/all').respond([{"name":"testtag1","_id":"57335df6a569498a2c783754","__v":0,"timesUsed":9,"approved":true},{"name":"testtag2","_id":"57335df6a569498a2c783755","__v":0,"timesUsed":8,"approved":true},{"name":"testtag3","_id":"57335df6a569498a2c783756","__v":0,"timesUsed":6,"approved":true},{"name":"testtag4","_id":"57335df7a569498a2c783757","__v":0,"timesUsed":4,"approved":true},{"name":"testtag5","_id":"57335e03a569498a2c783759","__v":0,"timesUsed":3,"approved":true},{"name":"tag","_id":"57337a5da569498a2c78375d","__v":0,"timesUsed":1,"approved":true},{"name":"tag1","_id":"57337a5da569498a2c78375e","__v":0,"timesUsed":7,"approved":true},{"name":"tag2","_id":"57337a5da569498a2c78375f","__v":0,"timesUsed":5,"approved":true},{"name":"tag3","_id":"57337a5da569498a2c783760","__v":0,"timesUsed":4,"approved":true},{"name":"tag4","_id":"57337a5da569498a2c783761","__v":0,"timesUsed":3,"approved":true},{"name":"tag5","_id":"5735d6135e9d1b585406a136","__v":0,"timesUsed":2,"approved":true},{"name":"osi","_id":"5735dd80bdde89345512cfd1","__v":0,"timesUsed":1,"approved":true},{"name":"kebab","_id":"573704353f34d324593d6725","__v":0,"timesUsed":3,"approved":true},{"name":"sauce","_id":"573704353f34d324593d6726","__v":0,"timesUsed":3,"approved":true},{"name":"dill","_id":"573704353f34d324593d6727","__v":0,"timesUsed":2,"approved":true},{"name":"store","_id":"573708e03f34d324593d672b","__v":0,"timesUsed":1,"approved":true},{"name":"asd","_id":"573c98832a86be2a04a825b7","__v":0,"timesUsed":1,"approved":false},{"name":"asdf","_id":"573c98832a86be2a04a825b8","__v":0,"timesUsed":1,"approved":false},{"name":"sdfg","_id":"573c98832a86be2a04a825b9","__v":0,"timesUsed":1,"approved":false},{"name":"fsdfsdf","_id":"573c98832a86be2a04a825ba","__v":0,"timesUsed":1,"approved":false},{"name":"sample","_id":"573d9a362a86be2a04a825bd","__v":0,"timesUsed":1,"approved":false},{"name":"paper","_id":"573d9a362a86be2a04a825be","__v":0,"timesUsed":1,"approved":false},{"name":"test","_id":"573d9a362a86be2a04a825bf","__v":0,"timesUsed":3,"approved":false},{"name":"renewable","_id":"573d9f882a86be2a04a825c4","__v":0,"timesUsed":6,"approved":true},{"name":"hydrophonics","_id":"573d9f882a86be2a04a825c5","__v":0,"timesUsed":2,"approved":false},{"name":"reserach","_id":"573d9f882a86be2a04a825c6","__v":0,"timesUsed":1,"approved":false},{"name":"awd","_id":"573da3d52a86be2a04a825c8","__v":0,"timesUsed":2,"approved":false},{"name":"awdawd","_id":"573da3d52a86be2a04a825c9","__v":0,"timesUsed":3,"approved":false},{"name":"awdawdawdawd","_id":"573da3d52a86be2a04a825ca","__v":0,"timesUsed":2,"approved":false},{"name":"wadwadawdawd","_id":"573da41f2a86be2a04a825cd","__v":0,"timesUsed":1,"approved":false},{"name":"awdawdawdad","_id":"573da41f2a86be2a04a825ce","__v":0,"timesUsed":1,"approved":false},{"name":"research","_id":"573ee089cff5be32611d7d78","__v":0,"timesUsed":5,"approved":true},{"name":"solar","_id":"573ee18ccff5be32611d7d7b","__v":0,"timesUsed":1,"approved":false},{"name":"test1","_id":"573ef6801dfc193b722dbf59","__v":0,"timesUsed":2,"approved":false},{"name":"test2","_id":"573ef6801dfc193b722dbf5a","__v":0,"timesUsed":2,"approved":false}]);
        researchSingleRequestHandler = $httpBackend.when('GET', '/api/research/single/test').respond({"__v":0,"_id":"573ee18ccff5be32611d7d7c","createdAt":"2016-05-20T10:06:04.920Z","createdBy":"5720b164ede13f1b4419f557","description":"This is a test upload to create  match.","name":"Solar panels","type":"571c6b9e7a6bd5fd0b1ebba3","imageURL":"images/default_research.png","tags":[{"name":"renewable","_id":"573d9f882a86be2a04a825c4"},{"name":"research","_id":"573ee089cff5be32611d7d78"},{"name":"solar","_id":"573ee18ccff5be32611d7d7b"}],"documentURLs":[{"name":"HINGDATA2012_2013_2013-03-06.pdf","URL":"/research/5720b164ede13f1b4419f557/573ee18ccff5be32611d7d7c/HINGDATA2012_2013_2013-03-06-1463738765070.pdf","_id":"573ee18dcff5be32611d7d7d"}],"active":true});
        toastRequestHandler = $httpBackend.when('GET', '/common/templates/toast-template.html').respond();

        function mockRouteParams() {
            routeParams = jasmine.createSpy('$routeParams');
        }

        routeParams.id = 'test';
        expect(routeParams.id).toBe('test');

        createController = function() {
            return $controller('matchProjectCtrl', {
                '$scope' : scope,
                '$routeParams' : routeParams
            });
        };
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('get data', function () {
        var controller = createController();

        $httpBackend.expectGET('/api/profile');
        $httpBackend.expectGET('/api/project/single/test');
        $httpBackend.expectGET('/api/matches/project/test');
        $httpBackend.expectGET('/api/tag/all');
        $httpBackend.expectGET('/api/research/single/test');

        controller.matchedObjects = [{researchID:'test'}];
        controller.indexOfResearch('test');

        $httpBackend.flush();
    });

    it('get data failed', function () {
        var controller = createController();

        profileRequestHandler.respond(401, {message: 'error'});
        projectSingleRequestHandler.respond(401, {message: 'error'});
        projectMatchRequestHandler.respond(401, {message: 'error'});
        tagRequestHandler.respond(401, {message: 'error'});

        $httpBackend.expectGET('/api/profile');
        $httpBackend.expectGET('/api/project/single/test');
        $httpBackend.expectGET('/api/matches/project/test');
        $httpBackend.expectGET('/api/tag/all');

        $httpBackend.flush();
    });
});