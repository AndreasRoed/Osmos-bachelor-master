describe('adminProjectsCtrl', function() {
    beforeEach(module('meanApp'));

    var createController, scope, authentication, userRequestHandler, $httpBackend, profileRequestHandler, projectRequestHandler, toastRequestHandler;

    beforeEach(inject(function($controller, $rootScope, _authentication_, _$httpBackend_){
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        profileRequestHandler = $httpBackend.when('GET', '/api/profile').respond();
        userRequestHandler = $httpBackend.when('GET', '/api/user').respond();
        projectRequestHandler = $httpBackend.when('GET', '/api/admin/projects').respond();
        toastRequestHandler = $httpBackend.when('GET', '/common/templates/toast-template.html').respond();

        authentication = _authentication_;

        spyOn(authentication, 'currentUser').and.returnValue('test');
        expect(authentication.currentUser()).toBe('test');

        createController = function() {
            return $controller('adminProjectsCtrl', {
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
        $httpBackend.expectGET('/api/admin/projects');
        $httpBackend.expectGET('/api/user');

        $httpBackend.flush();
    });

    it('get data failed', function () {
        var controller = createController();

        profileRequestHandler.respond(401, {message: 'error'});
        projectRequestHandler.respond(401, {message: 'error'});
        userRequestHandler.respond(401, {message: 'error'});

        $httpBackend.expectGET('/api/profile');
        $httpBackend.expectGET('/api/admin/projects');
        $httpBackend.expectGET('/api/user');
        $httpBackend.expectGET('/common/templates/toast-template.html');

        $httpBackend.flush();
    });
});