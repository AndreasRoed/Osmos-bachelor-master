describe('projectAllCtrl', function() {
    beforeEach(module('meanApp'));

    var createController, scope, authentication, tagRequestHandler, $httpBackend, profileRequestHandler, projectRequestHandler, toastRequestHandler;

    beforeEach(inject(function($controller, $rootScope, _authentication_, _$httpBackend_){
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        profileRequestHandler = $httpBackend.when('GET', '/api/profile').respond();
        projectRequestHandler = $httpBackend.when('GET', '/api/project').respond();
        tagRequestHandler = $httpBackend.when('GET', '/api/tag/all').respond();
        toastRequestHandler = $httpBackend.when('GET', '/common/templates/toast-template.html').respond();

        authentication = _authentication_;

        spyOn(authentication, 'currentUser').and.returnValue('test');
        expect(authentication.currentUser()).toBe('test');

        createController = function() {
            return $controller('projectAllCtrl', {
                '$scope': scope
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
        $httpBackend.expectGET('/api/project');
        $httpBackend.expectGET('/api/tag/all');

        $httpBackend.flush();
    });

    it('get data failed', function () {
        var controller = createController();

        profileRequestHandler.respond(401, {message: 'error'});
        projectRequestHandler.respond(401, {message: 'error'});
        tagRequestHandler.respond(401, {message: 'error'});

        $httpBackend.expectGET('/api/profile');
        $httpBackend.expectGET('/api/project');
        $httpBackend.expectGET('/api/tag/all');
        $httpBackend.expectGET('/common/templates/toast-template.html');

        $httpBackend.flush();
    });
});